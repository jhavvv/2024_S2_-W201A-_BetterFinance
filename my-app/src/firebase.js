// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqRYBDgHOOqf5YjKBMwWZdOM2q96doyV0",
  authDomain: "betterfinance-ffa20.firebaseapp.com",
  projectId: "betterfinance-ffa20",
  storageBucket: "betterfinance-ffa20.appspot.com",
  messagingSenderId: "941101238025",
  appId: "1:941101238025:web:2aabb002ecd653b358b5d8",
  measurementId: "G-KVVJGM7J6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore


export { auth, db };