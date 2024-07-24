'use client';
import React, { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import Image from 'next/image';
import { db, auth } from '../../../../utils/Firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FaVideo, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PhoneMyCourses = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTopicDescription, setSelectedTopicDescription] = useState("");
    const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const tiltRefs = useRef([]);
    const videoRef = useRef(null);

    useEffect(() => {
        const initializeTilt = () => {
            if (tiltRefs.current) {
                tiltRefs.current.forEach((el) => {
                    if (el) {
                        VanillaTilt.init(el, {
                            max: 25,
                            speed: 400,
                        });
                    }
                });
            }
        };

        initializeTilt();
        // Cleanup function to destroy the tilt effect
        return () => {
            if (tiltRefs.current) {
                tiltRefs.current.forEach((el) => {
                    if (el && el.vanillaTilt) {
                        el.vanillaTilt.destroy();
                    }
                });
            }
        };
    }, [courses]);

    useEffect(() => {
        const fetchUserCourses = async (uid) => {
            try {
                const userCoursesRef = collection(db, 'users', uid, 'courses');
                const userCoursesSnapshot = await getDocs(userCoursesRef);
                const courseIds = userCoursesSnapshot.docs.map(doc => doc.id);

                const coursePromises = courseIds.map(async (courseId) => {
                    const courseDoc = await getDoc(doc(db, 'courses', courseId));
                    const courseData = courseDoc.data();
                    const { title, description, thumbnail, chapters, progress, category, level } = courseData;

                    // Fetch chapters with their video links and descriptions
                    const updatedChapters = await Promise.all(chapters.map(async (chapter) => {
                        const topics = await Promise.all(chapter.topics.map(async (topic) => {
                            return {
                                ...topic,
                                videoLinks: topic.videoLinks || [] // Ensure videoLinks is not undefined
                            };
                        }));
                        return { ...chapter, topics };
                    }));

                    return { id: courseDoc.id, title, description, thumbnail, chapters: updatedChapters, progress, category, level };
                });

                const courseList = await Promise.all(coursePromises);
                setCourses(courseList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses: ", error);
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserCourses(user.uid);
            } else {
                setCourses([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleNotificationClick = () => {
        router.push('/notifications');
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setSelectedVideo(null); // Reset selected video when selecting a new course
        setSelectedTopicDescription(""); // Reset description when selecting a new course
        setSelectedVideoDescription(null); // Reset video description
        // Expand the first chapter by default
        const firstChapterId = course.chapters[0]?.chapterName;
        setExpandedChapters({ [firstChapterId]: true });
    };

    const toggleChapter = (chapterIndex) => {
        setExpandedChapters(prevState => ({
            ...prevState,
            [chapterIndex]: !prevState[chapterIndex]
        }));
    };

    const toggleTopic = (topicName) => {
        setExpandedTopics(prevState => ({
            ...prevState,
            [topicName]: !prevState[topicName]
        }));
    };

    const handleVideoSelect = (videoLink, topicDescription) => {
        setSelectedVideo(videoLink.link); // Updated to access the link property
        setSelectedTopicDescription(topicDescription);
        setSelectedVideoDescription(videoLink.description); // Store video description
        // Scroll to the top of the page
        if (videoRef.current) {
            videoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleBackToSelector = () => {
        setSelectedVideo(null); // Reset selected video
        setSelectedTopicDescription(""); // Reset description
        setSelectedVideoDescription(null); // Reset video description
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (selectedCourse && selectedVideo) {
        return (
            <div className="min-h-screen bg-gray-200 p-8">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                    onClick={handleBackToSelector}
                >
                    Back to Video Selector
                </button>
                <div ref={videoRef} className="md:w-2/3 p-4 rounded-lg shadow-lg relative bg-white">
                    <video
                        key={selectedVideo} // Ensure re-render on video change
                        controls
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                        controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                    >
                        <source src={selectedVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <h1 className="font-bold text-2xl mt-4 text-black">Description</h1>
                    {/* Adding HTML Preview */}
                    {selectedVideoDescription && (
                        <div
                            style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}
                            dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                        />
                    )}
                </div>
            </div>
        );
    }

    if (selectedCourse) {
        return (
            <div className="min-h-screen bg-gray-200 p-8">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                    onClick={() => setSelectedCourse(null)}
                >
                    Back to My Courses
                </button>
                <div className="flex space-x-4 mb-4">
                    <h2 className="text-3xl font-bold">{selectedCourse.title}</h2>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                    {/* Topics List */}
                    <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
                        {selectedCourse.chapters.map((chapter, chapterIndex) => (
                            <div key={chapterIndex} className="mb-6">
                                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapterIndex)}>
                                    <h3 className="text-xl font-bold text-black">{chapter.chapterName}</h3>
                                    {expandedChapters[chapterIndex] ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                {(expandedChapters[chapterIndex] || chapterIndex === 0) && (
                                    <div>
                                        {chapter.topics.map((topic, topicIndex) => (
                                            <div key={topicIndex} className="mb-4">
                                                <div
                                                    className="flex justify-between items-center p-2 bg-gray-600 text-gray-300 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300"
                                                    onClick={() => toggleTopic(topic.topicName)}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <FaVideo className="text-blue-400" />
                                                        <h4 className="text-lg font-semibold flex-grow">{topic.topicName}</h4>
                                                        <span>{topic.videoLinks.length} videos</span>
                                                        {expandedTopics[topic.topicName] ? <FaChevronUp /> : <FaChevronDown />}
                                                    </div>
                                                </div>
                                                {expandedTopics[topic.topicName] && (
                                                    <div className="mt-2 space-y-2">
                                                        <p className="text-gray-700 p-2 bg-gray-100 rounded-lg">{topic.topicDescription}</p> {/* Topic description */}
                                                        {topic.videoLinks.map((videoLink, videoIndex) => (
                                                            <div 
                                                                key={videoIndex} 
                                                                className="p-2 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300"
                                                                onClick={() => handleVideoSelect(videoLink, topic.topicDescription)}
                                                            >
                                                                <h5 className="text-md font-semibold">Video {videoIndex + 1}</h5>
                                                            </div>
                                                        ))}
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
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
            <header className="flex justify-between items-center p-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
                <button
                    onClick={handleNotificationClick}
                    className="text-blue-600 font-semibold"
                >
                    Notifications
                </button>
            </header>

            <main className="p-4 space-y-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 relative"
                    >
                        <Image
                            src={course.thumbnail}
                            alt={course.title}
                            width={200}
                            height={120}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold text-blue-600">{course.title}</h2>
                        <p className="text-gray-700 text-center">{course.description}</p>
                        <div className="flex justify-between w-full text-xs mt-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full">{course.progress}% Complete</span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full">{course.category}</span>
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">{course.level}</span>
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
};

export default PhoneMyCourses;