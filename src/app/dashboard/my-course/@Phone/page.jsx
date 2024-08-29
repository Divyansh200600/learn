'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const MyCourses = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userUid, setUserUid] = useState(null);

    useEffect(() => {
        const getUserUid = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchUserCourses(user.uid);
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/dashboard/profile');
                }
            });
        };
        getUserUid();
    }, [router]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, 'categories'));
                const categoryData = {};
                categoriesSnapshot.forEach((categoryDoc) => {
                    const { name, courses } = categoryDoc.data();
                    categoryData[categoryDoc.id] = { name, courses };
                });
                setCategories(categoryData);
            } catch (error) {
                console.error('Error fetching categories: ', error);
            }
        };
        fetchCategories();
    }, []);

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
            setError('Error fetching courses');
            setLoading(false);
        }
    };

    const handleCourseClick = (course) => {
        router.push(`/courses/${course.id}`);
    };

    const getCategoryForCourse = (courseId) => {
        return Object.values(categories).find((category) => category.courses && category.courses.includes(courseId));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
            <header className="flex justify-between items-center p-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
            </header>
            <main className="p-4 pb-[calc(60px+1rem)]">
                {courses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Courses Found</h2>
                        <p className="text-gray-600 mb-4">It looks like you don&apos;t have any courses yet.</p>

                        <p className="text-gray-600 mb-4">Browse our catalog and find courses that interest you!</p>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => router.push('/home')}
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    courses.map((course) => {
                        const category = getCategoryForCourse(course.id);

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 relative"
                            >
                                {category && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                        {category.name}
                                    </div>
                                )}
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
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full">
                                        {course.completionPercentage}% complete
                                    </span>
                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">{course.courseLevel}</span>
                                </div>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 w-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                                    onClick={() => handleCourseClick(course)}
                                >
                                    Start Learning
                                </button>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
};

export default MyCourses;
