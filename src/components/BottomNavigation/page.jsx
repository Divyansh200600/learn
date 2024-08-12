'use client';

import {BookOpenIcon, DocumentSearchIcon, HomeIcon, UserIcon, SparklesIcon   } from '@heroicons/react/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BottomNavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState(null);
  const [animationCount, setAnimationCount] = useState(0);

  const handleNavigation = (path) => {
    setActiveButton(path);
    setAnimationCount(0); // Reset animation count when a new button is clicked
    router.push(path);
  };

  useEffect(() => {
    if (animationCount < 2 && activeButton) {
      const timer = setTimeout(() => {
        setAnimationCount((prev) => prev + 1);
      }, 300); // Delay to match the bounce animation duration (usually around 300ms)

      return () => clearTimeout(timer);
    }
  }, [animationCount, activeButton]);

  const getButtonClasses = (path) => {
    return `flex flex-col items-center ${
      pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
    } transition-colors transform ${
      activeButton === path && animationCount < 2 ? 'animate-bounce' : ''
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow p-4 flex justify-around z-50">
      <button
        onClick={() => handleNavigation('/home')}
        className={getButtonClasses('/home')}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </button>
      <button
        onClick={() => handleNavigation('/dashboard/explore')}
        className={getButtonClasses('/dashboard/explore')}
      >
        <DocumentSearchIcon className="w-6 h-6" />
        <span className="text-xs">Explore</span>
      </button>
      <button
        onClick={() => handleNavigation('/dashboard/my-course')}
        className={getButtonClasses('/dashboard/my-course')}
      >
        <BookOpenIcon className="w-6 h-6" />
        <span className="text-xs">Course</span>
      </button>
      <button
        onClick={() => handleNavigation('/dashboard/achievements')}
        className={getButtonClasses('/dashboard/achievements')}
      >
        <SparklesIcon   className="w-6 h-6" />
        <span className="text-xs">Achievement</span>
      </button>
      <button
        onClick={() => handleNavigation('/dashboard/profile')}
        className={getButtonClasses('/dashboard/profile')}
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </button>
    </nav>
  );
}
