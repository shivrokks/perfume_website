
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbBD5WPnUToBknA0vA1w72JQk9e0WU4dU",
  authDomain: "lorv-ybzjd.firebaseapp.com",
  projectId: "lorv-ybzjd",
  storageBucket: "lorv-ybzjd.firebasestorage.app",
  messagingSenderId: "226679573057",
  appId: "1:226679573057:web:bb93d2b5f45312572214c0"
  // measurementId: "G-XXXXXXXXXX" // Optional: Enable Analytics in Firebase to get this ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
