import React from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

     // Redirect to login if not authenticated
     if (!auth.user._id) {
        navigate('/login');
        return null;
    }

    const handleUpdate = async (field, newValue) => {
        try {
            const response = await fetch(`http://localhost:5000/user/${auth.user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [field]: newValue,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setAuth({
                    ...auth,
                    user: updatedUser,
                });
                // Update local storage
                localStorage.setItem('auth', JSON.stringify({
                    ...auth,
                    user: updatedUser,
                }));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                const response = await fetch(`http://localhost:5000/user/${auth.user._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Clear local storage and navigate to login page
                    setAuth({
                        ...auth, user: null, token: ''
                    });
                    localStorage.removeItem('auth'); // Ensure to remove the 'auth' item instead of 'token'
                    navigate('/login');
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div style={containerStyle}>
            <h1>User Details</h1>
            <div style={userInfoStyle}>
                <div>
                    <strong>Username:</strong> {auth.user.username}
                    <button style={buttonStyle} onClick={() => handleUpdate('username', prompt('Enter new username:', auth.user.username))}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
                <div>
                    <strong>Email:</strong> {auth.user.email}
                    <button style={buttonStyle} onClick={() => handleUpdate('email', prompt('Enter new email:', auth.user.email))}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
                <div>
                    <strong>Phone Number:</strong> {auth.user.phonenumber}
                    <button style={buttonStyle} onClick={() => handleUpdate('phonenumber', prompt('Enter new phone number:', auth.user.phonenumber))}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
                <div>
                    <strong>Password:</strong> {auth.user.password}
                    <button style={buttonStyle} onClick={() => handleUpdate('password', prompt('Enter new password:'))}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
                <button style={deleteButtonStyle} onClick={handleDeleteUser}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                    Delete User
                </button>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const userInfoStyle = {
    marginTop: '20px',
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '10px',
};

const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    color: '#fff',
}

export default Home;