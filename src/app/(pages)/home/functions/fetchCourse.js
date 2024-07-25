import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust import path as per your project structure

export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categoriesList = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const courses = await fetchCourses(doc.id);
      return {
        id: doc.id,
        name: doc.data().name,
        courses
      };
    }));
    return categoriesList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCourses = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      console.error('Category document not found');
      return [];
    }

    const courses = categoryDoc.data().courses || [];
    const detailedCourses = await Promise.all(courses.map(async (courseId) => {
      const courseRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        return {
          id: courseDoc.id,
          ...courseDoc.data()
        };
      } else {
        console.error(`Course document ${courseId} not found`);
        return null;
      }
    }));

    return detailedCourses.filter(course => course !== null);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
