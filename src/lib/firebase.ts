
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "#",
  authDomain: "#",
  projectId: "#",
  storageBucket: "#",
  messagingSenderId: "#",
  appId: "#",
  measurementId: "#"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
