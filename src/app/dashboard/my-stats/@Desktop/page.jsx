'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { CircularProgress, LinearProgress } from '@mui/material'; // For modern progress bars

export default function DesktopMyStatsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [totalCourseProgress, setTotalCourseProgress] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("User not authenticated");
          return;
        }

        // Fetch the user's courses subcollection
        const coursesCollectionRef = collection(db, 'users', user.uid, 'courses');
        const coursesSnapshot = await getDocs(coursesCollectionRef);

        // Retrieve all course IDs
        const enrolledCourses = coursesSnapshot.docs.map(doc => doc.id);

        if (enrolledCourses.length === 0) {
          console.log("No courses available");
          return;
        }

        // Fetch each course's data from the main courses collection
        const coursesArray = await Promise.all(
          enrolledCourses.map(async (courseId) => {
            const courseSnap = await getDoc(doc(db, 'courses', courseId));
            if (courseSnap.exists()) {
              return { id: courseId, ...courseSnap.data() };
            }
            return null;
          })
        );

        // Filter out any null values in case a course doesn't exist
        setCourses(coursesArray.filter(course => course !== null));
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCourseSelection = async (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);

    try {
      const courseSnap = await getDoc(doc(db, 'courses', courseId));
      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        setCourseDetails(courseData);

        // Fetch video progress
        const user = auth.currentUser;
        if (user) {
          const videoProgressRef = collection(db, 'users', user.uid, 'courses', courseId, 'videoProgress');
          const videoProgressSnapshot = await getDocs(videoProgressRef);
          const videoProgressData = {};
          let totalProgress = 0;

          videoProgressSnapshot.forEach((doc) => {
            const data = doc.data();
            videoProgressData[doc.id] = data.progress || 0;
            totalProgress += data.progress || 0;
          });

          // Calculate total videos count
          const totalVideosCount = courseData.chapters.reduce((count, chapter) => {
            return count + chapter.topics.reduce((topicCount, topic) => {
              return topicCount + (topic.videoLinks ? topic.videoLinks.length : 0);
            }, 0);
          }, 0);

          const courseProgressPercentage = totalVideosCount > 0 ? (totalProgress / (totalVideosCount * 100)) * 100 : 0;
          setVideoProgress(videoProgressData);
          setTotalCourseProgress(courseProgressPercentage);

          // Log detailed video progress data
        
          courseData.chapters.forEach((chapter, chapterIndex) => {
            chapter.topics.forEach((topic, topicIndex) => {
              topic.videoLinks.forEach((video, videoIndex) => {
                const videoKey = `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`;
                const progress = videoProgressData[videoKey] || 0;
              
              });
            });
          });
        }
      } else {
        console.log("Course not found");
        setCourseDetails(null);
        setVideoProgress({});
        setTotalCourseProgress(0);
      }
    } catch (error) {
      console.error("Error fetching course data: ", error);
    }
  };

  const renderVideos = (videoLinks, chapterIndex, topicIndex) => {
    if (!Array.isArray(videoLinks) || videoLinks.length === 0) return <li>No videos available</li>;
  
    return videoLinks.map((video, index) => {
      // Use chapterIndex and topicIndex directly if they are passed
      const videoIndex = index + 1; // Index for the video in the current topic
      
      // Construct the key based on chapter, topic, and video index
      const videoKey = `video-${chapterIndex}-${topicIndex}-${videoIndex}`;
  
      // Get the progress for this video
      const progress = videoProgress[videoKey] || 0;
  
     
  
      return (
        <li key={videoKey} className="mb-4">
          <div className="font-semibold">Video {videoIndex}</div>
          <div className="flex items-center mt-2">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="w-full"
              sx={{ height: '10px', borderRadius: '5px' }}
            />
            <span className="ml-2">{progress.toFixed(2)}%</span>
          </div>
          <div className="mt-2">
            {/* Render video description */}
          
          </div>
         
        </li>
      );
    });
  };
  
  

  const renderTopics = (topics, chapterIndex) => {
    if (!Array.isArray(topics) || topics.length === 0) return <li>No topics available</li>;
  
    return topics.map((topic, index) => (
      <li key={index} className="mt-2">
        <strong>{topic.topicName}</strong>
        <ul className="ml-6 list-disc">
          {renderVideos(topic.videoLinks, chapterIndex, index + 1)}
        </ul>
      </li>
    ));
  };
  
  const renderChapters = (chapters) => {
    if (!Array.isArray(chapters) || chapters.length === 0) return <li>No chapters available</li>;
  
    return chapters.map((chapter, chapterIndex) => (
      <li key={chapterIndex} className="mt-4">
        <h4 className="text-lg font-semibold">{chapter.chapterName}</h4>
        <ul className="ml-4">
          {renderTopics(chapter.topics, chapterIndex + 1)}
        </ul>
      </li>
    ));
  };
  
  
  return (
    <div className="p-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 min-h-screen">
      <h1 className="text-2xl mb-6">My Stats Page</h1>
      <div>
        <label htmlFor="courseSelector" className="block mb-2">Select a Course:</label>
        <select
          id="courseSelector"
          value={selectedCourseId}
          onChange={handleCourseSelection}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>Select a course</option>
          {courses.length > 0 ? (
            courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))
          ) : (
            <option value="" disabled>No courses available</option>
          )}
        </select>
      </div>
      {courseDetails && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{courseDetails.name}</h2>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Total Course Progress</h3>
            <div className="flex items-center mb-6">
              <CircularProgress
                variant="determinate"
                value={totalCourseProgress}
                size={80}
                thickness={4}
              />
              <span className="ml-4 text-xl">{totalCourseProgress.toFixed(2)}%</span>
            </div>
            <h3 className="text-lg font-semibold">Chapters</h3>
            <ul className="ml-4 list-decimal">
              {renderChapters(courseDetails.chapters)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}