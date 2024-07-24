'use client'
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

export default function DashboardLayout({ children,   }) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsPhone(window.innerWidth <= 768); // Adjust the width as per your requirements
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return <div>
    {isPhone ? <></> : <Dashboard/>}
    {children}
    </div>;
}
