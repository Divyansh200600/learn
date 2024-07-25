// utils/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../utils/Firebase/firebaseConfig'; // Adjust path as per your project

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId(null);
    }
  }, [user]);

  // Assuming login and logout functions are defined elsewhere and passed through context
  const login = () => {
    // Implement your login logic here
  };

  const logout = () => {
    // Implement your logout logic here
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
