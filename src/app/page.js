'use client';

import BottomNavigationBar from '@/components/BottomNavigation/page';
import Header from '@/components/header/homeHeader/Header';
import PageTransition from '@/components/PageTransition/pageTransition';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingGif from '../assets/gif/loading.gif'; // Ensure this path is correct

const Home = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Simulate loading delay (you can replace this with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Positive value for the delay
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className='bg-blue-200'>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          {isPhone ? (
            <BottomNavigationBar />
          ) : (
            !pathname.includes('/dashboard') && <Header />
          )}
          <PageTransition>{children}</PageTransition>
        </div>
      )}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white">
    <Image src={LoadingGif} alt="Loading..." className="w-32 h-32 mb-4" />
    <p className="text-gray-800 text-lg absolute bottom-8">Love from ❤️ PulseZest</p>
  </div>
);

export default Home;
