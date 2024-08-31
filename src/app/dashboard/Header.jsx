import { useState } from 'react';
import Notifications from './notification/notifications'; // Adjust the import path as needed
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

 
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div
      className={`relative flex flex-col items-end p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white ${
        isSidebarOpen ? 'ml-[80px]' : 'ml-[-100px]'
      } transition-all duration-300`}
      style={{ zIndex: 5, position: 'relative' }}
    >
      <button
        onClick={handleNotificationClick}
        className="flex items-center p-2 bg-purple-500 rounded-lg transition-all duration-300 hover:bg-purple-700"
      >
        <FaBell className="mr-2" />
        Notifications
      </button>

      <Notifications
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Header;
