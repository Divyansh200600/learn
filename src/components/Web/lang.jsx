import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Lang = () => {
    const [isTornado, setIsTornado] = useState(false);
    const [selectedLang, setSelectedLang] = useState(null);

    const scrollToCodeBox = () => {
        document.querySelector('#codeBox').scrollIntoView({ behavior: 'smooth' });
        window.location.href = '/home'; // Replace with your desired URL

    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
    };

    const headingStyle = {
        fontSize: '46px',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #ff6f61, #de1b24)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const buttonStyle = {
        marginTop: '20px',
        padding: '15px 30px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // Gradient background
        color: '#fff',
        border: 'none',
        borderRadius: '50px', // More rounded corners
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600', // Slightly bolder text
        textTransform: 'uppercase', // Uppercase text
        transition: 'all 0.3s ease', // Smooth transition for all properties
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Enhanced shadow for a floating effect
        outline: 'none', // Remove default focus outline
        transform: 'scale(1)', // Default scale
    };
    
    const buttonHoverStyle = {
        background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)', // Gradient inversion on hover
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Deeper shadow on hover
        transform: 'scale(1.05)', // Slightly scale up on hover
    };
    
    const buttonActiveStyle = {
        background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)', // Consistent gradient on active
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow adjustment on active
        transform: 'scale(0.95)', // Scale down slightly on click
    };
    

    const tornadoContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
    };

    const iconContainerStyle = {
        display: 'inline-block',
        position: 'relative',
        margin: '15px',
        width: '100px',
        height: '100px',
    };

    const iconStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, background-color 0.3s',
        position: 'relative',
        zIndex: 2,
    };

    const tooltipStyle = {
        visibility: 'hidden',
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '5px',
        padding: '10px',
        position: 'absolute',
        top: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        transition: 'opacity 0.3s, visibility 0.3s',
        whiteSpace: 'nowrap',
        zIndex: 3,
    };

    const iconContainerHoverStyle = {
        backgroundColor: '#e0e0e0',
        transform: 'translateY(-5px)',
    };

    const tornadoEffect = `
        @keyframes tornado {
            0% { transform: rotate(0deg) translateY(0); }
            100% { transform: rotate(360deg) translateY(-300px); }
        }
        .tornado-icon {
            animation: tornado 5s linear infinite;
        }
        .icon-container:hover .tooltip {
            visibility: visible;
            opacity: 1;
        }
    `;

    const codeBoxStyle = {
        position: 'relative',
        top: '-10px',
        width: '80%',
        maxWidth: '800px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginTop: '20px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
    };

    const codeBoxHoverStyle = {
        transform: 'translateY(-5px)',
    };

    const languageCode = {
        HTML: `<html>\n  <head>\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`,
        CSS: `body {\n  background-color: #f0f0f0;\n  font-family: Arial, sans-serif;\n}\nh1 {\n  color: #333;\n}`,
        JavaScript: `function greet() {\n  console.log('Hello World');\n}\ngreet();`,
        GitHub: `# GitHub\n\nGitHub is a platform for version control and collaboration.`,
        React: `import React from 'react';\n\nfunction App() {\n  return <div>Hello, React!</div>;\n}\n\nexport default App;`,
        Firebase: `// Firebase configuration\nconst firebaseConfig = {\n  apiKey: 'YOUR_API_KEY',\n  authDomain: 'YOUR_AUTH_DOMAIN',\n  projectId: 'YOUR_PROJECT_ID',\n  storageBucket: 'YOUR_STORAGE_BUCKET',\n  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',\n  appId: 'YOUR_APP_ID'\n};`,
        Node: `const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/plain');\n  res.end('Hello World\\n');\n});\n\nserver.listen(3000, '127.0.0.1', () => {\n  console.log('Server running at http://127.0.0.1:3000/');\n});`,
        Android: `// Android Activity\npublic class MainActivity extends AppCompatActivity {\n  @Override\n  protected void onCreate(Bundle savedInstanceState) {\n    super.onCreate(savedInstanceState);\n    setContentView(R.layout.activity_main);\n  }\n}`,
        MySQL: `CREATE TABLE users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) NOT NULL UNIQUE\n);`,
        API: `// Example API call\nfetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data));`,
    };

    const getLangClass = (lang) => {
        switch (lang) {
            case 'HTML':
                return 'html';
            case 'CSS':
                return 'css';
            case 'JavaScript':
                return 'javascript';
            case 'GitHub':
                return 'git';
            case 'React':
                return 'jsx';
            case 'Firebase':
                return 'javascript';
            case 'Node':
                return 'javascript';
            case 'Android':
                return 'java';
            case 'MySQL':
                return 'sql';
            case 'API':
                return 'javascript';
            default:
                return 'text';
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Explore Languages</h1>
            <div style={tornadoContainerStyle}>
                {[
                    { src: 'https://img.icons8.com/color/96/000000/html-5.png', alt: 'HTML', key: 'HTML', tooltip: 'HTML is a markup language for creating web pages.' },
                    { src: 'https://img.icons8.com/color/96/000000/css3.png', alt: 'CSS', key: 'CSS', tooltip: 'CSS is used for styling HTML elements.' },
                    { src: 'https://img.icons8.com/color/96/000000/javascript.png', alt: 'JavaScript', key: 'JavaScript', tooltip: 'JavaScript adds interactivity to web pages.' },
                    { src: 'https://img.icons8.com/ios-glyphs/96/000000/github.png', alt: 'GitHub', key: 'GitHub', tooltip: 'GitHub is a platform for version control and collaboration.' },
                    { src: 'https://img.icons8.com/color/96/000000/react-native.png', alt: 'React.js', key: 'React', tooltip: 'React.js is a JavaScript library for building user interfaces.' },
                    { src: 'https://img.icons8.com/color/96/000000/firebase.png', alt: 'Firebase', key: 'Firebase', tooltip: 'Firebase provides backend services for web and mobile applications.' },
                    { src: 'https://img.icons8.com/color/96/000000/nodejs.png', alt: 'Node.js', key: 'Node', tooltip: 'Node.js is a runtime for executing JavaScript code server-side.' },
                    { src: 'https://img.icons8.com/color/96/000000/android-os.png', alt: 'Android', key: 'Android', tooltip: 'Android is an operating system for mobile devices.' },
                    { src: 'https://img.icons8.com/color/96/000000/mysql.png', alt: 'MySQL', key: 'MySQL', tooltip: 'MySQL is a popular relational database management system.' },
                    { src: 'https://img.icons8.com/color/96/000000/api.png', alt: 'API', key: 'API', tooltip: 'APIs allow different software systems to communicate with each other.' }
                ].map((icon, index) => (
                    <div
                        key={index}
                        style={iconContainerStyle}
                        className={`icon-container ${isTornado ? 'tornado-icon' : ''}`}
                        onMouseOver={() => setSelectedLang(icon.key)}
                        onMouseOut={() => setSelectedLang(null)}
                    >
                        <div
                            style={iconStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = iconContainerHoverStyle.backgroundColor;
                                e.currentTarget.style.transform = iconContainerHoverStyle.transform;
                                e.currentTarget.querySelector('img').style.opacity = 0.8;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                                e.currentTarget.style.transform = '';
                                e.currentTarget.querySelector('img').style.opacity = 1;
                            }}
                        >
                            <img src={icon.src} alt={icon.alt} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div style={tooltipStyle} className="tooltip">
                            {icon.tooltip}
                        </div>
                    </div>
                ))}
                <div
                    id="codeBox"
                    style={codeBoxStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = codeBoxHoverStyle.transform}
                    onMouseOut={(e) => e.currentTarget.style.transform = ''}
                >
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        gap: '8px',
                        zIndex: 1,
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ff605c',
                        }}></div>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ffbd44',
                        }}></div>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#00ca56',
                        }}></div>
                    </div>
                    {selectedLang ? (
                        <SyntaxHighlighter
                            language={getLangClass(selectedLang)}
                            style={solarizedlight}
                        >
                            {languageCode[selectedLang]}
                        </SyntaxHighlighter>
                    ) : (
                        'Hover over an icon to see the code.'
                    )}
                </div>
            </div>
            <style jsx>{tornadoEffect}</style>
            <button
    style={buttonStyle}
    onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, buttonHoverStyle);
    }}
    onMouseOut={(e) => {
        Object.assign(e.currentTarget.style, buttonStyle);
    }}
    onMouseDown={(e) => {
        Object.assign(e.currentTarget.style, buttonActiveStyle);
    }}
    onMouseUp={(e) => {
        Object.assign(e.currentTarget.style, buttonHoverStyle);
    }}
    onClick={scrollToCodeBox}
>
    Explore
</button>

        </div>
    );
};

export default Lang;
