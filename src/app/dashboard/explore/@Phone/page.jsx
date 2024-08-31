'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Notifications from '@/app/dashboard/notification/notifications';
import { BellIcon } from '@heroicons/react/outline';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust the path to your Firebase config
import { collection, getDocs } from 'firebase/firestore';

export default function ExplorePhoneScreen() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);

  // Function to handle bell icon click
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Function to fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const coursesList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on the search query
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle course click and navigate to course details
  const handleCourseClick = (courseId) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">Explore</h1>
        <button onClick={handleBellClick} className="focus:outline-none">
          <BellIcon className="w-6 h-6 text-blue-600" />
        </button>
      </header>
      
      {/* Search Bar */}
      <div className="px-4 pt-4">
        <TextField 
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: '999px',
            backgroundColor: 'white',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      {/* Display Courses */}
      <main className="p-4 grid grid-cols-2 gap-4">
        {filteredCourses.map(course => (
          <div 
            key={course.id} 
            onClick={() => handleCourseClick(course.id)} // Handle click to navigate
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <img 
              src={course.thumbnail} 
              alt={course.name} 
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-2">
              <h2 className="text-lg font-bold">{course.name}</h2>
            </div>
          </div>
        ))}
      </main>
      
      <Notifications
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
    </div>
  );
}
