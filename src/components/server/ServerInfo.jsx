import React from 'react';

// Sample card content
const cardData = [
  {
    avatar: '🌐',
    title: 'Web Servers',
    description: 'Web servers deliver content to users over the internet. They handle HTTP requests and responses, manage static and dynamic content, and ensure secure data transmission.',
  },
  {
    avatar: '📱',
    title: 'App Servers',
    description: 'App servers host backend services for mobile and web applications. They manage app logic, handle API requests, and interact with databases to provide functionality and data.',
  },
  {
    avatar: '🔒',
    title: 'Security',
    description: 'Server security involves protecting servers from unauthorized access and attacks. It includes implementing firewalls, encryption, and regular updates to ensure data integrity and privacy.',
  },
];

const Card = ({ avatar, title, description }) => (
  <div
    style={{
      flex: '1',
      maxWidth: '300px',
      margin: '10px',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#1e1e1e',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      color: '#fff',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.5)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    }}
  >
    <div
      style={{
        fontSize: '40px',
        marginBottom: '10px',
      }}
    >
      {avatar}
    </div>
    <h2
      style={{
        fontSize: '22px',
        margin: '10px 0',
        fontWeight: '600',
      }}
    >
      {title}
    </h2>
    <p
      style={{
        fontSize: '16px',
        color: '#ccc',
        lineHeight: '1.5',
      }}
    >
      {description}
    </p>
  </div>
);

const ServerInfo = () => {
  return (
    <div>
    <div
      style={{
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#121212',
      }}
    >
      <h1
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0 0 40px 0',
          color: '#ffffff',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        Explore Server Concepts
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            avatar={card.avatar}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      
    </div>
     <h1 style={{
        fontSize: '46px',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #6a1b9a, #f06292)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(255, 105, 180, 0.8)',
        margin: '20px 0'
      }}>
       Server Network
      </h1>
      </div>
  );
};

export default ServerInfo;
