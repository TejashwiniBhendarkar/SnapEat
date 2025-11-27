// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "snapeat-food-delivery.firebaseapp.com",
  projectId: "snapeat-food-delivery",
  storageBucket: "snapeat-food-delivery.firebasestorage.app",
  messagingSenderId: "702013617570",
  appId: "1:702013617570:web:d632e3f3769e22fdb22efb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {app,auth};
