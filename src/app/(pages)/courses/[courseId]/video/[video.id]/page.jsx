'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../../utils/Firebase/firebaseConfig';
import { useRouter, useParams } from 'next/navigation';

const VideoPlayer = () => {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const videoRef = useRef(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [userUid, setUserUid] = useState(null);

    useEffect(() => {
        const getUserUid = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchVideoData();
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/login');
                }
            });
        };
        getUserUid();
    }, [router, courseId]);

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
                setSelectedVideo(videoLinks[currentVideoIndex]);
                setSelectedVideoDescription(videoLinks[currentVideoIndex].description || 'No description available');
            } else {
                throw new Error('No video links found');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching video data: ', error);
            setLoading(false);
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
        if (!video || !video.id) {
            return;
        }

        const videoProgressRef = doc(db, 'users', userUid, 'courses', courseId, 'videoProgress', video.id);
        await setDoc(videoProgressRef, {
            progress,
            fullWatched: progress === 100,
            updatedAt: new Date(),
        }, { merge: true });
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
                <video
                    ref={videoRef}
                    key={selectedVideo.link}
                    src={selectedVideo.link}
                    controls
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
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
    );
};

export default VideoPlayer;