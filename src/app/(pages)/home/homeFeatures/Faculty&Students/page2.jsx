import React from 'react';
import Image from 'next/image';
import Profile4 from '../../../../../assets/profile/4.png';
import Profile5 from '../../../../../assets/profile/5.jpg';
import Profile6 from '../../../../../assets/profile/6.jpeg';

const StudentSection = () => {
  const sectionStyle = {
    backgroundColor: '#264653',
    padding: '50px 0', // Increased padding for better spacing
    textAlign: 'center',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    maxWidth: '400px', // Adjusted width for better readability
    margin: '0 auto', // Center align the card
  };

  const avatarStyle = {
    backgroundColor: '#D892E8',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '15px',
  };
  const profileCircleStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#b1ff01',
    textAlign: 'center',
    lineHeight: '80px',
    color: '#00000',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  };

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around', // Adjusted to evenly distribute cards
    flexWrap: 'wrap', // Wrap cards if they exceed container width
    gap: '20px', // Spacing between cards
    marginTop: '40px', // Increased top margin for better separation
  };

  return  (
    <div>
      <section style={sectionStyle}>
      <h1 className="text-5xl mx-auto font-bold text-White-900 mb-9 text-center">Love From Our Employees </h1>
        <div style={cardContainerStyle}>
          {/* Card 1 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Image style={profileCircleStyle} src={Profile4} alt="Profile 3" width={100} height={100} />
              <div style={{ marginLeft: '20px' }}>
                <h3 style={{ color: '#001524', marginBottom: '5px', fontWeight: 'bold' }}>Shruti Varshney</h3>
                <p style={{ marginBottom: '5px', color: 'black' }}>Hind Press</p>
                <p style={{ marginBottom: '0', color: 'black' }}>Web Developer</p>
              </div>
            </div>
            <p style={{ color: '#001524', lineHeight: '1.6', textAlign: 'justify' }}>
            A web developer, building responsive and user-friendly websites. I thrive on creating seamless user experiences and enjoy tackling complex problems.
            </p>
          </div>

          {/* Card 2 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Image style={profileCircleStyle} src={Profile6} alt="Profile 3" width={100} height={100} />
              <div style={{ marginLeft: '20px' }}>
                <h3 style={{ color: '#001524', marginBottom: '5px', fontWeight: 'bold' }}>Divyansh Chauhan</h3>
                <p style={{ marginBottom: '5px', color: 'black' }}>NO DATA :(</p>
                <p style={{ marginBottom: '0', color: 'black' }}>Web Developer</p>
              </div>
            </div>
            <p style={{ color: '#001524', lineHeight: '1.6', textAlign: 'justify' }}>
            Currently working as a Full Stack Web Developer at PulseZest. I’m a core team member, gaining valuable experience and building a strong network. I have learning a lot from the PulseZest.
            </p>
          </div>

          {/* Card 3 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Image style={profileCircleStyle} src={Profile5} alt="Profile 3" width={100} height={100} />
              <div style={{ marginLeft: '20px' }}>
                <h3 style={{ color: '#001524', marginBottom: '5px', fontWeight: 'bold' }}>Yashi Goyal</h3>
                <p style={{ marginBottom: '5px', color: 'black' }}>CBSE Walla</p>
                <p style={{ marginBottom: '0', color: 'black' }}>App Developer</p>
              </div>
            </div>
            <p style={{ color: '#001524', lineHeight: '1.6', textAlign: 'justify' }}>
            Currently working as an Android Developer of Frontend and backend as well. Passionate to build and create new Ideas.
            </p>
          </div>

      
        </div>
      </section>
    </div>
  );
};
export default StudentSection;
