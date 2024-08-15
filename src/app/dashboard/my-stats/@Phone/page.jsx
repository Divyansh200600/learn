'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { CircularProgress, LinearProgress } from '@mui/material'; // For modern progress bars

export default function PhoneMyStatsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [totalCourseProgress, setTotalCourseProgress] = useState(0);
  const [expandedChapters, setExpandedChapters] = useState({}); // Track expanded chapters

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

          // Initialize the expanded state with the first chapter expanded
          const initialExpandedChapters = courseData.chapters.reduce((acc, chapter, index) => {
            acc[chapter.chapterName] = index === 0; // Expand only the first chapter by default
            return acc;
          }, {});
          setExpandedChapters(initialExpandedChapters);
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

  const handleToggleChapter = (chapterName) => {
    setExpandedChapters((prevExpanded) => ({
      ...prevExpanded,
      [chapterName]: !prevExpanded[chapterName],
    }));
  };

  const renderVideos = (videoLinks, chapterIndex, topicIndex) => {
    if (!Array.isArray(videoLinks) || videoLinks.length === 0) return <li>No videos available</li>;

    return videoLinks.map((video, index) => {
      const videoIndex = index + 1; // Index for the video in the current topic
      const videoKey = `video-${chapterIndex}-${topicIndex}-${videoIndex}`;
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
            <div dangerouslySetInnerHTML={{ __html: video.description }} />
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
        <ul className="ml-4 list-disc">
          {renderVideos(topic.videoLinks, chapterIndex, index + 1)}
        </ul>
      </li>
    ));
  };

  const renderChapters = (chapters) => {
    if (!Array.isArray(chapters) || chapters.length === 0) return <li>No chapters available</li>;

    return chapters.map((chapter, chapterIndex) => {
      const isExpanded = expandedChapters[chapter.chapterName] || false;

      return (
        <li key={chapterIndex} className="mt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{chapter.chapterName}</h4>
            <button
              onClick={() => handleToggleChapter(chapter.chapterName)}
              className="text-blue-500 text-sm"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {isExpanded && (
            <ul className="ml-2 list-disc">
              {renderTopics(chapter.topics, chapterIndex + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-xl mb-4 font-semibold">My Stats Page</h1>
      <div className="mb-4">
        <label htmlFor="courseSelector" className="block mb-2 text-sm font-medium">Select a Course:</label>
        <select
          id="courseSelector"
          value={selectedCourseId}
          onChange={handleCourseSelection}
          className="p-2 border rounded w-full text-sm"
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
          <h2 className="text-lg font-semibold">{courseDetails.name}</h2>
          <div className="mt-4">
            <h3 className="text-md font-semibold">Total Course Progress</h3>
            <div className="flex items-center mb-4">
              <CircularProgress
                variant="determinate"
                value={totalCourseProgress}
                size={60}
                thickness={4}
              />
              <span className="ml-2 text-lg">{totalCourseProgress.toFixed(2)}%</span>
            </div>
            <h3 className="text-md font-semibold">Chapters</h3>
            <ul className="list-disc">
              {renderChapters(courseDetails.chapters)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
