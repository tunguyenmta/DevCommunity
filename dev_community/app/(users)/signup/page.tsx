"use client";
import React from "react";
import Introduce from "../components/Introduce";
import FormSignUp from "../components/FormSignUp";
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="relative w-screen h-screen bg-white flex flex-col justify-between overflow-hidden">
      <Introduce></Introduce>
      <div className="h-1/2 bg-white z-10"></div>
      <FormSignUp onRouting={() => { router.push('/login') }}></FormSignUp>
    </div>
  );
}
