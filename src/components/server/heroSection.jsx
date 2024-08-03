import React, { useEffect, useState } from 'react';
import Ripple from '../magicui/ripple'; // Ensure the path is correct

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "Let's Learn About Server";

  useEffect(() => {
    let index = 0;
    let typingInterval;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setText(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            setText('');
            index = 0;
            startTyping(); // Restart typing
          }, 1500); // Pause before restarting
        }
      }, 100); // Adjust typing speed here
    };

    startTyping();

    return () => clearInterval(typingInterval);
  }, [fullText]);

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(90deg, #6a1b9a, #f06292)',
        color: 'white',
        textAlign: 'center',
        padding: '100px 20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        width: '100%',
        height: '50vh', // Adjusted to fit your design
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ripple effect */}
      <Ripple
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <p
        style={{
          fontSize: '40px',
          fontWeight: 'bold',
          margin: '0',
          color: 'white',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // White glow effect
          animation: 'blink-caret 0.75s step-end infinite', // Caret blinking animation
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          borderRight: '3px solid white', // Caret effect
        }}
      >
        {text}
      </p>

      <style jsx>{`
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: white; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
