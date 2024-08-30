'use client'
import CategoryCard from '@/components/home/CourseCard';
import { BellIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure

export default function PhoneHomescreen() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // State to control the notification drawer
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesList = await fetchCategories();
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(true); // Show the notification drawer
  };

  const handleCloseNotificationDrawer = () => {
    setShowNotifications(false); // Close the notification drawer
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800 pb-[calc(60px+1rem)]">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">PulseZest Learning</h1>
        <button onClick={handleNotificationClick} className="focus:outline-none">
          <BellIcon className="w-6 h-6 text-blue-600" />
        </button>
      </header>

      <main className="p-4">
        <section className='mb-6'>
          <h2 className="text-xl font-semibold text-blue-600">Courses</h2>
          <div className="grid grid-cols-1 gap-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      </main>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={showNotifications}
        onClose={handleCloseNotificationDrawer}
      >
        <div className="w-80 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <IconButton onClick={handleCloseNotificationDrawer}>
              <CloseIcon />
            </IconButton>
          </div>
          {/* Add notification content here */}
          <ul className="space-y-2">
            {/* Example notifications; replace with your dynamic data */}
            <li className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer">Notification 1</li>
            <li className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer">Notification 2</li>
            <li className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer">Notification 3</li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
}
