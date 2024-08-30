'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../../../../utils/Firebase/firebaseConfig';
import { useRouter, useParams } from 'next/navigation';
import Comment from '@/components/comment/Comment'; 
import { FaComment, FaCommentSlash } from 'react-icons/fa'; 

const VideoPlayer = () => {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [showComments, setShowComments] = useState(false);
    const [userUid, setUserUid] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [currentChapterName, setCurrentChapterName] = useState('');
    const [currentTopicName, setCurrentTopicName] = useState('');

    const router = useRouter();
    const videoRef = useRef(null);

    useEffect(() => {
        const getUserUid = () => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchVideoData();
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/dashboard/profile');
                }
            });
            return () => unsubscribe();
        };
        getUserUid();
    }, [router]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    const fetchVideoData = async () => {
        try {
            const videoLinks = JSON.parse(localStorage.getItem('videoLinks')) || [];
            const currentVideoIndex = localStorage.getItem('currentVideoIndex') || 0;

            if (videoLinks.length > 0) {
                setVideos(videoLinks);
                const video = videoLinks[currentVideoIndex];
                setSelectedVideo(video);
                setSelectedVideoDescription(video.description || 'No description available');
                await fetchCompletedVideos();
                await fetchCourseData();

                const videoId = video.id;
                if (videoId) {
                    const [chapterIndex, topicIndex] = parseVideoId(videoId);
                    setChapterAndTopicNames(chapterIndex, topicIndex);
                }
            } else {
                throw new Error('No video links found');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching video data: ', error);
            setLoading(false);
        }
    };

    const parseVideoId = (videoId) => {
        const parts = videoId.split('-');
        if (parts.length === 4 && parts[0] === 'video') {
            return parts.slice(1, 3).map(part => parseInt(part, 10));
        }
        return [0, 0];
    };

    const setChapterAndTopicNames = async (chapterIndex, topicIndex) => {
        if (!courseId) return;

        try {
            const courseRef = doc(db, 'courses', courseId);
            const courseDoc = await getDoc(courseRef);

            if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                const chapters = courseData.chapters || [];
                const chapter = chapters[chapterIndex - 1];
                if (chapter) {
                    const topic = chapter.topics?.[topicIndex - 1];
                    if (topic) {
                        setCurrentChapterName(chapter.chapterName || 'Unknown Chapter');
                        setCurrentTopicName(topic.topicName || 'Unknown Topic');
                    } else {
                        setCurrentChapterName(chapter.chapterName || 'Unknown Chapter');
                        setCurrentTopicName('Unknown Topic');
                    }
                } else {
                    setCurrentChapterName('Unknown Chapter');
                    setCurrentTopicName('Unknown Topic');
                }
            }
        } catch (error) {
            console.error('Error fetching chapter and topic names:', error);
        }
    };



    const fetchCourseData = async () => {
        if (!courseId) return;

        try {
            const courseRef = doc(db, 'courses', courseId);
            const courseDoc = await getDoc(courseRef);
            if (courseDoc.exists()) {
                setCourseName(courseDoc.data().name || 'Unknown Course');
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
        }
    };

    const fetchCompletedVideos = async () => {
        if (!userUid || !courseId) return;

        try {
            const videoProgressCollection = collection(db, 'users', userUid, 'courses', courseId, 'videoProgress');
            const videoProgressSnapshot = await getDocs(videoProgressCollection);
            const completedVideoIds = videoProgressSnapshot.docs
                .filter((doc) => doc.data().fullWatched)
                .map((doc) => doc.id);

            setCompletedVideos(completedVideoIds);
        } catch (error) {
            console.error('Error fetching video progress:', error);
        }
    };

    const handleVideoPause = () => {
        if (videoRef.current && selectedVideo) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            saveVideoProgress(selectedVideo, progress, progress === 100);
        }
    };

    const handleVideoEnded = () => {
        saveVideoProgress(selectedVideo, 100, true);
        const nextIndex = videos.findIndex(v => v.id === selectedVideo.id) + 1;

        if (videos[nextIndex]) {
            setSelectedVideo(videos[nextIndex]);
            setSelectedVideoDescription(videos[nextIndex].description || 'No description available');
            localStorage.setItem('currentVideoIndex', nextIndex);
        }
    };

    const saveVideoProgress = async (video, progress, fullWatched) => {
        if (!video || !video.id || !userUid || !courseId) return;

        try {
            const videoProgressRef = doc(db, 'users', userUid, 'courses', courseId, 'videoProgress', video.id);
            const videoProgressDoc = await getDoc(videoProgressRef);

            let currentProgress = 0;
            let wasFullyWatched = false;

            if (videoProgressDoc.exists()) {
                const data = videoProgressDoc.data();
                currentProgress = data.progress || 0;
                wasFullyWatched = data.fullWatched || false;
            }

            if (wasFullyWatched) return;

            if (completedVideos.includes(video.id)) {
                progress = 100;
                fullWatched = true;
            } else if (fullWatched) {
                progress = 100;
                setCompletedVideos((prevCompleted) => [...prevCompleted, video.id]);
            }

            await setDoc(videoProgressRef, {
                progress,
                fullWatched: progress === 100,
                updatedAt: new Date(),
            }, { merge: true });

        } catch (error) {
            console.error('Error saving video progress:', error);
        }
    };

    const handlePlaybackSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!selectedVideo) {
        return <div>No videos available</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                onClick={() => router.push(`/courses/${courseId}`)}
            >
                Back to Video Selector
            </button>
    
            {selectedVideo && (
                <div className="relative mb-4">
                    <video
                        ref={videoRef}
                        key={selectedVideo.link}
                        src={selectedVideo.link}
                        controls
                        controlsList="nodownload noplaybackspeed"    
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                        onPause={handleVideoPause}
                        onEnded={handleVideoEnded}
                        autoPlay
                    >
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-x-40 top-94 flex items-center justify-between px-4">
                        <div className="flex space-x-2">
                            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                                <button
                                    key={speed}
                                    className={`px-2 py-1 text-sm rounded-full transition-all duration-300 ${playbackSpeed === speed
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
            )}
    
            <div className= "pb-[calc(60px+1rem)] mt-4">
                <button
                    onClick={toggleComments}
                    className={`px-4 py-2 rounded-full flex items-center space-x-2 mb-4 transition-all duration-300 ${showComments
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                >
                    {showComments ? (
                        <>
                            <FaCommentSlash className="text-xl" />
                            <span>Hide Comments</span>
                        </>
                    ) : (
                        <>
                            <FaComment className="text-xl" />
                            <span>Show Comments</span>
                        </>
                    )}
                </button>
    
                {!showComments ? (
                    <>
                        <h1 className="font-bold text-2xl text-black mb-2">Description</h1>
                        {selectedVideoDescription && (
                            <div
                                className="border border-gray-300 p-2 bg-gray-50 "
                                dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                            />
                        )}
                        
                    </>
                ) : (
                    <Comment 
                        courseId={courseId} 
                        videoId={selectedVideo.id}
                        courseName={courseName}
                        chapterName={currentChapterName}
                        topicName={currentTopicName}
                    />
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
