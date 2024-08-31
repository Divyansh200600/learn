'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CogIcon } from '@heroicons/react/outline';
import { FaAward } from 'react-icons/fa';
import { db, auth, storage } from '../../../../utils/Firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import GoogleLogin from '../../../Auth/login'; 
import Login from '../../../../components/courseComponents/login/loginforPhone';

import DiscordButton from '@/components/DiscordButton';

export default function PhoneProfileScreen() {
  const router = useRouter(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('example@gmail.com');
  const [userDetails, setUserDetails] = useState({
    title: 'Innovative Thinker at PulseZest',
    aboutMe: 'write your own words Zest ⭐.......',
    skills: [ 'Problem Solving', 'Web Development', 'Enter your Own ✏️....'],
    profilePhoto: 'https://via.placeholder.com/200',
    recentActivity: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(userDetails);
  const [newSkill, setNewSkill] = useState('');
  const [loginMethod, setLoginMethod] = useState(''); 
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUsername(userData.name || 'John Doe');
          setEmail(userData.email || 'example@gmail.com');
          const details = {
            title: userData.title || 'Innovative Thinker at PulseZest',
            aboutMe: userData.aboutMe || 'Creative mind with a passion for innovation and technology. Always eager to explore new challenges and opportunities.',
            skills: userData.skills || ['Creative Design', 'Problem Solving', 'Web Development', 'Project Management'],
            profilePhoto: userData.profilePhoto || userData.googlePhoto || 'https://via.placeholder.com/200', // Display googlePhoto if profilePhoto is not available
            recentActivity: userData.recentActivity || []
          };
          setUserDetails(details);
          setEditedDetails(details);

          const coursesRef = collection(db, 'users', uid, 'courses');
          const coursesSnapshot = await getDocs(coursesRef);
          const courseIds = coursesSnapshot.docs.map(doc => doc.id);

          const courses = [];
          for (const courseId of courseIds) {
            const courseDoc = doc(db, 'courses', courseId);
            const courseSnapshot = await getDoc(courseDoc);
            if (courseSnapshot.exists()) {
              courses.push({
                id: courseId,
                name: courseSnapshot.data().name,
                note: userData.recentActivity.find(activity => activity.id === courseId)?.note || ''
              });
            }
          }

          setUserDetails(prevDetails => ({
            ...prevDetails,
            recentActivity: courses.slice(0, 3)
          }));
          setEditedDetails(prevDetails => ({
            ...prevDetails,
            recentActivity: courses.slice(0, 3)
          }));
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUsername('John Doe');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, index, subfield] = name.split('.');

    if (field === 'recentActivity') {
      setEditedDetails(prevDetails => {
        const updatedActivity = [...prevDetails.recentActivity];
        updatedActivity[index][subfield] = value;
        return { ...prevDetails, recentActivity: updatedActivity };
      });
    } else {
      setEditedDetails({
        ...editedDetails,
        [name]: value
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file); 
  };

  const handleUploadPhoto = async () => {
    if (photoFile) {
      try {
        const user = auth.currentUser;
        if (user) {
          const storageRef = ref(storage, `userData/profilesPhoto/${user.uid}/${photoFile.name}`);
          await uploadBytes(storageRef, photoFile);
          const photoURL = await getDownloadURL(storageRef);

          setEditedDetails(prevDetails => ({
            ...prevDetails,
            profilePhoto: photoURL
          }));
          setUserDetails(prevDetails => ({
            ...prevDetails,
            profilePhoto: photoURL
          }));
          setPhotoFile(null); 
        }
      } catch (error) {
        console.error("Error uploading photo: ", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          ...editedDetails,
          email: email 
        }, { merge: true });
        setUserDetails(editedDetails);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving user data: ", error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setEditedDetails(prevDetails => ({
        ...prevDetails,
        skills: [...prevDetails.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (index) => {
    setEditedDetails(prevDetails => {
      const updatedSkills = [...prevDetails.skills];
      updatedSkills.splice(index, 1);
      return { ...prevDetails, skills: updatedSkills };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
        {loginMethod === 'google' ? (
          <GoogleLogin onLogin={(user) => setIsAuthenticated(!!user)} />
        ) : loginMethod === 'email' ? (
          <Login onLogin={(user) => setIsAuthenticated(!!user)} />
        ) : (
          <div className="flex flex-col items-center">
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors mb-4"
              onClick={() => setLoginMethod('google')}
            >
              Login with Google
            </button>
            <p className="mb-2">or</p>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setLoginMethod('email')}
            >
              Login with Email
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <div className="flex-grow p-4 relative">
        <button
          className="absolute top-4 left-4 bg-transparent text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => router.push('/dashboard/settings')}
        >
          <CogIcon className="w-6 h-6" />
        </button>

        <button
          className="relative top-0 left-11 bg-transparent text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => router.push('/dashboard/pz-hall-of-fame')}
        >
          <FaAward className="w-6 h-6" />
        </button>

        {!isEditing ? (
          <button
            className="absolute top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="absolute top-4 right-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        )}

        <header className="text-center mb-6">
          <Image
            src={userDetails.profilePhoto}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 mx-auto"
            width={96}
            height={96}
          />
          <h1 className="mt-4 text-2xl font-bold text-blue-600">{username}</h1>
          <p className="text-gray-600">{userDetails.title}</p>
        </header>
        <div className="flex justify-center">
  <DiscordButton />
</div>

        <section className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-blue-600">About Me</h2>
            {isEditing ? (
              <textarea
                name="aboutMe"
                value={editedDetails.aboutMe}
                onChange={handleInputChange}
                className="w-full h-32 p-2 border-b-2 border-gray-300 focus:outline-none"
              />
            ) : (
              <p className="text-gray-700">{userDetails.aboutMe}</p>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-blue-600">Skills</h2>
            <ul className="list-none p-0">
              {editedDetails.skills.map((skill, index) => (
                <li key={index} className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1 mb-2 flex justify-between items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...editedDetails.skills];
                          newSkills[index] = e.target.value;
                          setEditedDetails(prevDetails => ({ ...prevDetails, skills: newSkills }));
                        }}
                        className="bg-transparent border-none focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeleteSkill(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span>{skill}</span>
                  )}
                </li>
              ))}
            </ul>
            {isEditing && (
              <div className="mt-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
                />
                <button
                  onClick={handleAddSkill}
                  className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600">Contact</h2>
            <p className="text-gray-700">Email: {email}</p>
          </div>
        </section>

       
        {isEditing && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Change Profile Photo</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mb-4"
            />
            {photoFile && (
              <div className="flex items-center">
                <button
                  onClick={handleUploadPhoto}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="text-center bg-white py-4 shadow">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Settings</button>
      </footer>
    </div>
  );
}
