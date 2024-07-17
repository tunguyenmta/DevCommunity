"use client";
import {useEffect, useLayoutEffect} from 'react'
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useAppContext } from '../utils/contextProvider';
import jwt from 'jsonwebtoken';
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
const Refresh = () => {
    const { userToken , refreshToken, setUserToken, setRefreshToken } = useAppContext();

    // useLayoutEffect(()=>{
    // const refreshBeforeLoad = async ()=>{
    //     const decodedToken = jwt.decode(userToken) as UserProps | null;

    //     if (!decodedToken) return;

    //     const res = await fetch('/pages/api/refresh-token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ token: userToken, refreshToken: refreshToken }),
    //     });
    //     if (res.ok) {
    //         const data = await res.json();
    //         setUserToken(data.accessToken);
    //         setRefreshToken(data.refreshToken);
    //     } else {
    //             const res = await fetch('/pages/api/auth', {method: 'DELETE'});
    //             if (res.ok) {
    //                 setUserToken("");
    //                 setRefreshToken("");
    //             }
            
    //     }
    //     refreshBeforeLoad()

    // }
    // }, [])
    // useEffect(() => {
    //     const refreshIfNeeded = async () => {
    //         const decodedToken = jwt.decode(userToken) as UserProps | null;
    //         if (!decodedToken) return;

    //         const now = new Date();
    //         const expiresAt = new Date(decodedToken.exp * 1000);

    //         if (differenceInSeconds(expiresAt, now) < 6) {
    //             console.log(userToken)
    //             const res = await fetch('/pages/api/refresh-token', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ token: userToken, refreshToken: refreshToken }),
    //             });
    //             if (res.ok) {
    //                 const data = await res.json();
    //                 setUserToken(data.accessToken);
    //                 setRefreshToken(data.refreshToken);
    //             } else {
    //                     const res = await fetch('/pages/api/auth', {method: 'DELETE'});
    //                     if (res.ok) {
    //                         console.log('test here')
    //                         setUserToken("");
    //                         setRefreshToken("");
    //                     }
                    
    //             }
    //         }
    //     };

    //     // refreshIfNeeded();
    //     let interval = undefined
    //     if(userToken){
            
    //         interval = setInterval(refreshIfNeeded, 2000); // Check every 3 minutes
    //         console.log(interval)
    //     }

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, []);

    return null;
};

export default Refresh;