import React from 'react';

const SectionPage = () => {
    return (
        <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '20vh',
            backgroundColor: '#fff' // White background for the page
        }}>
            <h1 style={{
                fontSize: '46px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #338EF7, #FF8C00)', // Gradient color
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
            }}>
                Magic of Web Dev
            </h1>
        </div>
    );
};

export default SectionPage;
