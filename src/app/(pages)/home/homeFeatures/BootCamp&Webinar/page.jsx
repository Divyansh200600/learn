"use client"

import { useState } from 'react';
import BootCampContent from './features/BootCampContent';
import WebinarContent from './features/WebinarContent';


const App = () => {
  const [selectedOption, setSelectedOption] = useState('BootCamp');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ backgroundColor: '#ced4da', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<nav style={{
  backgroundColor: '#001524',
  padding: '10px 0',
  width: '25%',
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '15px',  // Adding curved corners
}}>        <button
          style={{
            backgroundColor: selectedOption === 'BootCamp' ? '#ffffff' : 'transparent',
            color: selectedOption === 'BootCamp' ? '#001524' : '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '5px',
            marginRight: '10px',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          onClick={() => handleOptionChange('BootCamp')}
        >
          Webinar
        </button>
        <button
          style={{
            backgroundColor: selectedOption === 'Webinar' ? '#ffffff' : 'transparent',
            color: selectedOption === 'Webinar' ? '#001524' : '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '5px',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          onClick={() => handleOptionChange('Webinar')}
        >
          BootCamp
        </button>
      </nav>
      <div style={{ marginTop: '20px', width: '100%', maxWidth: '600px' }}>
        {selectedOption === 'BootCamp' && <BootCampContent />}
        {selectedOption === 'Webinar' && <WebinarContent />}
      </div>
    </div>
  );
};

export default App;
