'use client';

import { BellIcon, BookOpenIcon, DocumentSearchIcon, HomeIcon, UserIcon } from '@heroicons/react/outline';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const getButtonClasses = (path) => {
    return `flex flex-col items-center ${
      pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
    } transition-colors`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow p-4 flex justify-around">
      <button onClick={() => handleNavigation('/home')} className={getButtonClasses('/home')}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </button>
      <button onClick={() => handleNavigation('/dashboard/explore')} className={getButtonClasses('/dashboard/my-course')}>
        <DocumentSearchIcon className="w-6 h-6" />
        <span className="text-xs">Explore</span>
      </button>
      <button onClick={() => handleNavigation('/dashboard/my-course')} className={getButtonClasses('/dashboard/my-course')}>
        <BookOpenIcon className="w-6 h-6" />
        <span className="text-xs">Course</span>
      </button>
      <button onClick={() => handleNavigation('/dashboard/notification')} className={getButtonClasses('/dashboard/notification')}>
        <BellIcon className="w-6 h-6" />
        <span className="text-xs">Notifications</span>
      </button>
      <button onClick={() => handleNavigation('/dashboard/profile')} className={getButtonClasses('/dashboard/profile')}>
        <UserIcon className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </button>
    </nav>
  );
}
