'use client'
import React, { useState, useEffect } from 'react';

export default function CourseLayout({   Phone,  Desktop }) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsPhone(window.innerWidth <= 768);  
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
     
    {isPhone ? Phone : Desktop}
 
    </div>;
}
