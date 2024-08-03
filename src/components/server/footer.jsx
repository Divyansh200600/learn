import React from 'react';
import SparklesText from '../magicui/sparkles-text'; // Ensure the path is correct

const Footer = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '150vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2c2c2c', // Dark background for the box
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Box-like container */}
      <div
        style={{
          width: '80%',
          maxWidth: '800px', // Maximum width of the box
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
          backgroundColor: '#1e1e1e', // Darker background for the box
          border: '1px solid #444', // Border to define the box
          boxSizing: 'border-box',
        }}
      >
        {/* Header section */}
        <div
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333', // Header background
            color: '#fff',
            borderBottom: '1px solid #444', // Subtle border
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Learning About Servers
        </div>

        {/* Main content */}
        <div
          style={{
            padding: '20px',
            width: '100%',
            textAlign: 'left', // Align text to the left for better readability
          }}
        >
          <SparklesText
            text="Server Concepts"
            colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
            sparklesCount={15} // Adjust the number of sparkles
            style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }} // Main text style
          />

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Web 🌐</h2>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                <li>1. 🌍 Learn about web servers (e.g., Apache, Nginx)</li>
                <li>2. 🛠️ Understand server configuration and setup</li>
                <li>3. 🔒 Explore security best practices</li>
                <li>4. 📦 Study server-side scripting (e.g., PHP, Node.js)</li>
                <li>5. 🧩 Integrate with databases (e.g., MySQL, MongoDB)</li>
                <li>6. 🚀 Deploy web applications</li>
                <li>7. 📈 Monitor server performance</li>
                <li>8. 🧪 Conduct load testing</li>
                <li>9. 📜 Learn about SSL/TLS certificates</li>
                <li>10. 💡 Optimize server resources</li>
              </ul>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>App 📱</h2>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                <li>1. 📲 Understand mobile server environments</li>
                <li>2. ⚙️ Set up and configure app servers</li>
                <li>3. 🔐 Explore API integration and security</li>
                <li>4. 📱 Learn about app-specific backend services</li>
                <li>5. 🌐 Implement user authentication and authorization</li>
                <li>6. 📈 Track app performance and analytics</li>
                <li>7. 🌍 Handle cross-platform compatibility</li>
                <li>8. 🚀 Optimize app deployment strategies</li>
                <li>9. 💬 Implement real-time features (e.g., chat)</li>
                <li>10. 🔄 Manage updates and server maintenance</li>
              </ul>
            </div>
          </div>

          <p
            style={{
              fontSize: '16px',
              color: '#ddd', // Light text color
              marginTop: '20px',
            }}
          >
            Dive deep into these areas to enhance your understanding of server management in both web and app contexts. Each point represents a critical aspect of learning and mastering server technologies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
