'use client'
import { ArrowLeftIcon, PauseIcon, PlayIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import fetchCourseData from "../Function/fetchCourseData"; // Adjust the import path as per your project structure
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project
import { useAuthState } from 'react-firebase-hooks/auth'; // Firebase auth hook

export default function CoursePhoneScreen({ params }) {
  const docId = params.id;
  const [user, loading, error] = useAuthState(auth); // Fetch user state from Firebase auth
  const [courseData, setCourseData] = useState({
    courseName: '',
    introVideo: '',
    courseLevel: '',
    regularPrice: '',
    salePrice: '',
    description: '',
    whatYouLearn: '',
    courseDuration:'',
    courseRequirements: '',
    instructor: '',
    duration: '',
    language: '',
    rating: '',
    sales: []
  });
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchCourseData(docId);
      if (data) {
        setCourseData(data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [docId]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (user) {
        const userCourseRef = doc(db, 'users', user.uid, 'courses', docId);
        const userDoc = await getDoc(userCourseRef);

        if (userDoc.exists()) {
          setIsPurchased(true);
        }
      }
    };

    checkPurchaseStatus();
  }, [user, docId]);

  const activeSale = courseData.sales?.find(sale => sale.live === true);
  const displayPrice = isPurchased ? courseData.salePrice : (activeSale ? activeSale.price : courseData.salePrice);
  const regularPrice = courseData.regularPrice;

  const formatter = new Intl.NumberFormat('en-IN');
  const discount = activeSale ? Math.round(((regularPrice - activeSale.price) / regularPrice) * 100) : 0;

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

  return (
    <div className="min-h-screen bg-blue-200 pt-8 pb-16">
      <header
        className={`flex justify-between items-center p-4 bg-white shadow w-full fixed top-0 transition-all duration-300 ${isHeaderVisible ? "" : "-translate-y-full"
          }`}
      >
        <Link href="/home">
          <div className="text-blue-600 flex items-center">
            <ArrowLeftIcon className="w-6 h-6 mr-2" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-blue-600">{courseData.name}</h1>
        <div></div>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-20">
        <div className="relative overflow-hidden bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
          <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform rotate-45"></span>
          <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform -rotate-45"></span>
          <span className="relative z-10">Newly Launched</span>
        </div>
        <div className="relative">
          <video
            ref={videoRef}
            src={courseData.introVideo}
            alt="Intro Video"
            width={320}
            height={180}
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isPlaying || isHovered ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isPlaying ? (
              <button onClick={handlePlayToggle} className="text-white bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
                <PauseIcon className="w-10 h-10" />
              </button>
            ) : (
              <button onClick={handlePlayToggle} className="text-white bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
                <PlayIcon className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {!isPurchased && activeSale && (
            <div className="bg-yellow-200 p-4 mb-4 rounded-lg shadow-md animate-bounce">
              <p className="text-lg font-semibold text-yellow-700">🎉 Limited Time Offer! Get {discount}% off! Ends in {timeLeft} 🎉</p>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div>
              <br></br>
              <br></br>
              <p className="text-2xl font-bold text-green-600 mb-4">{courseData.courseLevel}</p>
              
            </div>
            
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {regularPrice && (
                <span className="line-through">₹{formatter.format(regularPrice)}</span>
              )} ₹{formatter.format(displayPrice)}
            </div>
            
          </div>
          <p className="text-1xl font-bold text-orange-600 mb-4">Course Duration: {courseData.courseDuration}</p>
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
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">Additional Information</h3>
            <div className="flex justify-start items-center">
            <div className="mr-6">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Instructor:</span> Prof. Rishab Chauhan
                </p>
              </div>
            
              <div className="mr-6">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Language:</span> Hindi
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Rating:</span>{" "}
                  ⭐️⭐️⭐️⭐️🌜
                </p>
              </div>
            </div>
          </div>
          {isPurchased ? (
            <Link href="/dashboard/my-course" passHref>
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href={`/${docId}/checkout`} passHref>
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full">
                Enroll Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}