"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Profile1 from '../../../../../assets/profile/1.jpeg';
import Profile2 from '../../../../../assets/profile/2.png';
import Profile3 from '../../../../../assets/profile/3.jpg';

const FacultySection = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const sectionStyle = {
    backgroundColor: '#cce3de',
    padding: '50px 0', // Increased padding for better spacing
    textAlign: 'center',
  };

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center cards horizontally
    gap: '20px', // Spacing between cards
    flexWrap: 'wrap', // Wrap cards if they exceed container width
    marginTop: '40px', // Increased top margin for better separation
  };

  const cardStyle = {
    width: '290px',
    height: '410px', // Increased height for flipping effect
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    textAlign: 'center',
    cursor: 'pointer', // Pointer cursor for interaction
    position: 'relative',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: 'rotateY(0deg)', // Initially not flipped
  };

  const frontStyle = {
    position: 'absolute',
    top: '0px',
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  };

  const backStyle = {
    ...frontStyle,
    transform: 'rotateY(180deg)',
    backgroundColor: '#166281', // blue background when flipped
    color: '#ffffff', // White text color when flipped
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  const textStyle = {
    position: 'relative',
    top: '20px',
    color: '#012a4a',
    fontWeight: 'bold',
    marginBottom: '30px',
    fontSize: '1.2rem', // Larger font size for name
  };

  const profilePicStyle = {
    position: 'relative',
    top: '20px',
    left: '90px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '20px', // Increased margin for better alignment
    objectFit: 'cover', // Prevents image distortion
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  };

  const languageTagStyle = {
    backgroundColor: '#007ea7',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '5px',
    display: 'inline-block',
    marginTop: '15px', // Increased top margin for better spacing
    fontSize: '0.9rem', // Smaller font size for tags
  };

  const handleFlipButtonClick = (index) => {
    if (flippedCard === index) {
      setFlippedCard(null); // Flip back if already flipped
    } else {
      setFlippedCard(index); // Flip the clicked card
    }
  };

  return (
    <section style={sectionStyle}>
            <h1 className="text-5xl mx-auto font-bold text-blue-900 mb-9 text-center">Meet Our Legendary Faculty Members</h1>
      <div style={cardContainerStyle}>
      
        {/* Card 1 */}
        <div
          style={{
            ...cardStyle,
            transform: flippedCard === 1 ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div style={frontStyle}>
            <Image src={Profile1} alt="Profile 1" style={profilePicStyle} />
            <h3 style={textStyle}>Rishab Chauhan</h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>Co-Founder</p>
            <p style={{ color: '#666666', marginBottom: '8px', fontSize: '0.9rem' }}>
              React.js Specialist
            </p>
            <span style={languageTagStyle}>React.js</span>
          </div>
          <div style={backStyle}>
          <h1 style={{position: 'relative', top: '-50px'}}> Rishab Chauhan </h1>

          <p>- Rishab Chauhan serves as a co-founder of our institution, bringing invaluable leadership and vision to our team.</p>
<p>- Specializes in React.js, with a strong focus on creating dynamic and responsive web applications.</p>
            <button
              onClick={() => handleFlipButtonClick(1)}
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                backgroundColor: '#001233',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: flippedCard === 1 ? 'block' : 'none', // Conditionally display based on flip state
              }}
            >
              Flip Me Back
            </button>
          </div>
          <button
            onClick={() => handleFlipButtonClick(1)}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              backgroundColor: '#001233',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: flippedCard === 1 ? 'none' : 'block', // Conditionally display based on flip state
            }}
          >
            Flip Me
          </button>
        </div>

        {/* Card 2 */}
        <div
          style={{
            ...cardStyle,
            transform: flippedCard === 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div style={frontStyle}>
            <Image src={Profile2} alt="Profile 2" style={profilePicStyle} />
            <h3 style={textStyle}>Piyush Srivastava</h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>Instructor & Founding Member</p>
            <p style={{ color: '#666666', marginBottom: '8px', fontSize: '0.9rem' }}>
              Next.js Specialist
            </p>
            <span style={languageTagStyle}>Next.js</span>
          </div>
          <div style={backStyle}>
          <h1 style={{position: 'relative', top: '-50px'}}> Piyush Srivastava </h1>
          <p>- Piyush Srivastava plays a pivotal role as both an instructor and a founding member of our academy.</p>
<p>- Expert in Next.js, facilitating the exploration and implementation of advanced front-end technologies.</p>
            <button
              onClick={() => handleFlipButtonClick(2)}
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                backgroundColor: '#001233',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: flippedCard === 2 ? 'block' : 'none', // Conditionally display based on flip state
              }}
            >
              Flip Me Back
            </button>
          </div>
          <button
            onClick={() => handleFlipButtonClick(2)}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              backgroundColor: '#001233',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: flippedCard === 2 ? 'none' : 'block', // Conditionally display based on flip state
            }}
          >
            Flip Me
          </button>
        </div>

        {/* Card 3 */}
        <div
          style={{
            ...cardStyle,
            transform: flippedCard === 3 ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div style={frontStyle}>
            <Image src={Profile3} alt="Profile 3" style={profilePicStyle} />
            <h3 style={textStyle}>Amit Gurjar</h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>Instructor</p>
            <p style={{ color: '#666666', marginBottom: '8px', fontSize: '0.9rem' }}>
              MongoDB Specialist
            </p>
            <span style={languageTagStyle}>MongoDB</span>
          </div>
          <div style={backStyle}>
         <h1 style={{position: 'relative', top: '-50px'}}> Amit Gurjar</h1>
          <p>- Amit Gurjar, a dedicated instructor, specializes in MongoDB and database management.</p>
<p>- Offers extensive knowledge in designing and optimizing database solutions for various applications.</p>
            <button
              onClick={() => handleFlipButtonClick(3)}
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                backgroundColor: '#001233',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: flippedCard === 3 ? 'block' : 'none', // Conditionally display based on flip state
              }}
            >
              Flip Me Back
            </button>
          </div>
          <button
            onClick={() => handleFlipButtonClick(3)}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px 20px',
              backgroundColor: '#001233',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: flippedCard === 3 ? 'none' : 'block', // Conditionally display based on flip state
            }}
          >
            Flip Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
