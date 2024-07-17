"use client";
import React, { useState, useEffect } from "react";
import Introduce from "../components/Introduce";
import FormSignIn from "../components/FormSignIn";
import { useRouter } from 'next/navigation'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const handleLoadingState = (loading: boolean) => {
    setLoading(loading);
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      {loading && <div className="loading-container min-h-screen h-full flex justify-center items-center">
        <Spin indicator={antIcon} size="large" />
      </div>}
      <div className="relative w-screen h-screen bg-white flex flex-col justify-between overflow-hidden">
        <Introduce />
        <div className="h-1/2 bg-white z-10"></div>
        <FormSignIn handleLoadingState={handleLoadingState} onRouting={(route: string) => { router.push(route) }} />
      </div>
    </>
  );
}

