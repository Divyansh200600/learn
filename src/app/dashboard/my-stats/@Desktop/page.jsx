'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust the import path as needed
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import {
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default function DesktopMyStatsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [totalCourseProgress, setTotalCourseProgress] = useState(0);
  const [showChartView, setShowChartView] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('User not authenticated');
          return;
        }

        const coursesCollectionRef = collection(db, 'users', user.uid, 'courses');
        const coursesSnapshot = await getDocs(coursesCollectionRef);
        const enrolledCourses = coursesSnapshot.docs.map(doc => doc.id);

        if (enrolledCourses.length === 0) {
          console.log('No courses available');
          return;
        }

        const coursesArray = await Promise.all(
          enrolledCourses.map(async courseId => {
            const courseSnap = await getDoc(doc(db, 'courses', courseId));
            if (courseSnap.exists()) {
              return { id: courseId, ...courseSnap.data() };
            }
            return null;
          })
        );

        setCourses(coursesArray.filter(course => course !== null));
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleCourseSelection = async e => {
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

          videoProgressSnapshot.forEach(doc => {
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
        console.log('Course not found');
        setCourseDetails(null);
        setVideoProgress({});
        setTotalCourseProgress(0);
      }
    } catch (error) {
      console.error('Error fetching course data: ', error);
    }
  };

  const renderVideos = (videoLinks, chapterIndex, topicIndex) => {
    if (!Array.isArray(videoLinks) || videoLinks.length === 0) return <li>No videos available</li>;

    return videoLinks.map((video, index) => {
      const videoIndex = index + 1;
      const videoKey = `video-${chapterIndex}-${topicIndex}-${videoIndex}`;
      const progress = videoProgress[videoKey] || 0;

      return (
        <li key={videoKey} className="mb-4">
          <div className="font-semibold text-gray-800">Video {videoIndex}</div>
          <div className="flex items-center mt-2">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="w-full"
              sx={{ height: '8px', borderRadius: '4px' }}
            />
            <span className="ml-2 text-gray-700">{progress.toFixed(2)}%</span>
          </div>
        </li>
      );
    });
  };

  const renderTopics = (topics, chapterIndex) => {
    if (!Array.isArray(topics) || topics.length === 0) return <li>No topics available</li>;

    return topics.map((topic, topicIndex) => (
      <li key={topicIndex} className="mt-2">
        <strong className="text-gray-800">{topic.topicName}</strong>
        <ul className="ml-6 list-disc">{renderVideos(topic.videoLinks, chapterIndex, topicIndex + 1)}</ul>
      </li>
    ));
  };

  const renderChapters = chapters => {
    if (!Array.isArray(chapters) || chapters.length === 0) return <li>No chapters available</li>;

    return chapters.map((chapter, chapterIndex) => (
      <Accordion key={chapterIndex} defaultExpanded={chapterIndex === 0} sx={{ marginBottom: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
          <Typography className="text-lg font-semibold">{chapter.chapterName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="ml-4 list-disc">{renderTopics(chapter.topics, chapterIndex + 1)}</ul>
        </AccordionDetails>
      </Accordion>
    ));
  };

  const renderCharts = () => {
    if (!courseDetails || !courseDetails.chapters) return null;
  
    return (
      <div className="mt-4">
        {courseDetails.chapters.map((chapter, chapterIndex) => {
          // Calculate the total progress for each chapter
          const totalChapterProgress = chapter.topics.reduce((chapterProgress, topic, topicIndex) => {
            const topicProgress = topic.videoLinks.reduce((videoProgress, video, videoIndex) => {
              const videoKey = `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`;
              return videoProgress + (videoProgress[videoKey] || 0);
            }, 0);
  
            return chapterProgress + topicProgress;
          }, 0);
  
          // Calculate total number of videos in the chapter
          const totalChapterVideos = chapter.topics.reduce((count, topic) => count + (topic.videoLinks ? topic.videoLinks.length : 0), 0);
          const chapterProgressPercentage = totalChapterVideos > 0 ? totalChapterProgress / totalChapterVideos : 0;
  
          // Bar chart data
          const barData = {
            labels: chapter.topics.map(topic => topic.topicName),
            datasets: [
              {
                label: 'Chapter Progress',
                data: chapter.topics.map((topic, topicIndex) => {
                  return topic.videoLinks.reduce((topicProgress, video, videoIndex) => {
                    const videoKey = `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`;
                    return topicProgress + (videoProgress[videoKey] || 0);
                  }, 0);
                }),
                backgroundColor: '#4caf50',
              },
            ],
          };
  
          // Pie chart data
          const pieData = {
            labels: chapter.topics.map(topic => topic.topicName),
            datasets: [
              {
                label: 'Topic Distribution',
                data: chapter.topics.map((topic, topicIndex) => {
                  return topic.videoLinks.reduce((topicProgress, video, videoIndex) => {
                    const videoKey = `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`;
                    return topicProgress + (videoProgress[videoKey] || 0);
                  }, 0);
                }),
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
              },
            ],
          };
  
          return (
            <div key={chapterIndex} className="mb-6">
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader title={chapter.chapterName} sx={{ backgroundColor: '#f5f5f5' }} />
                <CardContent>
                  <div className="mb-4">
                    <Typography variant="h6" className="text-gray-800 mb-2">
                      Chapter Progress (Bar Chart)
                    </Typography>
                    <div className="h-[250px]">
                      <Bar data={barData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                  <div>
                    <Typography variant="h6" className="text-gray-800 mb-2">
                      Topic Distribution (Pie Chart)
                    </Typography>
                    <div className="h-[250px]">
                      <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };
  

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 via-teal-100 to-green-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Stats Page</h1>
      <div className="mb-6">
        <label htmlFor="courseSelector" className="block mb-2 text-gray-700">
          Select a Course:
        </label>
        <Select
          id="courseSelector"
          value={selectedCourseId}
          onChange={handleCourseSelection}
          className="p-3 border border-gray-300 rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <MenuItem value="" disabled>
            Select a course
          </MenuItem>
          {courses.length > 0 ? (
            courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No courses available
            </MenuItem>
          )}
        </Select>
      </div>
      {courseDetails && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex-grow">{courseDetails.name}</h2>
            <Button variant="contained" color="primary" onClick={() => setShowChartView(!showChartView)} sx={{ marginLeft: 2 }}>
              {showChartView ? 'Show Details View' : 'Show Chart View'}
            </Button>
          </div>
          <div className="flex items-center mb-6">
            <CircularProgress
              variant="determinate"
              value={totalCourseProgress}
              size={90}
              thickness={5}
              sx={{ color: '#4caf50' }}
            />
            <span className="ml-4 text-xl text-gray-800">{totalCourseProgress.toFixed(2)}%</span>
          </div>
          {showChartView ? renderCharts() : renderChapters(courseDetails.chapters)}
        </motion.div>
      )}
    </div>
  );
}
