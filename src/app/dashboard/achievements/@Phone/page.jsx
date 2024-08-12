'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMedal, FaTrophy } from 'react-icons/fa';

const PhoneAchievementPage = () => {
  // Sample data for demonstration
  const students = [
    { name: 'Alice', score: 95 },
    { name: 'Bob', score: 90 },
    { name: 'Charlie', score: 85 },
    { name: 'David', score: 80 },
    { name: 'Eve', score: 75 },
    { name: 'Frank', score: 70 },
    { name: 'Grace', score: 65 },
    { name: 'Hank', score: 60 },
    { name: 'Ivy', score: 55 },
    { name: 'Jack', score: 50 },
    { name: 'Karen', score: 45 },
    { name: 'Leo', score: 40 },
  ];

  // Sort students by score in descending order
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  // Get the top 3 students
  const topStudents = sortedStudents.slice(0, 3);
  const otherStudents = sortedStudents.slice(3);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
        PulseZest Achievement Board
      </h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">Top Students</h2>
        <div className="flex flex-col items-center space-y-4">
          {topStudents.map((student, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg shadow-lg font-bold flex items-center justify-between w-full ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-4 border-yellow-800' : 
                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 border-4 border-gray-600' :
                'bg-gradient-to-r from-orange-400 to-orange-500 text-black border-4 border-orange-700'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {index === 0 && <FaTrophy />}
                  {index === 1 && <FaMedal />}
                  {index === 2 && <FaStar />}
                </span>
                <span className="text-xl">{student.name}</span>
              </div>
              <span className="text-xl">{student.score}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">Other Students</h2>
        <ul className="list-disc list-inside space-y-2">
          {otherStudents.map((student, index) => (
            <motion.li
              key={index}
              className="p-4 border-b border-gray-300 bg-white shadow-md rounded-lg flex items-center justify-between hover:bg-gray-100 transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="font-semibold text-lg">{student.name}</span>
              <span className="text-lg">{student.score}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhoneAchievementPage;
