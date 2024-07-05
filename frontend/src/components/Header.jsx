import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({
            ...auth, user: null, token: ''
        });
        localStorage.removeItem('auth'); // Ensure to remove the 'auth' item instead of 'token'
        toast.success("Logout Successfully");
        navigate('/login');
    };

    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                <div style={leftContainer}>
                    <h1 style={companyName}>CMS</h1>
                </div>
                <div style={rightContainer}>
                    {auth.user ? (
                        <div style={authContainer}>
                            <div style={usernameContainer}>
                                <FontAwesomeIcon icon={faUser} style={iconStyle} />
                                <h1 style={usernameStyle}>{auth.user.username}</h1>
                            </div>
                            <button style={buttonStyle} onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/register" style={linkStyle}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// Styles
const headerStyle = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 0',
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
};

const authContainer = {
    display: 'flex',
    alignItems: 'center',
};

const usernameContainer = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px', // Add some space between the username and the logout button
};

const leftContainer = {
    display: 'flex',
    alignItems: 'center',
};

const rightContainer = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right',
};

const companyName = {
    margin: '0',
    fontSize: '32px', // Increase the font size
    fontWeight: 'bold', // Make the text bold
    fontFamily: "'Roboto', sans-serif", // Use a different font family
    background: 'linear-gradient(45deg, #f3ec78, #af4261)', // Add a gradient background
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', // Make the text transparent to show the gradient
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)', // Add a shadow effect
};

const usernameStyle = {
    margin: '0 0 0 10px', // Add some space between the icon and the username
    fontSize: '24px',
};

const buttonStyle = {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '20px',
};

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '10px',
};

const iconStyle = {
    fontSize: '24px',
};

export default Header;
