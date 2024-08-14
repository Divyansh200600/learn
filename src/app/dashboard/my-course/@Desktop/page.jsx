'use client';

import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';

const DesktopMyCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const tiltRefs = useRef([]);
  const userUid = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

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
        window.scrollTo(0, 0);
      }
    };

    initializeTilt();
    return () => {
      if (tiltRefs.current) {
        tiltRefs.current.forEach((el) => {
          if (el && el.vanillaTilt) {
            el.vanillaTilt.destroy();
          }
        });
        window.scrollTo(0, 0);
      }
    };
  }, [courses]);

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
        try {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          if (!courseDoc.exists()) {
            console.warn(`Course with ID ${courseId} does not exist.`);
            return null;
          }
    
          const courseData = courseDoc.data();
          if (!courseData) {
            console.warn(`Course data is undefined for course ID ${courseId}`);
            return null;
          }
    
          const { name, description, thumbnail, chapters = [], courseLevel } = courseData;
    
          const updatedChapters = await Promise.all(
            chapters.map(async (chapter, chapterIndex) => {
              const topics = await Promise.all(
                chapter.topics.map(async (topic, topicIndex) => {
                  const videoLinks = topic.videoLinks.map((video, videoIndex) => ({
                    ...video,
                    id: `video-${chapterIndex+1}-${topicIndex+1}-${videoIndex+1}` // Ensuring ID format
                  }));
                  return {
                    ...topic,
                    videoLinks
                  };
                })
              );
              return {
                ...chapter,
                topics
              };
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
        } catch (error) {
          console.error(`Error fetching data for course ID ${courseId}: `, error);
          return null;
        }
      });
    
      const courseList = (await Promise.all(coursePromises)).filter(course => course !== null);
      setCourses(courseList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userUid.current = user.uid;
        fetchUserCourses(user.uid);
      } else {
        setCourses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCourseClick = (courseId) => {
    router.push(`/enroll-courses/${courseId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-6xl font-bold text-black mb-12 text-center">My Courses</h1>
      {courses.length === 0 ? (
       <div className="relative min-h-screen flex items-center justify-center">
       <div
         className="bg-white p-8 rounded-lg shadow-lg text-center"
         style={{ marginTop: '-10%', transform: 'translateY(-50%)' }}
       >
         <h2 className="text-3xl font-bold mb-4">No Courses Available</h2>
         <p className="text-gray-600 mb-4">It looks like you don&apos;t have any courses yet.</p>

         <p className="text-gray-600 mb-4">Browse our catalog and find courses that interest you!</p>
         <button
           className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300"
           onClick={() => router.push('/home')}
         >
           Explore Courses
         </button>
       </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const category = Object.values(categories).find((category) => category.courses && category.courses.includes(course.id));
            return (
              <div
                key={course.id}
                ref={(el) => (tiltRefs.current[index] = el)}
                className="tilt bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 relative"
                style={{ perspective: 1000 }}
              >
                <div className="relative">
                  <Image
                    src={course.thumbnail}
                    alt={course.name}
                    className="object-cover rounded-lg mb-4"
                    width={600}
                    height={400}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xl font-bold">{course.completionPercentage}% Complete</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {course.completionPercentage}% Complete
                </div>
                {category && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {category.name}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {course.courseLevel}
                </div>
                <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                <p className="text-gray-700 mb-4">{course.description}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${course.completionPercentage}%`,
                      transition: 'width 1s'
                    }}
                  ></div>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full w-full text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleCourseClick(course.id)}
                >
                  Start Learning
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DesktopMyCourses;
