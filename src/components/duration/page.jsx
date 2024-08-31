"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../../utils/Firebase/firebaseConfig';
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { differenceInDays, addMonths, format } from 'date-fns'; // Importing date-fns for date manipulation and formatting

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

        if (!enrollDoc.exists()) {
          console.error(`No enroll document found for course ${courseId}`);
          return;
        }

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

        // Check if enrollDate is valid
        if (isNaN(enrollDate.getTime())) {
          console.error(`Invalid enrollDate value for course ${courseId}`);
          return;
        }

        // Fetch courseDuration from the courses collection
        const courseRef = doc(db, `courses/${courseId}`);
        const courseDoc = await getDoc(courseRef);

        if (!courseDoc.exists()) {
          console.error(`No course document found for course ${courseId}`);
          return;
        }

        const courseData = courseDoc.data();
        let durationMonths = courseData.courseDuration;

        // Check if courseDuration is a string that needs to be parsed
        if (typeof durationMonths === 'string') {
          const match = durationMonths.match(/(\d+)/);
          if (match) {
            durationMonths = parseInt(match[0], 10);
          } else {
            console.error(`Invalid courseDuration string for course ${courseId}: ${durationMonths}`);
            return;
          }
        }

        // Check if courseDuration is valid
        if (isNaN(durationMonths) || durationMonths <= 0) {
          console.error(`Invalid courseDuration value for course ${courseId}: ${durationMonths}`);
          return;
        }

        // Calculate the end date based on the duration
        const endDate = addMonths(enrollDate, durationMonths);

        // Check if endDate is valid
        if (isNaN(endDate.getTime())) {
          console.error(`Invalid endDate value for course ${courseId}: ${endDate}`);
          return;
        }

        // Calculate the remaining days
        const currentDate = new Date();
        const remainingDays = differenceInDays(endDate, currentDate);

       

        if (remainingDays <= 0) {
          // Delete the course from Firestore if remaining days are zero or negative
          await deleteDoc(enrollRef);
          console.log(`Course ${courseId} deleted as remaining days are zero or negative.`);
          setCourse(null); // Reset the course state after deletion
        } else {
          setCourse({
            ...enrollData,
            enrollDate,
            endDate,
            remainingDays,
            courseId
          });
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
