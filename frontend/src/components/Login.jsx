import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useAuth} from '../context/auth.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth,setAuth]=useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            setAuth({
                ...auth,
                user: data.user, // Update to use data.user
                token: data.token, // Update to use data.token
            });
            localStorage.setItem("auth", JSON.stringify(data)); 
            toast.success(data.msg);
            navigate('/home');
        } else {
            toast.error(data.msg);
        }
    };
    
    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={headerStyle}>Login</h2>
                <div style={inputGroupStyle}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={inputStyle}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Login</button>
                <Link to="/mobile-login" style={linkStyle}>Login with mobile number</Link>
            </form>
        </div>
    );
};

// Styles
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 60px)', /* Adjust height to account for the header/footer */
    backgroundColor: '#f4f4f4',
};

const formStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
    marginBottom: '40px',
};

const headerStyle = {
    marginBottom: '20px',
};

const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
};

const linkStyle = {
    display: 'block',
    marginTop: '10px',
    color: '#333',
    textDecoration: 'none',
};


export default Login;
