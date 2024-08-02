'use client'

import React from 'react';
import Image from 'next/image';
import { FaLock } from 'react-icons/fa'; // Changed to FaLock for a more prominent icon

const pageStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontFamily: '"Poppins", sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#e0e0e0',
  },
  certificateWrapper: {
    position: 'relative',
    width: '80vw',
    maxWidth: '800px',
    height: '450px',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
    marginBottom: '2rem',
    background: 'linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
  },
  certificateImage: {
    filter: 'blur(4px)', // Slightly reduced blur for better visibility
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '15px',
  },
  lockIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '72px', // Increased font size for better visibility
    color: '#e0e0e0',
    opacity: 0.9,
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: '600',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff0066',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 20px rgba(255,0,102,0.3)',
  },

};

const CertificatePage = () => {
  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.title}>Grab Your Certificate!</h1>
      <div style={pageStyles.certificateWrapper}>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2Fcertificate.jpg?alt=media&token=7b503db5-5eb0-4fe7-95c6-455468f20e74"
          alt="Certificate"
          layout="fill"
          style={pageStyles.certificateImage}
        />
        <FaLock style={pageStyles.lockIcon} />
      </div>
      <button
        style={pageStyles.button}
       
      >
        Unlock Certificate
      </button>
    </div>
  );
};

export default CertificatePage;
