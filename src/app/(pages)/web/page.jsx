'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import Roadmap from '../../../components/Web/roadmap';
import Section from '../../../components/Web/section';
import SectionTag from '../../../components/Web/sectionTag';
import Lang from '../../../components/Web/lang';
import Footer1 from '../../../components/Web/footer';
import Footer from '../../../components/footer/page';

const pageStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#000d1a',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    fontSize: '36px',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    textShadow: '0 0 10px #ff0066, 0 0 20px #ff0066, 0 0 30px #ff0066',
  },
  mediaWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    position: 'relative', // Add relative positioning to the wrapper
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0, 118, 255, 0.24)',
    width: '600px',
    height: '700px',
  },
  videoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '600px',
    backgroundColor: '#000',
    borderRadius: '20px',
    boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerWrapper: {
    width: '100%',
    height: '70%',
    borderRadius: '15px',
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute', // Position the button container absolutely
    top: '70%', // Adjust as needed
    left: '75%', // Adjust as needed
    transform: 'translate(-50%, 0)', // Center the button horizontally
    marginTop: '1rem',
  },
  button: {
    padding: '12px 24px',
    fontSize: '18px',
    color: '#fff',
    background: 'linear-gradient(45deg, #00FF00, #00CFFF)', // Gradient from lime green to light blue
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s, background 0.3s, filter 0.3s', // Add transition for filter
    boxShadow: '0 6px 15px rgba(0, 255, 0, 0.3)', // Subtle shadow for a modern look
    position: 'relative',
    overflow: 'hidden',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    outline: 'none', // Remove default outline
    filter: 'brightness(1)', // Initial brightness
  },
  buttonGlitzEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2), rgba(0,255,255,0))',
    transition: 'opacity 0.3s',
    opacity: 0,
  },
  buttonHover: {
    filter: 'brightness(1.2)', // Brighter on hover
    transform: 'scale(1.05)', // Slightly enlarge on hover
    boxShadow: '0 8px 20px rgba(0, 255, 0, 0.5)', // Increase shadow on hover
  }
};

const bubbleStyles = `
.bubble-image {
  position: relative;
  top: 150%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: bubble 3s infinite;
}

@keyframes bubble {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -10px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  75% {
    transform: translate(10px, 10px);
  }
}

.welcome-box {
  display: inline-block;
  padding: 10px 20px;
  border: 2px solid #ff0066;
  cursor: pointer;
  transition: background-color 0.3s;
  overflow: hidden;
  white-space: pre-wrap;
  background-color: transparent;
  color: #ff0066;
  font-size: 36px;
  text-shadow: 0 0 10px #ff0066, 0 0 20px #ff0066, 0 0 30px #ff0066;
}

.welcome-letter {
  display: inline-block;
  transition: transform 0.2s;
  position: relative;
}
`;

const Web = () => {
  const [hoveredLetterIndex, setHoveredLetterIndex] = useState(-1);
  const [buttonHovered, setButtonHovered] = useState(false);

  const welcomeMessage = 'Welcome to Web Development Course!';
  const letters = welcomeMessage.split('');

  useEffect(() => {
    // Only set state when client-side
    if (typeof window !== 'undefined') {
      // Client-side code here
    }
  }, []);

  const handleButtonClick = () => {
    window.location.href = '/course/xEryQeazPuZFuIXremIO'; // Replace with your actual link
  };

  return (
    <div>
      <div style={pageStyles.container}>
        <style>{bubbleStyles}</style>
        <div className="welcome-box">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="welcome-letter"
              onMouseEnter={() => setHoveredLetterIndex(index)}
              onMouseLeave={() => setHoveredLetterIndex(-1)}
              style={
                hoveredLetterIndex === index
                  ? {
                      transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
                    }
                  : { transform: 'translate(0, 0)' }
              }
            >
              {letter}
            </span>
          ))}
        </div>
        <br /><br />
        <div style={pageStyles.mediaWrapper}>
          <div style={pageStyles.imageWrapper}>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2FwebDevCourse.png?alt=media&token=7b8c9a5b-05e2-4c62-966a-3433b0e0020d"
              alt="Web Development"
              layout="fill"
              objectFit="cover"
              className="bubble-image"
            />
          </div>
          <div style={pageStyles.videoWrapper}>
            <div style={pageStyles.playerWrapper}>
              <ReactPlayer
                url="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/Full_React%2FReact%20full%20development%20-%20Intro%20Video.mp4?alt=media&token=bf569c92-fb84-4d2c-9a19-41300e064494"
                controls={true}
                width="100%"
                height="100%" // Changed to 100% to fill the container
              />
            </div>
          </div>
          <div
            style={pageStyles.buttonContainer}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
          >
            <button
              style={{
                ...pageStyles.button,
                ...(buttonHovered ? pageStyles.buttonHover : {}),
              }}
              onClick={handleButtonClick}
            >
              <div style={pageStyles.buttonGlitzEffect}></div>
              Explore Course
            </button>
          </div>
        </div>
       
        <Roadmap />
        <SectionTag />
        <Section />
        <Lang />
        <Footer1 />
      </div>
      <Footer />
    </div>
  );
};

export default Web;
