"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../../utils/Firebase/firebaseConfig';
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Duration({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID
      } else {
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    if (!userId || !courseId) return; // Wait until we have the userId and courseId

    async function fetchCourse() {
      try {
        // Fetch enrollDate from the user's course document
        const enrollRef = doc(db, `users/${userId}/courses/${courseId}`);
        const enrollDoc = await getDoc(enrollRef);

        if (enrollDoc.exists()) {
          const enrollData = enrollDoc.data();
          
          // Handle enrollDate as a Timestamp or a string
          let enrollDate = null;
          if (enrollData.enrollDate) {
            if (enrollData.enrollDate.toDate) {
              enrollDate = enrollData.enrollDate.toDate();
            } else if (typeof enrollData.enrollDate === 'string') {
              enrollDate = new Date(enrollData.enrollDate);
            } else {
              console.error(`Invalid enrollDate type for course ${courseId}`);
              return;
            }
          } else {
            console.error(`Missing enrollDate for course ${courseId}`);
            return;
          }

          // Fetch courseDuration from the courses collection
          const courseRef = doc(db, `courses/${courseId}`);
          const courseDoc = await getDoc(courseRef);

          if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            const durationMonths = courseData.courseDuration ; // Default to 3 months if not provided
            
            // Calculate the end date based on the duration
            const endDate = new Date(enrollDate);
            endDate.setMonth(endDate.getMonth() + durationMonths);

            // Calculate the remaining days
            const currentDate = new Date();
            const remainingDays = Math.max(Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24)), 0);

            // Log details to console
            console.log(`Enroll Date: ${enrollDate.toISOString()}`);
            console.log(`Course Duration (months): ${durationMonths}`);
            console.log(`End Date: ${endDate.toISOString()}`);
            console.log(`Remaining Days: ${remainingDays}`);

            if (remainingDays === 0) {
              // Delete the course from the Firestore
              await deleteDoc(enrollRef);
              console.log(`Course ${courseId} deleted as remaining days are zero.`);
              setCourse(null); // Set course to null after deletion
            } else {
              setCourse({
                ...enrollData,
                enrollDate,
                endDate,
                remainingDays,
                courseId
              });
            }
          } else {
            console.error(`No course document found for course ${courseId}`);
          }
        } else {
          console.error(`No enroll document found for course ${courseId}`);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [userId, courseId]);

  if (loading) return <p>Loading course details...</p>;

  if (!course) return <p>No course found or course has been deleted.</p>;

  return (
    <div className="flex items-center">
      <p className="text-lg font-semibold text-gray-800 mr-2">Remaining Days:</p>
      <span className={`text-lg font-bold text-white px-3 py-1 rounded-full ${course.remainingDays > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
        {course.remainingDays} days
      </span>
    </div>
  );
}
