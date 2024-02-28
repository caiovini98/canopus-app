import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "../module/user";

interface AuthContextValues {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: any;
  setCurrentUser: (user: User) => void;
  userLogged: User;
  setUserLogged: any;
}

const AuthContext = React.createContext<AuthContextValues | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLogged, setUserLogged] = useState<any>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [isEmailUser, setIsEmailUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      setCurrentUser({ ...user });

      const isEmail = user.providerData.some(
        (provider: any) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const contextValues: AuthContextValues = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    setCurrentUser,
    userLogged,
    setUserLogged,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
