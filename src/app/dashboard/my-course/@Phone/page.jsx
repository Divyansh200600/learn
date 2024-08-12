'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PhoneMyCourses = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [userUid, setUserUid] = useState(null);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [videoProgress, setVideoProgress] = useState({});
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const videoRef = useRef(null);

    useEffect(() => {
        const getUserUid = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchUserCourses(user.uid);
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/login');
                }
            });
        };
        getUserUid();
    }, [router]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    const fetchUserCourses = async (uid) => {
        try {
            const userCoursesRef = collection(db, 'users', uid, 'courses');
            const userCoursesSnapshot = await getDocs(userCoursesRef);
            const courseIds = userCoursesSnapshot.docs.map((doc) => doc.id);

            const coursePromises = courseIds.map(async (courseId) => {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (!courseDoc.exists()) {
                    console.warn(`Course with ID ${courseId} does not exist.`);
                    return null;
                }

                const courseData = courseDoc.data();
                const { name, description, thumbnail, chapters = [], courseLevel } = courseData;

                const updatedChapters = await Promise.all(
                    chapters.map(async (chapter, chapterIndex) => {
                        const topics = await Promise.all(
                            chapter.topics.map(async (topic, topicIndex) => ({
                                ...topic,
                                id: `topic-${chapterIndex + 1}-${topicIndex + 1}`,
                                videoLinks: (topic.videoLinks || []).map((video, videoIndex) => ({
                                    ...video,
                                    id: `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`,
                                }))
                            }))
                        );
                        return { ...chapter, topics };
                    })
                );

                const videoProgressSnapshot = await getDocs(collection(db, 'users', uid, 'courses', courseId, 'videoProgress'));
                const videoProgress = {};
                videoProgressSnapshot.forEach((videoDoc) => {
                    const data = videoDoc.data();
                    if (data) {
                        videoProgress[videoDoc.id] = data.progress;  // Store progress by video ID
                    }
                });

                let totalVideos = 0;
                let totalProgress = 0;
                updatedChapters.forEach((chapter) => {
                    chapter.topics.forEach((topic) => {
                        topic.videoLinks.forEach((video) => {
                            if (video.id) {
                                totalVideos += 1;
                                const progress = videoProgress[video.id] !== undefined ? videoProgress[video.id] : 0;
                                totalProgress += progress;
                            } else {
                                console.warn(`Undefined Video ID in course ID ${courseId}`);
                            }
                        });
                    });
                });

                const completionPercentage = totalVideos > 0 ? Math.round(totalProgress / totalVideos) : 0;

                return {
                    id: courseDoc.id,
                    name: name || 'Unnamed Course',
                    description: description || 'No description available',
                    thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
                    chapters: updatedChapters,
                    courseLevel: courseLevel || 'Not Specified',
                    completionPercentage
                };
            });

            const courseList = (await Promise.all(coursePromises)).filter(course => course !== null);
            setCourses(courseList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses: ', error);
            setLoading(false);
        }
    };

    const fetchCourseData = async (courseId) => {
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
                            id: `topic-${chapterIndex + 1}-${topicIndex + 1}`,
                            videoLinks: (topic.videoLinks || []).map((video, videoIndex) => ({
                                ...video,
                                id: `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`,
                            }))
                        }))
                    );
                    return {
                        chapterName: chapter.chapterName,
                        topics,
                        id: `chapter-${chapterIndex + 1}`,
                    };
                })
            );

            const videoProgressSnapshot = await getDocs(collection(db, 'users', userUid, 'courses', courseId, 'videoProgress'));
            const videoProgress = {};
            videoProgressSnapshot.forEach((videoDoc) => {
                const data = videoDoc.data();
                if (data) {
                    videoProgress[videoDoc.id] = data.progress;  // Store progress by video ID
                }
            });

            let totalVideos = 0;
            let totalProgress = 0;
            updatedChapters.forEach((chapter) => {
                chapter.topics.forEach((topic) => {
                    topic.videoLinks.forEach((video) => {
                        if (video.id) {
                            totalVideos += 1;
                            const progress = videoProgress[video.id] !== undefined ? videoProgress[video.id] : 0;
                            totalProgress += progress;
                        } else {
                            console.warn(`Undefined Video ID in course ID ${courseId}`);
                        }
                    });
                });
            });

            const completionPercentage = totalVideos > 0 ? Math.round(totalProgress / totalVideos) : 0;

            setSelectedCourse({
                id: courseDoc.id,
                name: name || 'Unnamed Course',
                description: description || 'No description available',
                thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
                chapters: updatedChapters,
                courseLevel: courseLevel || 'Not Specified',
                completionPercentage
            });

            await fetchVideoProgress(courseId);
            setLoading(false);
        } catch (error) {
            setError('Error fetching course data');
            setLoading(false);
        }
    };

    const fetchVideoProgress = async (courseId) => {
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

            const lastWatchedDoc = await getDoc(doc(collection(db, 'users', userUid, 'courses', courseId, 'videoProgress'), 'lastWatched'));
            if (lastWatchedDoc.exists()) {
                const lastWatchedUrl = lastWatchedDoc.data().watched;
                const lastWatchedVideo = findVideoByUrl(lastWatchedUrl);
                if (lastWatchedVideo) {
                    setSelectedVideo(lastWatchedVideo);
                    setSelectedVideoDescription(lastWatchedVideo.description || 'No description available');
                    expandRelevantChaptersAndTopics(lastWatchedVideo.id);
                }
            }
        } catch (error) {
            console.error('Error fetching video progress:', error);
        }
    };

    const findVideoByUrl = (url) => {
        for (const chapter of selectedCourse?.chapters || []) {
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
        for (const chapter of selectedCourse?.chapters || []) {
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

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setSelectedVideo(null);
        setSelectedVideoDescription(null);
        fetchCourseData(course.id);
    };

    const handleVideoClick = async (video) => {
        if (!canWatch(video)) {
            return;
        }
        setSelectedVideo(video);
        setSelectedVideoDescription(video.description || 'No description available');

        const lastWatchedRef = doc(collection(db, 'users', userUid, 'courses', selectedCourse.id, 'videoProgress'), 'lastWatched');
        await setDoc(lastWatchedRef, { watched: video.link }, { merge: true });
    };

    const toggleChapter = (chapterName) => {
        setExpandedChapters((prevState) => ({
            ...prevState,
            [chapterName]: !prevState[chapterName],
        }));
    };

    const toggleTopic = (chapterName, topicName) => {
        setExpandedTopics((prevState) => ({
            ...prevState,
            [`${chapterName}-${topicName}`]: !prevState[`${chapterName}-${topicName}`],
        }));
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

        const videoProgressRef = doc(db, 'users', userUid, 'courses', selectedCourse.id, 'videoProgress', video.id);
        await setDoc(videoProgressRef, {
            progress,
            fullWatched: progress === 100,
            updatedAt: new Date(),
        }, { merge: true });

        if (progress === 100) {
            setCompletedVideos((prev) => [...prev, video.id]);
        }

        setVideoProgress((prev) => ({
            ...prev,
            [video.id]: progress,
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
            updateLastWatchedVideo(nextVideo.link);
        }
    };

    const updateLastWatchedVideo = async (url) => {
        try {
            const lastWatchedRef = doc(collection(db, 'users', userUid, 'courses', selectedCourse.id, 'videoProgress'), 'lastWatched');
            await setDoc(lastWatchedRef, { watched: url }, { merge: true });
        } catch (error) {
            console.error('Error updating last watched video:', error);
        }
    };

    const getNextVideo = () => {
        let foundCurrent = false;
        for (const chapter of selectedCourse.chapters) {
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

        const firstVideo = selectedCourse.chapters[0].topics[0].videoLinks[0];
        if (video.id === firstVideo.id) {
            return true;
        }

        let previousVideo = null;
        for (const chapter of selectedCourse.chapters) {
            for (const topic of chapter.topics) {
                for (const item of topic.videoLinks) {
                    if (item.id === video.id) {
                        return previousVideo === null || completedVideos.includes(previousVideo.id);
                    }
                    previousVideo = item;
                }
            }
        }
        return false;
    };

    const handleVideoLoaded = () => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    };
    
    const handlePlaybackSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!selectedCourse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
                <header className="flex justify-between items-center p-4 bg-white shadow">
                    <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
                </header>

                <main className="p-4 pb-[calc(60px+1rem)]">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 relative"
                        >
                            <Image
                                src={course.thumbnail}
                                alt={course.name}
                                width={200}
                                height={120}
                                className="w-full h-33 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-xl font-semibold text-blue-600">{course.name}</h2>
                            <p className="text-gray-700 text-center">{course.description}</p>
                            <div className="flex justify-between w-full text-xs mt-2">
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full">{course.completionPercentage || 0}% complete</span>
                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">{course.courseLevel}</span>
                            </div>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 w-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                                onClick={() => handleCourseClick(course)}
                            >
                                Start Learning
                            </button>
                        </div>
                    ))}
                </main>
            </div>
        );
    }

    if (selectedVideo) {
        return (
            <div className="min-h-screen bg-gray-200 p-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                    onClick={() => {
                        setSelectedVideo(null);
                        setSelectedVideoDescription(null);
                    }}
                >
                    Back to Video Selector
                </button>
                <div>
                    {selectedVideo && (
                        <video
                            ref={videoRef}
                            key={selectedVideo.link}
                            src={selectedVideo.link}
                            controls
                            className="w-full h-64 object-cover rounded-lg shadow-lg"
                            onLoadedMetadata={handleVideoLoaded}
                            onPlay={() => {
                                if (videoRef.current) {
                                    videoRef.current.playbackRate = playbackSpeed;
                                }
                            }}
                            onPause={handleVideoPause}
                            onEnded={handleVideoEnded}
                            autoPlay
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <h1 className="font-bold text-2xl mt-4 text-black">Description</h1>
                    {selectedVideoDescription && (
                        <div
                            className="border border-gray-300 p-2 mt-2 bg-gray-50"
                            dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                        />
                    )}
                    <div className="flex items-center mt-4 space-x-2">
                        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                            <button
                                key={speed}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${playbackSpeed === speed
                                        ? 'bg-blue-500 text-white font-semibold'
                                        : 'bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white'
                                    }`}
                                onClick={() => handlePlaybackSpeedChange(speed)}
                            >
                                {speed}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={() => setSelectedCourse(null)}>
                Back to My Courses
            </button>
            <div className="flex flex-col space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 text-center">{selectedCourse.name}</h2>
                <div className="flex flex-col space-y-4">
                    {selectedCourse.chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white p-4 rounded-lg shadow-lg">
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
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {topic.videoLinks.map((video) => (
                                                            <div
                                                                key={video.id}
                                                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${selectedVideo?.link === video.link
                                                                        ? 'bg-blue-700 text-white border-2 border-blue-500'
                                                                        : !canWatch(video)
                                                                            ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                                                                            : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                                                                    }`}
                                                                onClick={() => handleVideoClick(video)}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <h5 className="text-md font-semibold">Video</h5>
                                                                    {completedVideos.includes(video.id) && <FaCheck className="ml-2 text-green-500" />}
                                                                    {!canWatch(video) && <FaLock className="ml-2 text-red-500" />}
                                                                </div>
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

export default PhoneMyCourses;