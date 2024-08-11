'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const videoRef = useRef(null);
  const router = useRouter();
  const [userUid, setUserUid] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]); // Track completed videos
  const [videoProgress, setVideoProgress] = useState({}); // Track video progress
  const [autoPlay, setAutoPlay] = useState(false); // New autoPlay flag

  useEffect(() => {
    const getUserUid = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserUid(user.uid);
        } else {
          setUserUid(null);
          router.push('/login');
        }
      });
    };
    getUserUid();
  }, [router]);

  const fetchCourseData = async () => {
    if (!courseId || !userUid) {
      setError('Course ID or User ID is missing');
      setLoading(false);
      return;
    }

    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        setError('Course not found');
        setLoading(false);
        return;
      }

      const courseData = courseDoc.data();
      const { name, description, thumbnail, chapters = [], courseLevel } = courseData;

      const updatedChapters = await Promise.all(
        chapters.map(async (chapter, chapterIndex) => {
          const topics = await Promise.all(
            chapter.topics.map(async (topic, topicIndex) => ({
              ...topic,
              id: `topic-${chapterIndex + 1}-${topicIndex + 1}`, // Assign a unique identifier to each topic
              videoLinks: (topic.videoLinks || []).map((video, videoIndex) => ({
                ...video,
                id: `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}` // Assign a unique identifier to each video
              }))
            }))
          );
          return {
            chapterName: chapter.chapterName,
            topics,
            id: `chapter-${chapterIndex + 1}`
          };
        })
      );

      setCourse({
        id: courseDoc.id,
        name: name || 'Unnamed Course',
        description: description || 'No description available',
        thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
        chapters: updatedChapters,
        courseLevel: courseLevel || 'Not Specified'
      });

      await fetchVideoProgress(); // Fetch video progress and completed videos

      setLoading(false);
    } catch (error) {
      setError('Error fetching course data');
      setLoading(false);
    }
  };

  const fetchVideoProgress = async () => {
    try {
      const videoProgressCollection = collection(db, 'users', userUid, 'courses', courseId, 'videoProgress');
      const videoProgressSnapshot = await getDocs(videoProgressCollection);
      const progressData = {};
      const completedVideosList = videoProgressSnapshot.docs
        .filter((doc) => doc.data().fullWatched)
        .map((doc) => {
          progressData[doc.id] = doc.data().progress;
          return doc.id;
        });
      setCompletedVideos(completedVideosList);
      setVideoProgress(progressData);

      // Fetch the last watched video URL
      const lastWatchedDoc = await getDoc(doc(collection(db, 'users', userUid, 'courses', courseId, 'videoProgress'), 'lastWatched'));
      if (lastWatchedDoc.exists()) {
        const lastWatchedUrl = lastWatchedDoc.data().watched;
        const lastWatchedVideo = findVideoByUrl(lastWatchedUrl);
        if (lastWatchedVideo) {
          setSelectedVideo(lastWatchedVideo);
          setSelectedVideoDescription(lastWatchedVideo.description || 'No description available');
          expandRelevantChaptersAndTopics(lastWatchedVideo.id);
          setAutoPlay(true);  // Set autoPlay to true when last watched video is found
        }
      }
    } catch (error) {
      console.error('Error fetching video progress:', error);
    }
  };

  useEffect(() => {
    if (userUid) {
      fetchCourseData();
    }
  }, [courseId, userUid]);

  const findVideoById = (videoId) => {
    for (const chapter of course?.chapters || []) {
      for (const topic of chapter.topics || []) {
        for (const video of topic.videoLinks || []) {
          if (video.id === videoId) {
            return video;
          }
        }
      }
    }
    return null;
  };

  const findVideoByUrl = (url) => {
    for (const chapter of course?.chapters || []) {
      for (const topic of chapter.topics || []) {
        for (const video of topic.videoLinks || []) {
          if (video.link === url) {
            return video;
          }
        }
      }
    }
    return null;
  };

  const expandRelevantChaptersAndTopics = (videoId) => {
    for (const chapter of course?.chapters || []) {
      for (const topic of chapter.topics || []) {
        for (const video of topic.videoLinks || []) {
          if (video.id === videoId) {
            setExpandedChapters((prev) => ({ ...prev, [chapter.chapterName]: true }));
            setExpandedTopics((prev) => ({ ...prev, [`${chapter.chapterName}-${topic.topicName}`]: true }));
          }
        }
      }
    }
  };

  const handleVideoClick = async (video) => {
    if (!video.id) {
      return;
    }
    if (!canWatch(video)) {
      return;
    }
    setSelectedVideo(video);
    setSelectedVideoDescription(video.description || 'No description available');

    // Update the last watched video URL
    const lastWatchedRef = doc(collection(db, 'users', userUid, 'courses', courseId, 'videoProgress'), 'lastWatched');
    await setDoc(lastWatchedRef, { watched: video.link }, { merge: true });
  };

  const toggleChapter = (chapterName) => {
    setExpandedChapters((prevState) => ({
      ...prevState,
      [chapterName]: !prevState[chapterName]
    }));
  };

  const toggleTopic = (chapterName, topicName) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [`${chapterName}-${topicName}`]: !prevState[`${chapterName}-${topicName}`]
    }));
  };

  const handleBackToCourses = () => {
    router.push(`/dashboard/my-course`);
  };

  const handlePlaybackSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const saveVideoProgress = async (video, progress, fullWatched) => {
    if (!video || !video.id) {
      return;
    }

    // Always update progress to 100% if video is fully watched, even if it's watched again
    if (completedVideos.includes(video.id)) {
      fullWatched = true;
      progress = 100;
    } else if (fullWatched) {
      progress = 100;
    }

    const videoProgressRef = doc(db, 'users', userUid, 'courses', courseId, 'videoProgress', video.id);
    await setDoc(videoProgressRef, {
      progress,
      fullWatched: progress === 100,
      updatedAt: new Date()
    }, { merge: true });

    if (progress === 100) {
      setCompletedVideos((prev) => [...prev, video.id]); // Update completed videos state
    }

    setVideoProgress((prev) => ({
      ...prev,
      [video.id]: progress
    }));
  };

  const handleVideoPause = () => {
    if (videoRef.current && selectedVideo) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      saveVideoProgress(selectedVideo, progress, progress === 100);
    }
  };

  const handleVideoEnded = () => {
    saveVideoProgress(selectedVideo, 100, true);
    const nextVideo = getNextVideo();
    if (nextVideo) {
      setSelectedVideo(nextVideo);
      setSelectedVideoDescription(nextVideo.description || 'No description available');
      updateLastWatchedVideo(nextVideo.link); // Update the last watched video URL when changing videos
    }
  };

  const updateLastWatchedVideo = async (url) => {
    try {
      const lastWatchedRef = doc(collection(db, 'users', userUid, 'courses', courseId, 'videoProgress'), 'lastWatched');
      await setDoc(lastWatchedRef, { watched: url }, { merge: true });
    } catch (error) {
      console.error('Error updating last watched video:', error);
    }
  };

  const getNextVideo = () => {
    let foundCurrent = false;
    for (const chapter of course.chapters) {
      for (const topic of chapter.topics) {
        for (const video of topic.videoLinks) {
          if (foundCurrent) {
            return video;
          }
          if (selectedVideo && video.link === selectedVideo.link) {
            foundCurrent = true;
          }
        }
      }
    }
    return null;
  };

  const canWatch = (video) => {
    if (completedVideos.includes(video.id)) {
      return true;
    }

    // Ensure the first video of the first chapter and first topic is unlocked
    if (course && course.chapters.length > 0) {
      const firstChapter = course.chapters[0];
      if (firstChapter.topics.length > 0) {
        const firstTopic = firstChapter.topics[0];
        if (firstTopic.videoLinks.length > 0) {
          const firstVideo = firstTopic.videoLinks[0];
          if (video.id === firstVideo.id) {
            return true;
          }
        }
      }
    }

    let previousVideo = null;

    for (const chapter of course.chapters) {
      for (const topic of chapter.topics) {
        for (const item of topic.videoLinks) {
          if (item.id === video.id) {
            // Previous video is completed
            return previousVideo === null || completedVideos.includes(previousVideo.id);
          }
          previousVideo = item;
        }
      }
    }
    return false;
  };

  const handleLoadedData = () => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play();
      setAutoPlay(false); // Reset autoPlay flag
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>No course data available</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={handleBackToCourses}>
        Back to My Courses
      </button>
      <div className="flex space-x-4 mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{course.name}</h2>
      </div>
      <div className="flex space-x-6">
        <div className="w-2/3 p-4 rounded-lg shadow-lg relative bg-white">
          {selectedVideo ? (
            <>
              <video
                key={selectedVideo.link}
                src={selectedVideo.link}
                controls
                className={`w-full h-96 object-cover rounded-lg shadow-lg ${selectedVideo ? 'border-2 border-blue-500' : ''}`}
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                ref={videoRef}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onLoadedData={handleLoadedData} // Handle loaded data event
              >
                Your browser does not support the video tag.
              </video>

              <div className="flex items-center mt-4 space-x-2">
                {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                  <button
                    key={speed}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      playbackSpeed === speed
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white'
                    }`}
                    onClick={() => handlePlaybackSpeedChange(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <h1 className="font-bold text-2xl mt-4 text-gray-800">Description</h1>
              {selectedVideoDescription && (
                <div
                  style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px', backgroundColor: '#f9f9f9' }}
                  dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a video to play</p>
          )}
        </div>
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg overflow-auto h-[calc(100vh-4rem)]">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-6">
              <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                <h3 className="text-xl font-semibold text-gray-800">{chapter.chapterName}</h3>
                {expandedChapters[chapter.chapterName] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </div>
              {expandedChapters[chapter.chapterName] && (
                <div>
                  {chapter.topics.map((topic) => (
                    <div key={topic.id} className="mb-4">
                      <div
                        className={`flex justify-between items-center p-2 ${expandedTopics[`${chapter.chapterName}-${topic.topicName}`] ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'} rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300`}
                        onClick={() => toggleTopic(chapter.chapterName, topic.topicName)}
                      >
                        <div className="flex items-center space-x-2">
                          <FaVideo className="text-blue-400" />
                          <h4 className="text-lg font-semibold">{topic.topicName}</h4>
                        </div>
                        <span>{topic.videoLinks.length} videos</span>
                        {expandedTopics[`${chapter.chapterName}-${topic.topicName}`] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                      </div>
                      {expandedTopics[`${chapter.chapterName}-${topic.topicName}`] && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{topic.topicDescription}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {topic.videoLinks.map((video, index) => (
                              <div
                                key={video.id}
                                className={`p-2 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
                                  selectedVideo?.link === video.link
                                    ? 'bg-blue-700 text-white border-2 border-blue-500'
                                    : !canWatch(video) && (chapter.id !== 'chapter-1' || topic.id !== 'topic-1' || index !== 0) // Ensure the first video of first chapter and topic is unlocked
                                    ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                                }`}
                                onClick={() => handleVideoClick(video)}
                              >
                                {`Video ${index + 1}`}
                                {completedVideos.includes(video.id) && <FaCheck className="ml-2 text-green-500" />} {/* Show tick mark when video is fully watched */}
                                {!canWatch(video) && (index !== 0 || chapter.id !== 'chapter-1' || topic.id !== 'topic-1') && <FaLock className="ml-2 text-red-500" />} {/* Show lock icon when video is locked, except for the first video of first chapter and topic */}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;