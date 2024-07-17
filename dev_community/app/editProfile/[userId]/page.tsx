"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/home/components/Header";
import Taglist from "@/app/home/components/Taglist";
import Tab from "./component/Tabs";
import Profile from "./component/Profile";
import Password from "./component/Password";
import Notifications from "./component/Notifications";
import { useSearchParams } from 'next/navigation';

interface TagProps {
    id: number;
    name: string;
}

const fetchTags = async (): Promise<TagProps[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
        headers: {
            "Cache-Control": "no-store",
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch tags");
    }
    return res.json();
};

const EditProfile = () => {
    const [tags, setTags] = useState<TagProps[]>([]);
    const searchParams = useSearchParams();
    const param = searchParams.get('search')
    const [activeTab, setActiveTab] = useState<string>(param == "forgotPassword" ? "password" : "profile");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTags = async () => {
            try {
                const fetchedTags = await fetchTags();
                setTags(fetchedTags);
            } catch (error) {
                setError("Failed to fetch tags");
            }
        };
        getTags();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col">
            <Header />
            <Taglist tags={tags} />
            <div className="px-[40px] py-[52px] flex gap-[24px] justify-between flex-1 min-h-screen">
                <Tab setActiveTab={setActiveTab} />
                <div className="w-full flex flex-col">
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "password" && <Password />}
                    {activeTab === "notifications" && <Notifications />}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
