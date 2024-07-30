'use client';

import React from 'react';
import { Button } from '@mui/material';
import { auth } from '../../utils/Firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('You have been logged out successfully!');
      window.location.href = '/home';
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
    <Button
    variant="contained"
    color="primary"
    width={"70px"}
      onClick={handleLogout}
  
      style={{ marginTop: '-10px' }}
    >

      Logout
    </Button>
    </div>
  );
}
