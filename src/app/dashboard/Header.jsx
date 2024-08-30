import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Header = ({ setActiveTab, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const notifications = [
    // Add your notifications here
  ];

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative flex flex-col items-end p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white ${
        isSidebarOpen ? 'ml-[80px]' : 'ml-[-100px]'
      } transition-all duration-300`}
      style={{ zIndex: 5, position: 'relative' }}
    >
      <button
        onClick={handleNotificationsClick}
        className="flex items-center p-2 bg-purple-500 rounded-lg transition-all duration-300 hover:bg-purple-700"
      >
        <FaBell className="mr-2" />
        Notifications
      </button>

      <Drawer
        anchor="right"
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      >
        <div className="w-80 p-4" ref={notificationsRef}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <IconButton onClick={() => setShowNotifications(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <ul className="space-y-2">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                {notification}
              </li>
            ))}
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
