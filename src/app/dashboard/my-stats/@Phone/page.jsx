'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { CircularProgress, LinearProgress, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function PhoneMyStatsPage() {
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

        const coursesCollectionRef = collection(db, 'users', user.uid, 'courses');
        const coursesSnapshot = await getDocs(coursesCollectionRef);
        const enrolledCourses = coursesSnapshot.docs.map(doc => doc.id);

        if (enrolledCourses.length === 0) {
          console.log("No courses available");
          return;
        }

        const coursesArray = await Promise.all(
          enrolledCourses.map(async (courseId) => {
            const courseSnap = await getDoc(doc(db, 'courses', courseId));
            if (courseSnap.exists()) {
              return { id: courseId, ...courseSnap.data() };
            }
            return null;
          })
        );

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

          const totalVideosCount = courseData.chapters.reduce((count, chapter) => {
            return count + chapter.topics.reduce((topicCount, topic) => {
              return topicCount + (topic.videoLinks ? topic.videoLinks.length : 0);
            }, 0);
          }, 0);

          const courseProgressPercentage = totalVideosCount > 0 ? (totalProgress / (totalVideosCount * 100)) * 100 : 0;
          setVideoProgress(videoProgressData);
          setTotalCourseProgress(courseProgressPercentage);
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
      const videoIndex = index + 1; // Index for the video in the current topic
      const videoKey = `video-${chapterIndex}-${topicIndex}-${videoIndex}`;
      const progress = videoProgress[videoKey] || 0;

      return (
        <li key={videoKey} className="mb-3">
          <div className="font-medium text-gray-800">Video {videoIndex}</div>
          <div className="flex items-center mt-1 ">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="w-full"
              sx={{ height: '8px', borderRadius: '4px' }}
            />
            <span className="ml-2 text-sm text-gray-600">{progress.toFixed(2)}%</span>
          </div>
        </li>
      );
    });
  };

  const renderTopics = (topics, chapterIndex) => {
    if (!Array.isArray(topics) || topics.length === 0) return <li>No topics available</li>;

    return topics.map((topic, index) => (
      <li key={index} className="mt-2">
        <strong className="text-gray-800">{topic.topicName}</strong>
        <ul className="ml-2 list-disc">
          {renderVideos(topic.videoLinks, chapterIndex, index + 1)}
        </ul>
      </li>
    ));
  };

  const renderChapters = (chapters) => {
    if (!Array.isArray(chapters) || chapters.length === 0) return <li>No chapters available</li>;

    return chapters.map((chapter, chapterIndex) => (
      <Accordion key={chapterIndex} defaultExpanded={chapterIndex === 0} sx={{ backgroundColor: '#f7f7f7' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e0e0e0' }}>
          <Typography className="text-base font-medium">{chapter.chapterName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="ml-2 list-disc">
            {renderTopics(chapter.topics, chapterIndex + 1)}
          </ul>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 min-h-screen pb-[calc(60px+1rem)]">
      <h1 className="text-xl mb-4 font-bold text-gray-800">My Stats Page</h1>
      <div className="mb-4">
        <label htmlFor="courseSelector" className="block mb-2 text-sm font-medium text-gray-700">Select a Course:</label>
        <select
          id="courseSelector"
          value={selectedCourseId}
          onChange={handleCourseSelection}
          className="p-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div>
          <h2 className="text-lg font-bold text-gray-800">{courseDetails.name}</h2>
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700">Total Course Progress</h3>
            <div className="flex items-center mb-4">
              <CircularProgress
                variant="determinate"
                value={totalCourseProgress}
                size={50}
                thickness={4}
                sx={{ color: '#4caf50' }}
              />
              <span className="ml-2 text-lg text-gray-800">{totalCourseProgress.toFixed(2)}%</span>
            </div>
            <h3 className="text-md font-semibold text-gray-700">Chapters</h3>
            <ul className="list-disc">
              {renderChapters(courseDetails.chapters)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
