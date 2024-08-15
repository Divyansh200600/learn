'use client';

import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link'; // Import Link from Next.js for navigation
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Firebase auth hook
import { auth, db } from '../../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project
import fetchCourseData from '../Function/fetchCourseData';
import { FaChevronDown, FaVideo } from 'react-icons/fa';

export default function CourseDesktopScreen({ params }) {
  const { id } = params; // Destructure id from params
  const [user, loading, error] = useAuthState(auth); // Fetch user state from Firebase auth

  const [courseData, setCourseData] = useState({
    courseName: '',
    introVideo: '',
    courseLevel: '',
    courseDuration:'',
    regularPrice: '',
    salePrice: '',
    description: '',
    whatYouLearn: '',
    courseRequirements: '',
    instructor: '',
    duration: '',
    language: '',
    rating: '',
    sales: [],
    chapters: [] // Add this to handle the syllabus chapters
  });

  const [isPurchased, setIsPurchased] = useState(false); // State to check if the course is purchased
  const [timeLeft, setTimeLeft] = useState(''); // State for the countdown timer
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchData = async () => {
    const data = await fetchCourseData(id); // Fetch course data based on id
    if (data) {
      setCourseData(data);
    }

    if (user) {
      // Fetch user-specific data to check course purchase
      const userCourseRef = doc(db, 'users', user.uid, 'courses', id);
      const userDoc = await getDoc(userCourseRef);
      if (userDoc.exists()) {
        setIsPurchased(true); // Set course as purchased if found in Firestore
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const activeSale = courseData.sales?.find(sale => sale.live === true);
  const displayPrice = isPurchased ? courseData.salePrice : (activeSale ? activeSale.price : courseData.salePrice);
  const regularPrice = courseData.regularPrice;

  // Format prices using Indian numbering system with commas
  const formatter = new Intl.NumberFormat('en-IN');

  // Calculate discount percentage
  const discount = activeSale ? Math.round(((regularPrice - activeSale.price) / regularPrice) * 100) : 0;

  // Countdown Timer Calculation
  useEffect(() => {
    if (activeSale && activeSale.saleTime) {
      const countdown = setInterval(() => {
        const now = new Date().getTime();
        const saleEndTime = new Date(activeSale.saleTime).getTime();
        const distance = saleEndTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

        if (distance < 0) {
          clearInterval(countdown);
          setTimeLeft('Expired');
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [activeSale]);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleEnrollClick = () => {
    if (user) {
      // Redirect to checkout page with id
      window.location.href = `/${id}/checkout`;
    } else {
      // Redirect to login or show a message
      console.log('User is not logged in. Redirecting to login page...');
      // For example, you could navigate to a login page using Next.js Link component:
      // Router.push('/login');
    }
  };

  const openSyllabusModal = () => {
    setIsModalOpen(true);
  };

  const closeSyllabusModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while user authentication is in progress
  }

  return (
    <div className="min-h-screen bg-blue-200 pt-8 pb-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="p-6 flex justify-between items-center text-blue-600 animate-fade-in">
          <h1 className="text-3xl font-bold">{courseData.name}</h1>
          <span className="text-xl">Coures Duration: {courseData.courseDuration}</span>
        </div>
        <div className="relative">
          <video
            ref={videoRef}
            src={courseData.introVideo}
            alt="Intro Video"
            width={800}
            height={450}
            className="w-full animate-slide-in"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
              isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isPlaying ? (
              <button
                onClick={handlePlayToggle}
                className="text-white bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <PauseIcon className="w-10 h-10" />
              </button>
            ) : (
              <button
                onClick={handlePlayToggle}
                className="text-white bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <PlayIcon className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {!isPurchased && activeSale && (
            <div className="bg-yellow-200 p-4 mb-4 rounded-lg shadow-md animate-bounce">
              <p className="text-lg font-semibold text-yellow-700">
                Limited Time Offer! Get {discount}% off! Ends in {timeLeft}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-green-600 mb-4">{courseData.courseLevel}</p>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {regularPrice && (
                <span className="line-through">₹{formatter.format(regularPrice)}</span>
              )}
              {' '}
              ₹{formatter.format(displayPrice)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative overflow-hidden bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform rotate-45"></span>
                <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform -rotate-45"></span>
                <span className="relative z-10">Newly Launched</span>
              </div>
            </div>
            {isPurchased ? (
              <Link href={`/dashboard/my-course`} passHref>
                <p className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer">
                  Go To Dashboard
                </p>
              </Link>
            ) : (
              <Link href={`/${id}/checkout`} passHref>
                <p onClick={handleEnrollClick} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer">
                  Enroll Now
                </p>
              </Link>
            )}
          </div>
          <br />
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">Description</h3>
            <p className="text-lg text-gray-700">{courseData.description}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">What You Will Learn</h3>
            <p className="text-lg text-gray-700">{courseData.whatYouLearn}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">Course Requirements</h3>
            <p className="text-lg text-gray-700">{courseData.courseRequirements}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">
              Additional Information
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Instructor:</span> Prof. Rishab Chauhan 
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Language:</span> Hindi
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Rating:</span>{" "}
                ⭐️⭐️⭐️⭐️🌜
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
        <button
          onClick={openSyllabusModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors"
        >
          View Syllabus
        </button>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-0 rounded-lg shadow-lg max-w-4xl w-full h-[80vh] relative overflow-hidden">
      <button
        onClick={closeSyllabusModal}
        className="absolute top-4 right-4 text-xl font-bold z-10 bg-white p-2 rounded-full"
      >
        &times;
      </button>
      <iframe
  src={`${courseData.syllabusPdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
  className="w-full h-full"
  title="Syllabus PDF"
  style={{ border: 'none' }}
></iframe>

    </div>
  </div>
)}

    </div>
    </div>
    </div>


  );
}
