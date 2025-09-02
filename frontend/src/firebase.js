import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCycXO91pQ3DiEZwWv5UCPKFKBaH5BriIM",
  authDomain: "guinea-pig-app-a47e1.firebaseapp.com",
  projectId: "guinea-pig-app-a47e1",
  storageBucket: "guinea-pig-app-a47e1.firebasestorage.app",
  messagingSenderId: "484263902087",
  appId: "1:484263902087:web:6f0d59c81db70a13b03122",
  measurementId: "G-2HZ6H0H147"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);