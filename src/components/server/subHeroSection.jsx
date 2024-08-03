import React from 'react';
import SparklesText from '../magicui/sparkles-text'; // Ensure the path is correct

const SubHero = () => {
  return (
    <div
      style={{
        width: '80%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
        backgroundColor: '#2c2c2c', // Dark background for the "application"
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        height: '50vh', // Full viewport height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Application header */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '40px',
          backgroundColor: '#444', // Header background
          borderBottom: '1px solid #333', // Subtle border
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        <span>Magic App</span>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '5px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#ff5f57',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#ffbb00',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#00d084',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          paddingTop: '50px', // Space for the header
        }}
      >
        <SparklesText
          text="Let's Learn About Server"
          colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
          sparklesCount={15} // Adjust the number of sparkles
          style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }} // Main text style
        />
      </div>
    </div>
  );
};

export default SubHero;
