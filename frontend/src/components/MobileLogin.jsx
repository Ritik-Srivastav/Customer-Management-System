import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/auth.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MobileLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(true);
    const navigate = useNavigate();
    const [auth,setAuth]=useAuth();

    const handleGenerateOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/generate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phonenumber: phoneNumber }),
            });
            
            // if (!response.ok) {
            //     const errorText = await response.text();
            //     throw new Error(`Server Error: ${errorText}`);
            // }

            const data = await response.json();
            setIsOtpSent(true);
            toast.success(data.msg);
        } catch (error) {
            console.error('Error generating OTP:', error);
            toast.error("OTP Sent Failed , Number Not Verified");
        }
    };

    
    const handleValidateOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phonenumber: phoneNumber, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setAuth({
                    ...auth,
                    user: data.user, // Update to use data.user
                    token: data.token, // Update to use data.token
                });
                localStorage.setItem("auth", JSON.stringify(data)); // Store data, not response.data
                toast.success(data.msg);
                navigate('/home');
            } else {
               toast.error(data.msg);
            }
        } catch (error) {
            console.error('Error validating OTP:', error);
            alert('Failed to validate OTP');
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleValidateOtp} style={formStyle}>
                <h2 style={headerStyle}>Login with Mobile Number</h2>
                <div style={inputGroupStyle}>
                    <label>Phone Number:</label>
                    <input 
                        type="text" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                        style={inputStyle}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label>OTP:</label>
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required={isOtpSent} 
                        style={inputStyle}
                    />
                </div>
                    <button type="button" onClick={handleGenerateOtp} style={generateOtpButtonStyle}>Generate OTP</button>
                    <button type="submit" style={validateOtpButtonStyle}>Validate OTP</button>
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

const generateOtpButtonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
};

const validateOtpButtonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
};

export default MobileLogin;
