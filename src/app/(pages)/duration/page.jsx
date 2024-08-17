"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../../../utils/Firebase/firebaseConfig';
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
          const enrollDate = data.enrollDate.toDate();
          
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
      <h1>Your Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.courseId}>
              <h2>{course.courseName}</h2>
              <p>Enroll Date: {course.enrollDate.toDateString()}</p>
              <p>Course Id- {course.courseId} </p>
              <p>End Date (3 months later): {course.endDate.toDateString()}</p>
              <p>Remaining Days: {course.remainingDays} days</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
}
