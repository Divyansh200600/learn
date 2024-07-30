import React from 'react';
import PassChanger from '../../../../components/SettingsComponent/passChange';
import Logout from '../../../../components/SettingsComponent/logout';

export default function SettignDesktopPage() {
  return (
    <div>
      <h1 className='text-5xl text-black'>Settings ⚙️</h1>
      <div style={styles.buttonContainer}>
        <PassChanger />
        <Logout />
      </div>
    </div>
  );
}

const styles = {
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column', // Align items vertically
    gap: '-5px', // Space between the buttons
    marginTop: '20px', // Add some space above the buttons
  },
};
