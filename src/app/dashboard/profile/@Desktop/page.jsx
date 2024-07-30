'use client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../../utils/Firebase/firebaseConfig';

export default function DekstopProfileScreen() {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('example@gmail.com');
  const [userDetails, setUserDetails] = useState({
    title: 'Innovative Thinker at PulseZest',
    aboutMe: 'Creative mind with a passion for innovation and technology. Always eager to explore new challenges and opportunities.',
    skills: ['Creative Design', 'Problem Solving', 'Web Development', 'Project Management'],
    profilePhoto: 'https://via.placeholder.com/200',
    recentActivity: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(userDetails);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUsername(userData.name || 'John Doe');
          setEmail(userData.email || 'example@gmail.com');
          const userDetails = {
            title: userData.title || 'Innovative Thinker at PulseZest',
            aboutMe: userData.aboutMe || 'Creative mind with a passion for innovation and technology. Always eager to explore new challenges and opportunities.',
            skills: userData.skills || ['Creative Design', 'Problem Solving', 'Web Development', 'Project Management'],
            profilePhoto: userData.profilePhoto || 'https://via.placeholder.com/200',
            recentActivity: userData.recentActivity || []
          };
          setUserDetails(userDetails);
          setEditedDetails(userDetails);

          // Fetch courses
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
                note: userData.recentActivity.find(activity => activity.id === courseId)?.note || '' // Fetch existing note if available
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
        fetchUserData(user.uid);
      } else {
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const user = auth.currentUser;
      if (user) {
        const storageRef = ref(storage, `userData/profilesPhoto/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);

        setEditedDetails({
          ...editedDetails,
          profilePhoto: photoURL
        });
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
          email: email  // Ensure the email is also saved
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

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-200 to-blue-200 text-gray-800">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          
          <Image
            src={userDetails.profilePhoto}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
            width={128}
            height={128}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="ml-4"
            />
          )}
          <div className="ml-6">
          <h1 className="text-4xl font-bold text-blue-600">{username}</h1>
{isEditing ? (
  <input
    type="text"
    name="title"
    value={editedDetails.title}
    onChange={handleInputChange}
    className="mt-2 w-auto text-size-3 font-semibold text-gray-600 border-b-2 border-gray-300 focus:outline-none"
    size={Math.max(editedDetails.title.length - 5, 10)} // Decrease size slightly
    style={{ maxWidth: '90%' }} // Limit max width to 90% of the parent
  />
) : (
  <p className="mt-2 text-size-3 font-semibold text-gray-600">
    {editedDetails.title}
  </p>
)}

          </div>
        </div>
        <div>
          {isEditing ? (
            <button
              className="bg-indigo-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="bg-indigo-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </header>

      <main className="flex space-x-8">
        <section className="bg-white rounded-lg shadow p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">About Me</h2>
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

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">Skills</h2>
            <ul className="list-none p-0 grid grid-cols-2 gap-4">
              {editedDetails.skills.map((skill, index) => (
                <li key={index} className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1 flex justify-between items-center">
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
            <h2 className="text-2xl font-semibold text-blue-600">Contact</h2>
            <>
              <p className="text-gray-700">Email: {email}</p>
            </>
          </div>
        </section>

        <aside className="bg-white rounded-lg shadow p-6 w-80">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Recent Activity</h2>
          <ul className="list-none p-0 space-y-4">
            {userDetails.recentActivity.map((activity, index) => (
              <li key={index} className="bg-blue-100 text-blue-700 rounded-lg px-3 py-2">
                <p className="font-semibold">{activity.name}</p>
                {isEditing ? (
                  <textarea
                    name={`recentActivity.${index}.note`}
                    value={activity.note}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 border-b-2 border-gray-300 focus:outline-none"
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{activity.note}</p>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <footer className="text-center mt-8">
        <p className="text-gray-600">&copy; 2024 PulseZest. All rights reserved.</p>
      </footer>
    </div>
  );
}
