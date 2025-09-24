// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8417siXHO7Rup7WflWrPyMGquU4KLT3k",
  authDomain: "haloblocsept2025.firebaseapp.com",
  databaseURL: "https://haloblocsept2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "haloblocsept2025",
  storageBucket: "haloblocsept2025.firebasestorage.app",
  messagingSenderId: "1087589734198",
  appId: "1:1087589734198:web:7cd553eb205ab03dbac597"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { auth, db, rtdb, firebaseConfig };
