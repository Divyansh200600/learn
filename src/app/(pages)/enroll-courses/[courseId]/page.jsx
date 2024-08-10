'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { FaChevronDown, FaChevronUp, FaVideo } from 'react-icons/fa';
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
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Default playback speed
  const videoRef = useRef(null);
  const router = useRouter();
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const getUserUid = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserUid(user.uid);
        } else {
          // User is signed out
          setUserUid(null);
          router.push('/login'); // Redirect to login page or any other handling
        }
      });
    };

    getUserUid();
  }, [router]);

  useEffect(() => {
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
          chapters.map(async (chapter) => {
            const topics = await Promise.all(
              chapter.topics.map(async (topic) => ({
                ...topic,
                videoLinks: topic.videoLinks || []
              }))
            );
            return {
              chapterName: chapter.chapterName,
              topics,
              id: chapter.id
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

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Error fetching course data');
        setLoading(false);
      }
    };

    if (userUid) {
      fetchCourseData();
    }
  }, [courseId, userUid]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setSelectedVideoDescription(video.description || 'No description available');
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
                className={`w-full h-64 object-cover rounded-lg shadow-lg ${selectedVideo ? 'border-2 border-blue-500' : ''}`}
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                ref={videoRef}
                autoPlay
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
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-6">
              <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                <h3 className="text-xl font-semibold text-gray-800">{chapter.chapterName}</h3>
                {expandedChapters[chapter.chapterName] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </div>
              {expandedChapters[chapter.chapterName] && (
                <div>
                  {chapter.topics.map((topic) => (
                    <div key={topic.topicName} className="mb-4">
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
                          <p className="text-sm text-gray-600">{topic.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {topic.videoLinks.map((video, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded-lg text-center cursor-pointer transition-colors duration-300 ${
                                  selectedVideo?.link === video.link
                                    ? 'bg-blue-700 text-white border-2 border-blue-500'
                                    : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                                }`}
                                onClick={() => handleVideoClick(video)}
                              >
                                {`Video ${index + 1}`}
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
