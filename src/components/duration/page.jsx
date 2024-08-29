"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../../utils/Firebase/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID
      } else {
        // Handle the case where the user is not logged in
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait until we have the userId

    async function fetchCourses() {
      try {
        const coursesRef = collection(db, `users/${userId}/courses`);
        const querySnapshot = await getDocs(coursesRef);

        const fetchedCourses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Handle enrollDate as a Timestamp or a string
          let enrollDate = null;
          if (data.enrollDate) {
            if (data.enrollDate.toDate) {
              // If enrollDate is a Firestore Timestamp
              enrollDate = data.enrollDate.toDate();
            } else if (typeof data.enrollDate === 'string') {
              // If enrollDate is a date string
              enrollDate = new Date(data.enrollDate);
            } else {
              console.error(`Invalid enrollDate type for course ${doc.id}`);
              return; // Skip this course if enrollDate is invalid
            }
          } else {
            console.error(`Missing enrollDate for course ${doc.id}`);
            return; // Skip this course if enrollDate is missing
          }

          // Calculate the end date (3 months from enroll date)
          const endDate = new Date(enrollDate);
          endDate.setMonth(endDate.getMonth() + 3);
          
          // Calculate the remaining days
          const currentDate = new Date();
          const remainingDays = Math.max(Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24)), 0);

          fetchedCourses.push({
            ...data,
            enrollDate, // Store as Date object for display
            endDate, // Store as Date object for display
            remainingDays,
            courseId: doc.id
          });
        });

        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [userId]);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.courseId} className="mb-4">
              <div className="flex items-center">
                <p className="text-lg font-semibold text-gray-800 mr-2">Remaining Days:</p>
                <span className={`text-lg font-bold text-white px-3 py-1 rounded-full ${course.remainingDays > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {course.remainingDays} days
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No courses found.</p>
      )}
    </div>
  );
}
