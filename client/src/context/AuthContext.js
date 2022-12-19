import { createContext, useEffect, useState } from "react";
import { auth, db} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if(user === null){
        setCurrentUser(user);
      }else{
        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          let querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            user.numZwitter = doc.data().numZwitter;
          });
          setCurrentUser(user);
        } catch (error) {
          console.log(error);
        }
      }
    }, []);

    return () => {
      unsub();
    };
  });

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
