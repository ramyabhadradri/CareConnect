import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "../firebase/config"; // Ensure correct import of Firebase auth and db
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps your app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // New state to store user role
  const [loading, setLoading] = useState(true);

  // Function to fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = doc(db, "users", uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setRole(docSnap.data().role); // Adjust field based on your Firestore structure
      }
    } catch (error) {
      console.error("Failed to fetch user role", error);
    }
  };

  // Signup function
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Effect to set the current user and role when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserRole(user.uid); // Fetch role based on UID
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    role,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
