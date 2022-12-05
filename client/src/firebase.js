import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCRllccGiAVLNuiWJr43P1coaciKGU9p0",
  authDomain: "zwitter-e1db4.firebaseapp.com",
  projectId: "zwitter-e1db4",
  storageBucket: "zwitter-e1db4.appspot.com",
  messagingSenderId: "760442084499",
  appId: "1:760442084499:web:a379bab0fa81646c200166"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
