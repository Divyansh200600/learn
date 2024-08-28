import React, { useState } from 'react';
import { auth } from '../../utils/Firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const Login = ({ onClose = () => {}, onLogin }) => {
  const [isHovered, setIsHovered] = useState(false);

  const signInWithGoogle = async () => {
    console.log("Button clicked - initiating sign-in");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

    

      await saveUserData(user);

      onLogin(user);
      onClose();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const saveUserData = async (user) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    try {
      // Log the user data to be saved
    
      // Check if the user document already exists
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Document does not exist, create or set the document
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          googlePhoto: user.photoURL || 'default_url', // Save profile photo URL, default to 'default_url' if not available
          suid: generateCuid(),
          uid: user.uid,
        });
        console.log('User data saved successfully');
      } else {
        console.log('User data already exists');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const generateCuid = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  return (
    <div>
      <button
        onClick={signInWithGoogle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.googleButton,
          ...(isHovered ? styles.googleButtonHover : {}),
        }}
      >
        <img
          src="https://imgs.search.brave.com/IExh49goSu_TIApc0n-MmqpBD2bQhFkhp5YOgWV3zu4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZ29vZ2xlLXMt/bG9nby8xNTAvR29v/Z2xlX0ljb25zLTA5/LTEyOC5wbmc"
          alt="Google logo"
          style={styles.googleIcon}
        />
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#87ceeb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  },
  googleButtonHover: {
    backgroundColor: '#800080',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
};

export default Login;
