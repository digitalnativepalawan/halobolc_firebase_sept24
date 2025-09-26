import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8417siXHO7Rup7WflWrPyMGquU4KLT3k",
  authDomain: "haloblocsept2025.firebaseapp.com",
  databaseURL: "https://haloblocsept2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "haloblocsept2025",
  storageBucket: "haloblocsept2025.firebasestorage.app",
  messagingSenderId: "1087589734198",
  appId: "1:1087589734198:web:7cd553eb205ab03dbac597"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
