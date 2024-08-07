import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import Logo from '../../../assets/image/logo.png';
import Login from '../../../components/courseComponents/login/page';
import { auth } from '../../../utils/Firebase/firebaseConfig';
import GoogleLogin from '../../../app/Auth/login';

const db = getFirestore(); // Initialize Firestore

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Ref for the courses section
  const coursesRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ uid: authUser.uid, ...userDoc.data() });
          } else {
            setUser(authUser);
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoginOpen(false);
  };



  return (
    <header className="bg-black text-white shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <div className="text-2xl font-extrabold flex items-center space-x-2">
          <Link href="/home">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={Logo} alt="Company Logo" className="h-10 mr-2" width={40} height={40} />
              <span className="text-white">PulseZest-Learning</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/web">Web</NavLink>
          <NavLink href="/android">Android</NavLink>
          <NavLink href="/server">Server</NavLink>
          <NavLink href="/webinar" >Webinar</NavLink>
          <NavLink href="/contact-us">Contact</NavLink>

          {/* New Internship Button with Inline CSS */}
          <Link href="https://pulsezest.com/internship">
            <p
              style={internshipButtonStyles}
              onMouseEnter={(e) => handleMouseEnter(e)}
              onMouseLeave={(e) => handleMouseLeave(e)}
            >
              Internship
            </p>
          </Link>

          {user ? (
            <div className="relative">
              <Link href={`/dashboard/my-course`}>
                <p
                  className="glitch-button"
                  style={buttonStyles}
                  onMouseEnter={(e) => handleMouseEnter(e)}
                  onMouseLeave={(e) => handleMouseLeave(e)}
                >
                  Dashboard
                </p>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="glitch-button"
                style={internshipButtonStyles}
                onMouseEnter={(e) => handleMouseEnter(e)}
                onMouseLeave={(e) => handleMouseLeave(e)}
              >
                Login
              </button>
              {isLoginOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
                  <div className="bg-white w-full max-w-sm h-full shadow-md relative">
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center">
                        <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                        <span className="text-blue-400 text-2xl font-extrabold">PulseZest-Learning</span>
                      </div>
                      <button
                        onClick={() => setIsLoginOpen(false)}
                        className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                      >
                        <HiX className="text-2xl" />
                      </button>
                    </div>
                    <div className="p-8">
                      <GoogleLogin />
                      <Login onLogin={handleLogin} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      
    
   
    </header>
  );
};

const buttonStyles = {
  padding: '12px 22px',
  borderRadius: '12px',
  border: '2px solid #ffcc00', // Highlight color
  color: '#000', // Text color
  backgroundColor: '#ffcc00', // Highlight background color
  fontWeight: 'bold',
  fontSize: '16px',
  overflow: 'hidden',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const internshipButtonStyles = {
  padding: '12px 22px',
  borderRadius: '12px',
  border: '2px solid #ffcc00', // Highlight color
  color: '#000', // Text color
  backgroundColor: '#ffcc00', // Highlight background color
  fontWeight: 'bold',
  fontSize: '16px',
  overflow: 'hidden',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const handleMouseEnter = (e) => {
  e.target.style.backgroundColor = '#000';
  e.target.style.color = '#ffcc00';
};

const handleMouseLeave = (e) => {
  e.target.style.backgroundColor = '#ffcc00';
  e.target.style.color = '#000';
};

const NavLink = ({ href, children, onClick, className }) => (
  <Link href={href} onClick={onClick}>
    <p className={`text-white hover:text-blue-900 hover:border-b-2 border-transparent md:border-blue-400 transition duration-300 ease-in-out ${className}`}>
      {children}
    </p>
  </Link>
);

export default Header;
