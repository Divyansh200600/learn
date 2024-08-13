'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const MyCourses = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
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
                    router.push('/login');
                }
            });
        };
        getUserUid();
    }, [router]);

    const fetchUserCourses = async (uid) => {
        try {
            const userCoursesRef = collection(db, 'users', uid, 'courses');
            const userCoursesSnapshot = await getDocs(userCoursesRef);
            const courseIds = userCoursesSnapshot.docs.map((doc) => doc.id);

            const coursePromises = courseIds.map(async (courseId) => {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                const courseData = courseDoc.data();
                const { name, description, thumbnail, chapters, courseLevel } = courseData;

                return {
                    id: courseDoc.id,
                    name,
                    description,
                    thumbnail,
                    chapters,
                    courseLevel,
                };
            });

            setCourses(await Promise.all(coursePromises));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses: ', error);
            setLoading(false);
        }
    };

    const handleCourseClick = (course) => {
        router.push(`/courses/${course.id}`);
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
            <main className="p-4 space-y-4">
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
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full">{course.completionPercentage?.toFixed(0)}% complete</span>
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
};

export default MyCourses;