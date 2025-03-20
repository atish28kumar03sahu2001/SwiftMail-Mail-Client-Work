// src/Components/Database/Firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCRRdUBdL1UV6dLeCx7oUzoE8qi-aQ_URY",
  authDomain: "snapmailreact-2831.firebaseapp.com",
  databaseURL: "https://snapmailreact-2831-default-rtdb.firebaseio.com",
  projectId: "snapmailreact-2831",
  storageBucket: "snapmailreact-2831.firebasestorage.app",
  messagingSenderId: "341986942424",
  appId: "1:341986942424:web:6778db5dc0ca166481e6ad",
  measurementId: "G-DFVL7SDXR8"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);