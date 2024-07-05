import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <p>© 2024 CMS Company</p>
        </footer>
    );
};

// Styles
const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
    position: 'fixed',
    bottom: '0',
    width: '100%',
};

export default Footer;
