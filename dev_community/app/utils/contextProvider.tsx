"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import jwt from "jsonwebtoken";
import { differenceInMinutes } from 'date-fns';
interface UserProps {
  sub: string;
  auth: string;
  id: string;
  avatar: {
      path: string;
      mediaType: string;
      originalName: string;
  };
  iat: number;
  exp: number;
  email: string;
}
interface ContextProps {
  userId: string;
  userToken: string;
  refreshToken: string;
  setUserToken: (value: string) => void;
  setRefreshToken: (value: string) => void;
}

const defaultValue: ContextProps = {
  userId: "",
  userToken: "",
  refreshToken: "",
  setUserToken: () => {},
  setRefreshToken: () => {},
};

export const Context = createContext<ContextProps>(defaultValue);
export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useAppContext must be used within a ContextProvider')
  }
  return context;
};

interface ContextProviderProps {
  children: React.ReactNode;
  initialToken?: string;
  initialRefreshToken?: string;
}

const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
  initialToken = "",
  initialRefreshToken = "",
}: ContextProviderProps) => {
  const [userId, setUserId] = useState<string | "">("");
  const [userToken, setUserToken] = useState<string | "">(initialToken);
  const [refreshToken, setRefreshToken] = useState<string | "">(initialRefreshToken);

  const loadID = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const userId = result.visitorId;
    setUserId(userId);
  };

  useEffect(() => {
    loadID();
  }, []);

  const handleSetUserToken = (value: string) => {
    setUserToken(value);
  };

  const handleSetRefreshToken = (value: string) => {
    setRefreshToken(value);
  };

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (!userToken || !refreshToken) return;
  
      const decodedUserToken = jwt.decode(userToken) as UserProps;
      const now = new Date();
  
  
      const userExpiresAt = new Date(decodedUserToken.exp * 1000);
      if (differenceInMinutes(userExpiresAt, now) < 10) {
        try {
          const res = await fetch('/pages/api/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userToken, refreshToken }),
          });
          if (res.ok) {
            const data = await res.json();
            handleSetUserToken(data.accessToken);
            handleSetRefreshToken(data.refreshToken);
          } 
          else {
            try{
              const res = await fetch('/pages/api/auth', { method: 'DELETE' });
              if(res.ok){
                handleSetUserToken("");
                handleSetRefreshToken("");
                window.location.href = "http://localhost:3000/";
              }
            } catch(error){
              throw new Error('Failed to logout')
            }
           
           
          }
        } catch (error) {
          window.location.href = "http://localhost:3000/";  
          throw new Error('Failed to refresh token');
        }
        
  
       
      }
    };
  
    const interval = setInterval(refreshIfNeeded, 3*60*1000);
  
    return () => clearInterval(interval);
  }, [userToken, refreshToken]);

  return (
    <Context.Provider value={{ userId, userToken, setUserToken: handleSetUserToken, refreshToken, setRefreshToken: handleSetRefreshToken }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
