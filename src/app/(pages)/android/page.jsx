'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import Roadmap from '../../../components/android/roadmap';
import Section from '../../../components/android/section';
import SectionTag from '../../../components/android/sectionTag';
import Lang from '../../../components/android/lang';
import Footer from '../../../components/Web/footer';

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
  mediaWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
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
};

const bubbleStyles = `
.bubble-image {
  position: absolute;
  top: 0;
  left: 0;
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

.green-neon {
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
}
`;

const Android = () => {
  const [hoveredLetterIndex, setHoveredLetterIndex] = useState(-1);

  const welcomeMessage = 'Welcome to Android Development Course!';
  const letters = welcomeMessage.split('');
  
  // Create a Set of indices where "Android" occurs
  const androidIndices = new Set([  10, 11, 12, 13, 14,15,16,17,18]); // Index positions for "Android"

  useEffect(() => {
    // Only set state when client-side
    if (typeof window !== 'undefined') {
      // Client-side code here
    }
  }, []);

  return (
    <div style={pageStyles.container}>
      <style>{bubbleStyles}</style>
      <div className="welcome-box">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`welcome-letter ${androidIndices.has(index) ? 'green-neon' : ''}`}
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
            src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2Fapp%20of%20learning%2Fandroidhero.png?alt=media&token=77339733-a7c3-47df-9c32-0f06cd415e9a"
            alt="Web Development"
            layout="fill"
            objectFit="cover"
            className="bubble-image"
          />
        </div>
        <div style={pageStyles.videoWrapper}>
          <div style={pageStyles.playerWrapper}>
            <ReactPlayer
              url="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/android%2Fmodule-3%2FAppBar%20in%20Flutter.mp4?alt=media&token=ebc6d6b8-7c0f-45f1-b99d-dbea939abf3c"
              controls={true}
              width="100%"
              height="70%"
            />
          </div>
        </div>
      </div>
      <Roadmap />
      <SectionTag />
      <Section />
      <Lang />
      <Footer />
    </div>
  );
};

export default Android;
