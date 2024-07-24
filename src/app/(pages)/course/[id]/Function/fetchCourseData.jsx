// Function to fetch course data from Firestore
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../utils/Firebase/firebaseConfig"; // Adjust the path as per your project

const fetchCourseData = async (docId) => {
  try {
    const docRef = doc(db, "courses", docId); // Reference to the specific document in the 'courses' collection
    const docSnap = await getDoc(docRef); // Fetch the document snapshot

    if (docSnap.exists()) {
      // Check if the document exists
      return docSnap.data(); // Return the document data
    } else {
      console.log("No such document!"); // Log if the document doesn't exist
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error); // Log any errors that occur
    return null; // Return null if there's an error
  }
};

export default fetchCourseData;
