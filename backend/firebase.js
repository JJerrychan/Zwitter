
const { initializeApp } = require("firebase/app");
const { getAuth }  = require( "firebase/auth")
const { getStorage } = require( "firebase/storage");
const { getFirestore } = require( "firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBCRllccGiAVLNuiWJr43P1coaciKGU9p0",
  authDomain: "zwitter-e1db4.firebaseapp.com",
  projectId: "zwitter-e1db4",
  storageBucket: "zwitter-e1db4.appspot.com",
  messagingSenderId: "760442084499",
  appId: "1:760442084499:web:a379bab0fa81646c200166"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore()

module.exports ={
  app,
  auth,
  storage,
  db
}
