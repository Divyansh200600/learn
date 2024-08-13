import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';

const Header = ({ setActiveTab, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const notifications = [
    'Notification 1',
    'Notification 2',
    'Notification 3',
    'Notification 4',
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
      {showNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-6 top-16 bg-white text-black rounded-lg shadow-lg p-4 w-64"
        >
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
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
      )}
    </div>
  );
};

export default Header;
