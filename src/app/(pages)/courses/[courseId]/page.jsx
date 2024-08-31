'use client';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../../utils/Firebase/firebaseConfig';
import { useRouter, useParams } from 'next/navigation';
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';
import Duration from '../../../../components/duration/page';
import ChapterCompletionPopup from '../../../../components/celebrate Pop up/pop'; // Ensure you import this component
import axios from 'axios';

const VideoSelector = () => {
    const { courseId } = useParams();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [userUid, setUserUid] = useState(null);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [celebratedChapters, setCelebratedChapters] = useState([]);
    const [showCompletionPopup, setShowCompletionPopup] = useState(false);
    const [completedChapter, setCompletedChapter] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!courseId) {
            setError('Course ID is not available');
            setLoading(false);
            return;
        }

        const getUserUid = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchCourseData(courseId, user.uid);
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/dashboard/profile');
                }
            });
        };
        getUserUid();
    }, [courseId, router]);

    useEffect(() => {
        const fetchChapterCompletionStatus = async () => {
            if (!userUid || !courseId) return;

            try {
                const snapshot = await getDocs(collection(db, 'users', userUid, 'courses', courseId, 'chapterCompletion'));
                const completed = snapshot.docs.map(doc => doc.id);
                const popupShown = snapshot.docs.filter(doc => doc.data().popupShown).map(doc => doc.id);
                setCelebratedChapters(popupShown);
            } catch (error) {
                console.error('Error fetching chapter completion status:', error);
            }
        };

        fetchChapterCompletionStatus();
    }, [userUid, courseId]);

    const handleChapterCompletion = async (chapter) => {
        if (!userUid || !courseId) return;

        // Check if the chapter has already been celebrated
        if (!celebratedChapters.includes(chapter.id)) {
            setShowCompletionPopup(true);
            setCompletedChapter(chapter);

            // Save chapter completion data to Firestore
            const chapterCompletionRef = doc(db, 'users', userUid, 'courses', courseId, 'chapterCompletion', chapter.id);
            await setDoc(chapterCompletionRef, { completed: true, popupShown: false }, { merge: true });

            // Update local state to track that the popup has not been shown
            setCelebratedChapters(prev => [...prev, chapter.id]);
        }
    };

    const checkAndHandleChapterCompletion = (chapter) => {
        // Check if the chapter is completed and the popup hasn't been shown yet
        if (isChapterCompleted(chapter) && !celebratedChapters.includes(chapter.id)) {
            handleChapterCompletion(chapter);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            selectedCourse.chapters.forEach((chapter) => {
                checkAndHandleChapterCompletion(chapter);
            });
        }
    }, [selectedCourse, completedVideos, celebratedChapters]);

    const handleCelebrateAndUnlock = async () => {
        setShowCompletionPopup(false);

        if (!completedChapter) return;

        // Extract necessary data with fallback to default values
        const currentUser = auth.currentUser || {};
        const userName = currentUser.displayName || 'Anonymous';
        const userEmail = currentUser.email || 'No email';
        const courseName = selectedCourse?.name || 'Unknown Course';
        const chapterName = completedChapter?.chapterName || 'Unknown Chapter';

        // Prepare the data to be sent
        const postData = {
            userName,
            userEmail,
            courseName,
            chapterName
        };

        console.log('Data to be sent:', postData);

        try {
            // Send POST request to your endpoint
            await axios.post('https://pz-api-system.pulsezest.com/api/course-chapter-completion', postData);
        } catch (error) {
            console.error('Error sending chapter completion data:', error);
            // Optionally handle or log the network error here
        }

        try {
            // Save chapter completion data to Firestore
            const chapterCompletionRef = doc(db, 'users', userUid, 'courses', courseId, 'chapterCompletion', completedChapter.id);
            await setDoc(chapterCompletionRef, { completed: true, popupShown: true }, { merge: true });

            if (!celebratedChapters.includes(completedChapter.id)) {
                setShowCompletionPopup(true);
                setCompletedChapter(completedChapter);
            }
        } catch (error) {
            console.error('Error updating Firestore:', error);
        }
    };
    

    const fetchCourseData = async (courseId, uid) => {
        try {
            setLoading(true);
            const courseDoc = await getDoc(doc(db, 'courses', courseId));
            
            if (!courseDoc.exists()) {
                throw new Error('Course not found');
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

            setSelectedCourse({
                id: courseDoc.id,
                name: name || 'Unnamed Course',
                description: description || 'No description available',
                thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
                chapters: updatedChapters,
                courseLevel: courseLevel || 'Not Specified',
            });

            await fetchVideoProgress(courseId, uid);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching course data:', err);
            setError('Error fetching course data');
            setLoading(false);
        }
    };

    const fetchVideoProgress = async (courseId, uid) => {
        try {
            const videoProgressCollection = collection(db, 'users', uid, 'courses', courseId, 'videoProgress');
            const videoProgressSnapshot = await getDocs(videoProgressCollection);
            const progressData = {};
            const completedVideosList = videoProgressSnapshot.docs
                .filter((doc) => doc.data().fullWatched)
                .map((doc) => {
                    progressData[doc.id] = doc.data().progress;
                    return doc.id;
                });
            setCompletedVideos(completedVideosList);
        } catch (error) {
            console.error('Error fetching video progress:', error);
        }
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

    const handleVideoClick = (video) => {
        if (!canWatch(video)) {
            alert('You must complete previous videos before watching this one.');
            return;
        }

        setSelectedVideo(video);
        const videoLinks = selectedCourse.chapters.flatMap(chapter =>
            chapter.topics.flatMap(topic => topic.videoLinks)
        );
        const initialIndex = videoLinks.findIndex(v => v.id === video.id);
        
        localStorage.setItem('currentVideoIndex', initialIndex);
        localStorage.setItem('videoLinks', JSON.stringify(videoLinks));
        
        router.push(`/courses/${courseId}/video/${video.id}`);
    };

    const canWatch = (video) => {
        if (completedVideos.includes(video.id)) {
            return true;
        }

        const firstVideo = selectedCourse.chapters.flatMap(chapter =>
            chapter.topics.flatMap(topic => topic.videoLinks)
        )[0];
        
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

    const isChapterCompleted = (chapter) => {
        return chapter.topics.every(topic =>
            topic.videoLinks.every(video => completedVideos.includes(video.id))
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!selectedCourse) {
        return <div>No course data available</div>;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
             {showCompletionPopup && (
        <ChapterCompletionPopup
          onClose={() => setShowCompletionPopup(false)}
          onCelebrate={handleCelebrateAndUnlock}
          chapterName={completedChapter?.chapterName}
        />
      )}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={() => router.push('/dashboard/my-course')}>
                Back to My Courses
            </button>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedCourse.name}</h2>
                  
                  
                </div>
                <Duration courseId={courseId} />
                <div className="flex flex-col space-y-4  pb-[calc(60px+1rem)]" >
                    {selectedCourse.chapters.map((chapter) => (
                        <div key={chapter.id} className={`bg-white p-4 rounded-lg shadow-lg ${isChapterCompleted(chapter) ? 'border-4 border-green-500' : 'border-4 border-yellow-500'}`}>
                            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {chapter.chapterName} 
                                    {isChapterCompleted(chapter) ? (
                                        <span className="ml-2 text-green-500">(Completed)</span>
                                    ) : (
                                        <span className="ml-2 text-yellow-500">(Pending)</span>
                                    )}
                                </h3>
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
                                                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                                                                    selectedVideo?.id === video.id
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

export default VideoSelector;
