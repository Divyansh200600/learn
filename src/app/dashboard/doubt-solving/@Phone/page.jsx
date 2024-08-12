'use client';
 
import Image from 'next/image';
import { CogIcon } from '@heroicons/react/outline';
import { db, auth, storage } from '../../../../utils/Firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import GoogleLogin from '../../../Auth/login'; 
import Login from '../../../../components/courseComponents/login/loginforPhone';

export default function PhoneDoubtSolvingScreen() {
  

  return (
    <div>
        Phone Doubt Solving
    </div>
  );
}
