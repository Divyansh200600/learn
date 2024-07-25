
import React from 'react';
import { auth } from '../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = ({ onClose, onLogin }) => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await saveUserData(user);

      // Callback to parent component to handle login state
      onLogin(user);

      onClose(); // Close the login sidebar after successful login
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Function to save user data to Firestore
  const saveUserData = async (user) => {
    const db = getFirestore(); // Assuming firestore is initialized correctly
    const userRef = doc(db, 'users', user.uid);
    
    try {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        cuid: generateCuid(), // Generate random CUID (example function)
        userId: user.uid
      });
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Example function to generate random CUID (7 digits)
  const generateCuid = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
