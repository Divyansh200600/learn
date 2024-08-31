'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { CircularProgress, LinearProgress, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Card, CardContent, CardHeader } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BellIcon } from '@heroicons/react/outline';

import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import Notifications from '@/app/dashboard/notification/notifications';

// Registering necessary Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PhoneMyStatsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [totalCourseProgress, setTotalCourseProgress] = useState(0);
  const [showChartView, setShowChartView] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };


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
      const videoIndex = index + 1;
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


const renderCharts = () => {
  if (!courseDetails || !courseDetails.chapters) return null;

  return (
      <div className="mt-4 max-h-[400px] overflow-y-auto"> {/* Set a max height and allow scrolling */}
          {courseDetails.chapters.map((chapter, chapterIndex) => {
              const totalChapterProgress = chapter.topics.reduce((chapterProgress, topic, topicIndex) => {
                  const topicProgress = topic.videoLinks.reduce((videoProgress, video, videoIndex) => {
                      const videoKey = `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`;
                      return videoProgress + (videoProgress[videoKey] || 0);
                  }, 0);

                  return chapterProgress + topicProgress;
              }, 0);

              const totalChapterVideos = chapter.topics.reduce((count, topic) => count + (topic.videoLinks ? topic.videoLinks.length : 0), 0);
              const chapterProgressPercentage = totalChapterVideos > 0 ? totalChapterProgress / totalChapterVideos : 0;

              const data = {
                  labels: chapter.topics.map((topic) => topic.topicName),
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

              return (
                  <Card key={chapterIndex} className="mb-4">
                      <CardContent>
                          <Typography variant="h6" className="text-gray-800 mb-2">{chapter.chapterName}</Typography>
                          <div className="h-[250px]">
                              <Bar data={data} options={{ maintainAspectRatio: false }} />
                          </div> {/* Fixed height for each chart */}
                      </CardContent>
                  </Card>
              );
          })}
      </div>
  );
};

return (
  <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 min-h-screen pb-[calc(60px+1rem)]">
        <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">My Stats</h1>
        <button onClick={handleBellClick} className="focus:outline-none">
          <BellIcon className="w-6 h-6 text-blue-600" />
        </button>
      </header>
      
      <Card className="mb-4">
        
          <CardContent>
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
          </CardContent>
      </Card>

      {courseDetails && (
          <Card className="mb-4">
              <CardHeader title={courseDetails.name} className="text-lg font-bold text-gray-800" />
              <CardContent>
                  <div className="mt-4 flex items-center">
                      <div className="mr-4">
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
                      </div>
                      <Button
                          variant="contained"
                          startIcon={showChartView ? <BarChartIcon /> : <PieChartIcon />}
                          onClick={() => setShowChartView(!showChartView)}
                          sx={{ height: 'fit-content' }}
                      >
                          {showChartView ? 'Normal View' : 'Show Charts'}
                      </Button>
                  </div>
                  {showChartView ? (
                      <>
                          <div className="mt-4">
                              <h3 className="text-md font-semibold text-gray-700">Total Course Progress (Pie Chart)</h3>
                              <div className="h-[250px]">
                                  <Pie
                                      data={{
                                          labels: ['Progress', 'Remaining'],
                                          datasets: [
                                              {
                                                  data: [totalCourseProgress, 100 - totalCourseProgress],
                                                  backgroundColor: ['#4caf50', '#e0e0e0'],
                                              },
                                          ],
                                      }}
                                      options={{ maintainAspectRatio: false }}
                                  />
                              </div>
                          </div>
                          <div className="mt-4">
                              <h3 className="text-md font-semibold text-gray-700">Chapters Progress (Bar Charts)</h3>
                              {renderCharts()}
                          </div>
                      </>
                  ) : (
                      <>
                          <h3 className="text-md font-semibold text-gray-700">Chapters</h3>
                          <ul className="list-disc">
                              {renderChapters(courseDetails.chapters)}
                          </ul>
                      </>
                  )}
              </CardContent>
          </Card>
      )}

<Notifications
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
       
      />
  </div>
);
}

