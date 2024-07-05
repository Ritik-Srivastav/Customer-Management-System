import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import MobileLogin from './components/MobileLogin';
import NotFound from './components/NotFound';


const isLoggedIn = () => {
    // Check if user is logged in or token exists in localStorage
    const token = localStorage.getItem('auth'); 
    return !!token; // Return true if token exists, false otherwise
};

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={isLoggedIn() ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/mobile-login" element={<MobileLogin />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
