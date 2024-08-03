import React, { useState, useCallback, useRef } from 'react';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const terminalRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const executeCommand = useCallback(() => {
    const trimmedInput = input.trim();

    if (trimmedInput) {
      if (trimmedInput === 'cls') {
        setHistory([]);
      } else {
        const newHistory = [...history, { command: trimmedInput, output: getCommandOutput(trimmedInput) }];
        setHistory(newHistory);
      }
      setInput('');
      // Auto scroll to the bottom
      terminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [input, history]);

  const getCommandOutput = (command) => {
    // Basic command handling
    switch (command) {
      case 'ls':
        return 'file1.txt\nfile2.txt\nfile3.txt';
      case 'pwd':
        return '/user/home';
      case 'echo hello':
        return 'hello';
      default:
        return `Command not found: ${command}`;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      executeCommand();
    }
  };

  return (
    <div>
      {/* Header */}
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
       Use of Terminal in Server
      </h1>

      {/* Main Layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
        
        {/* Terminal */}
        <div
          style={{
            width: '85%',
            maxWidth: '800px',
            height: '400px',
            backgroundColor: '#1e1e1e', // Dark background similar to macOS Terminal
            color: '#c6c6c6', // Light gray text
            position:'relative',
            left:'-210px',
            padding: '20px',
            fontFamily: 'Monaco, monospace',
            overflowY: 'auto',
            borderRadius: '8px', // Rounded corners for a modern look
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Subtle shadow for depth
            border: '1px solid #333', // Slight border to mimic terminal window
            marginRight: '20px' // Space between terminal and card
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '20px',
              backgroundColor: '#2c2c2c', // Header bar color
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c6c6c6',
              fontSize: '14px',
              paddingRight: '30px', // Space for the three dots
              position: 'relative'
            }}
          >
            Terminal
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'row',
                gap: '5px'
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

          <div style={{ marginBottom: '30px', paddingTop: '30px' }}>
            {history.map((entry, index) => (
              <div key={index}>
                <div style={{ color: '#00ff00' }}>{`$ ${entry.command}`}</div>
                <pre style={{ margin: 0 }}>{entry.output}</pre>
              </div>
            ))}
          </div>
          <div ref={terminalRef} />
          <input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              backgroundColor: '#1e1e1e',
              color: '#00ff00', // Terminal input color
              border: 'none',
              outline: 'none',
              fontFamily: 'Monaco, monospace',
              fontSize: '16px',
              padding: '10px',
              boxSizing: 'border-box', // Ensures padding doesn't affect width
            }}
          />
        </div>

        {/* Command Info Card */}
        <div
          style={{
            width: '30%',
            maxWidth: '300px',
            background: 'linear-gradient(145deg, #333, #555)', // Neon-like gradient background
            color: '#c6c6c6',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', // Neon shadow effect
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>Command Info</h4>
          <p style={{ margin: '0', fontSize: '14px', textAlign: 'center' }}>
            Enter commands like <code>ls</code>, <code>pwd</code>, or <code>echo hello</code>.
            <br />
            Use <code>cls</code> to clear the terminal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
