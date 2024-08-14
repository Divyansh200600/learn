'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMedal, FaTrophy } from 'react-icons/fa';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/Firebase/firebaseConfig';

const DesktopAchievementPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentProgressList, setStudentProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //page open from the top
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    
    // Set a timeout to ensure the scroll happens after rendering
    const timeoutId = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timeoutId); // Clean up the timeout if the component unmounts
  }, []);

  // Fetch courses for selection
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCourses(coursesList);
        console.log('Courses fetched successfully:', coursesList);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Error fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students and their progress for the selected course
  useEffect(() => {
    const fetchStudentsProgress = async () => {
      if (!selectedCourse) return;

      setLoading(true);
      try {
        // Fetch all students
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const studentsList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));

        // Fetch course details to determine total number of videos
        const courseDoc = await getDoc(doc(db, 'courses', selectedCourse.id));
        const courseData = courseDoc.data();
        const chapters = courseData?.chapters || [];

        // Calculate total number of videos in the course
        let totalVideos = 0;
        const videoIds = []; // To store all video IDs
        for (const chapter of chapters) {
          for (const topic of chapter.topics) {
            for (const video of topic.videoLinks) {
              totalVideos += 1;
              videoIds.push(video.id);
            }
          }
        }

        console.log(`Total number of videos in the course: ${totalVideos}`);

        const progressPromises = studentsList.map(async (student) => {
          const userCoursesSnapshot = await getDocs(collection(db, 'users', student.id, 'courses'));
          const userCourses = userCoursesSnapshot.docs.map(doc => doc.id);

          if (userCourses.includes(selectedCourse.id)) {
            const courseProgressSnapshot = await getDocs(collection(db, 'users', student.id, 'courses', selectedCourse.id, 'videoProgress'));
            const videoProgress = {};
            courseProgressSnapshot.forEach((videoDoc) => {
              const data = videoDoc.data();
              if (data && data.progress) {
                videoProgress[videoDoc.id] = data.progress;
              }
            });

            console.log(`Video progress for student ${student.name}:`, videoProgress);

            // Sum up progress for all videos
            let sumProgress = 0;
            for (const vid of videoIds) {
              const progress = videoProgress[vid] || 0;
              sumProgress += progress;
            }

            // Calculate overall progress percentage
            const overallProgress = (sumProgress / totalVideos);

            return { ...student, progress: overallProgress };
          } else {
            // Student hasn't enrolled in the selected course
            return { ...student, progress: 0 };
          }
        });

        const studentProgressData = await Promise.all(progressPromises);

        // Sort students by progress in descending order
        const sortedStudents = studentProgressData.sort((a, b) => b.progress - a.progress);

        setStudentProgressList(sortedStudents);
        console.log('Students and their overall progress:', sortedStudents);
      } catch (error) {
        console.error('Error fetching students or progress:', error);
        setError('Error fetching students or progress.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsProgress();
  }, [selectedCourse]);

  // Separate top 3 students
  const topStudents = studentProgressList.slice(0, 3);
  const otherStudents = studentProgressList.slice(3);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-lg font-semibold text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900">
        🥇 PZ-Learning Hall of Fame Board 🏆
      </h1>

      {/* Course Selection */}
      <div className="mb-12 text-center">
        <select
          className="p-3 border rounded-lg"
          value={selectedCourse ? selectedCourse.id : ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selected = courses.find(course => course.id === selectedId);
            setSelectedCourse(selected);
          }}
        >
          <option value="" disabled>Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-12">
        <h2 className="text-4xl font-semibold mb-6 text-center text-indigo-800">🎓 Top Students 👏</h2>
        <div className="flex flex-col items-center space-y-6">
          {topStudents.map((student, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-lg shadow-lg font-bold flex items-center justify-between w-4/5 transform ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-4 border-yellow-800' :
                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 border-4 border-gray-600' :
                'bg-gradient-to-r from-orange-400 to-orange-500 text-black border-4 border-orange-700'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-4xl">
                  {index === 0 && <FaTrophy />}
                  {index === 1 && <FaMedal />}
                  {index === 2 && <FaStar />}
                </span>
                <span className="text-3xl">{student.name}</span>
              </div>
              <span className="text-2xl">{student.progress.toFixed(2)}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-4xl font-semibold mb-6 text-center text-indigo-800">🎓 Other Students 🌟</h2>
        <ul className="list-disc list-inside space-y-4">
          {otherStudents.map((student, index) => (
            <motion.li
              key={index}
              className="p-6 border-b border-gray-300 bg-white shadow-md rounded-lg flex items-center justify-between hover:bg-gray-100 transition duration-300 transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="font-semibold text-xl">{student.name}</span>
              <span className="text-xl">{student.progress.toFixed(2)}%</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DesktopAchievementPage;
