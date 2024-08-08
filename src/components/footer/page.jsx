import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'black',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#ffffff',
    padding: '30px 0',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const footerContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  const sectionStyle = {
    flex: '1',
    marginBottom: '20px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const logoImgStyle = {
    width: '50px',
    height: 'auto',
    marginRight: '10px',
  };

  const companyNameStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const headingStyle = {
    color: '#a1c5e7',
    fontSize: '1.1rem',
    marginBottom: '10px',
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const liStyle = {
    marginBottom: '5px',
  };

  const linkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
  };

  const contactInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'center',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div className="footer-content" style={footerContentStyle}>
          <div style={sectionStyle}>
            <div style={logoStyle}>
              <Image src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616" alt="Company Logo"  width={500} height={300} style={logoImgStyle} />
              <span style={companyNameStyle}>PulseZest-Learning</span>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Learning</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="/web" style={linkStyle}>Web</a></li>
              <li style={liStyle}><a href="/android" style={linkStyle}>App</a></li>
              <li style={liStyle}><a href="/server" style={linkStyle}>Server</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Products</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="/home" style={linkStyle}>Bootcamp</a></li>
              <li style={liStyle}><a href="/home" style={linkStyle}>Webinar</a></li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={headingStyle}> Important Links</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="/terms-condition" style={linkStyle}>Terms and Condition</a></li>
              <li style={liStyle}><a href="/privacy-policy" style={linkStyle}>Privacy Policy </a></li>
              <li style={liStyle}><a href="/cancellation" style={linkStyle}>Cancellation/Refund</a></li>
            </ul>
          </div>
      
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Useful Links </h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="/about-us" style={linkStyle}> About-Us</a></li>
              <li style={liStyle}><a href="/contact-us" style={linkStyle}>Contact-Us</a></li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={headingStyle}>Community</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="https://www.instagram.com/pulsezest/" style={linkStyle}>Instagram</a></li>
              <li style={liStyle}><a href="https://discord.com/channels/1236384430688309310/1262682157990674534/1271034579158831277" style={linkStyle}>Discord</a></li>
              <li style={liStyle}><a href="https://pulsezest.com/" style={linkStyle}>Website</a></li>
            </ul>
          </div>

         
        </div>
        <div className="contact-info" style={contactInfoStyle}>
          <div style={contactItemStyle}>
            <a href="tel:+916396219233" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', textDecoration: 'none' }}>
              <Image src="https://files.codingninjas.com/phone-31845.svg" alt="Phone Icon"  width={500} height={300} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              +91 6396219233 || +917248457558

            </a>
          </div>
          <div style={contactItemStyle}>
            <span>Copyright © 2024 PulseZest - by PulseZest-Learning</span>
          </div>
          <div style={contactItemStyle}>
            <a href="mailto:info@pulsezest.com" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', textDecoration: 'none' }}>
              <Image src="https://files.codingninjas.com/email-fill-31846.svg" alt="Email Icon"  width={500} height={300} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              contact@pulsezest.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
