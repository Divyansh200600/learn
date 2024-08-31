'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import { useEffect, useState } from 'react';
import { FaBars, FaBook,  FaCog, FaArrowAltCircleLeft, FaUser, FaAward,FaChartBar } from 'react-icons/fa';
import { IoChatbubblesOutline } from "react-icons/io5"; // Added FaAward for Achievements
import { auth, db } from '../../utils/Firebase/firebaseConfig';
import Header from './Header';
import DesktopMyCourses from './my-course/@Desktop/page';
import DekstopProfileScreen from './profile/@Desktop/page';
import SettignDesktopPage from './settings/@Desktop/page';
import PZhallOfFame from './pz-hall-of-fame/@Desktop/page'; 
import DiscordButton from '@/components/DiscordButton';
import DoubtSolvingLayout from './doubt-solving/@Desktop/page';
import Mystats from './my-stats/@Desktop/page';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [isDesktop, setIsDesktop] = useState(true);
  const [username, setUsername] = useState(''); // State to hold the username
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar open/close
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Set breakpoint for desktop
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize); // Add resize event listener

    return () => window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const fetchUserName = async (uid) => {
      try {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUsername(userSnapshot.data().name || ''); // Fetch and set username
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Update the activeTab based on the pathname
    const path = window.location.pathname;
    if (path.includes('my-course')) setActiveTab('my-course');
    if (path.includes('profile')) setActiveTab('Profile');
    if (path.includes('settings')) setActiveTab('settings');
    if (path.includes('doubt-solving')) setActiveTab('doubt-solving');
    if (path.includes('my-stats')) setActiveTab('my-stats');
    if (path.includes('pz-hall-of-fame')) setActiveTab('pz-hall-of-fame'); 
  }, []);

  useEffect(() => {
    // Scroll to top when activeTab changes
    window.scrollTo(0, 0);
  }, [activeTab]);

  if (!isDesktop) {
    return null; // Render nothing if not desktop
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Programmatically navigate to the new route
    router.push(`/dashboard/${tab.toLowerCase()}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'my-course':
        return <DesktopMyCourses />;
      
      case 'Profile':
        return <DekstopProfileScreen />;
      case 'settings':
        return <SettignDesktopPage />;
        case 'my-stats':
        return <Mystats />;
      case 'pz-hall-of-fame':
        return <PZhallOfFame />;
      case 'doubt-solving':
        return <DoubtSolvingLayout />;  
      default:
        return <Courses />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div
        className={`bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col transition-all duration-700 ease-in-out ${
          isSidebarOpen ? 'w-1/6' : 'w-20'
        } ${isSidebarOpen ? 'h-[calc(300vh-20px)]' : 'h-[calc(175vh-20px)'}  z-40`}
      >
        <div className="p-6 text-3xl font-extrabold flex justify-between items-center">
          {isSidebarOpen && <span className="animate-fade-in">PulseZest</span>}
          <button
            onClick={toggleSidebar}
            className="text-xl transform transition-transform duration-300 ease-in-out hover:scale-110"
          >
            {isSidebarOpen ? <FaArrowAltCircleLeft /> : <FaBars />}
          </button>
        </div>
        {isSidebarOpen && <div className="user ml-4 animate-fade-in">Welcome👋{username}</div>}
        <div className="flex flex-col mt-8 space-y-4">
          <button
            onClick={() => handleTabChange('my-course')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'my-course' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <FaBook className="mr-3" />
            {isSidebarOpen && 'Courses'}
          </button>
          <button
            onClick={() => handleTabChange('Profile')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'Profile' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <FaUser className="mr-3" />
            {isSidebarOpen && 'Profile'}
          </button>

          <button
            onClick={() => handleTabChange('my-stats')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'my-stats' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <FaChartBar className="mr-3" />
            {isSidebarOpen && 'My-Stats'}
          </button>

          <button
            onClick={() => handleTabChange('pz-hall-of-fame')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'pz-hall-of-fame' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <FaAward className="mr-3" />
            {isSidebarOpen && 'PZ Hall Of Fame'}
          </button>

          <button
            onClick={() => handleTabChange('doubt-solving')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'doubt-solving' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <IoChatbubblesOutline className="mr-3" />
            {isSidebarOpen && 'Doubt Solving'}
          </button>
          
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center p-4 hover:bg-indigo-400 rounded-lg transition-all duration-500 ease-in-out transform hover:translate-x-1 ${
              activeTab === 'settings' ? 'bg-indigo-400 shadow-lg' : ''
            }`}
          >
            <FaCog className="mr-3" />
            {isSidebarOpen && 'Settings'}
          </button>

          <DiscordButton />
        </div>
      </div>
      <div className={`flex-1 ml-${isSidebarOpen ? '1/6' : '20'} transition-all duration-700 ease-in-out relative`} style={{ zIndex: 10 }}>
        <Header setActiveTab={setActiveTab} />
        <div className="p-4 text-black">{renderContent()}</div>
      </div>
    </div>
  );
};

const Courses = () => (
  <div>
    <h2 className="text-4xl font-extrabold mb-6 animate-fade-in-up">Select one</h2>
    {/* Add content for Courses here */}
  </div>
);

export default Dashboard;
