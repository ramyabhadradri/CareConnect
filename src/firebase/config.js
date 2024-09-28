// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7zyr6VCTV2UooV-tomdMnAlecVsd7Rlg",
  authDomain: "hospital-management-syst-a9cb4.firebaseapp.com",
  projectId: "hospital-management-syst-a9cb4",
  storageBucket: "hospital-management-syst-a9cb4.appspot.com",
  messagingSenderId: "920301212650",
  appId: "1:920301212650:web:c50d8ae352b4b0bfd91893"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
