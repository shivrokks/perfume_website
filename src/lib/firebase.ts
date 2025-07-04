import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This configuration MUST point to the Firebase project where your data is stored.
// You mentioned this is `lorve-40696`.
const firebaseConfig = {
  apiKey: "AIzaSyBdKHDgIi9A8Q_NFLRApvqVi3G64wmdDZA",
  authDomain: "lorve-40696.firebaseapp.com",
  projectId: "lorve-40696",
  storageBucket: "lorve-40696.firebasestorage.app",
  messagingSenderId: "724317316722",
  appId: "1:724317316722:web:c19d294e6020f9c372c4eb",
  measurementId: "G-SMGX763Z6J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
