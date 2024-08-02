'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const pageStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f0f5f9', // Soft background color
    minHeight: '100vh',
    color: '#333',
    fontFamily: '"Poppins", sans-serif',
  },
  header: {
    backgroundColor: '#00796b',
    color: '#fff',
    padding: '1.5rem 3rem',
    borderRadius: '10px',
    textAlign: 'center',
    width: '80%',
    maxWidth: '800px',
    marginBottom: '2.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontSize: '2rem',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
  },
  roadmapButtonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '600px',
  },
  button: {
    backgroundColor: '#ff4081',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: '600',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 8px 15px rgba(0, 118, 255, 0.24)',
  },
  buttonHover: {
    backgroundColor: '#ff6e40',
    transform: 'scale(1.05)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    width: '100%',
  },
  image: {
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0, 118, 255, 0.24)',
  },
};

const Roadmap = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [isHover, setIsHover] = useState({ frontend: false, backend: false, back: false });

  const handleMouseOver = (type) => {
    setIsHover({ ...isHover, [type]: true });
  };

  const handleMouseOut = (type) => {
    setIsHover({ ...isHover, [type]: false });
  };

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        Web Development Roadmap
      </header>

      {!selectedRoadmap ? (
        <>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '26px' }}>
            Select a Track To Continue Your Journey
          </p>
          <div style={pageStyles.roadmapButtonContainer}>
            <button
              style={isHover.frontend ? { ...pageStyles.button, ...pageStyles.buttonHover } : pageStyles.button}
              onClick={() => setSelectedRoadmap('frontend')}
              onMouseOver={() => handleMouseOver('frontend')}
              onMouseOut={() => handleMouseOut('frontend')}
            >
              Frontend
            </button>
            <button
              style={isHover.backend ? { ...pageStyles.button, ...pageStyles.buttonHover } : pageStyles.button}
              onClick={() => setSelectedRoadmap('backend')}
              onMouseOver={() => handleMouseOver('backend')}
              onMouseOut={() => handleMouseOut('backend')}
            >
              Backend
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={pageStyles.imageContainer}>
            {selectedRoadmap === 'frontend' ? (
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2FColorful%20Modern%20Business%20Chronology%20Timeline%20Infographic.png?alt=media&token=5648d9f0-e6c1-415e-b33c-3bca97554b6e"
                alt="Frontend"
                width={800}
                height={600}
                style={pageStyles.image}
              />
            ) : (
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2Fbackend-2.png?alt=media&token=20866306-ee75-4235-9bf1-11206066338b"
                alt="Backend"
                width={800}
                height={600}
                style={pageStyles.image}
              />
            )}
          </div>
          <br>
          
          </br>
          
          <button
            style={isHover.back ? { ...pageStyles.button, ...pageStyles.buttonHover } : pageStyles.button}
            onClick={() => setSelectedRoadmap(null)}
            onMouseOver={() => handleMouseOver('back')}
            onMouseOut={() => handleMouseOut('back')}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default Roadmap;
