'use client';
import CategoryCard from '@/components/home/CourseCard';
import { BellIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure
import Notifications from '@/app/dashboard/notification/notifications';

export default function PhoneHomescreen() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Function to handle bell icon click
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800 pb-[calc(60px+1rem)]">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">PulseZest Learning</h1>
        <button onClick={handleBellClick} className="focus:outline-none">
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

      <Notifications
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
       
      />
    </div>
  );
}
