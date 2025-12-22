"use client";

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.tokens?.accessToken;


    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("User fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
