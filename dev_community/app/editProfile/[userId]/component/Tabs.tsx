"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import profileIcon from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/profile.svg";
import passwordIcon from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/lock.svg";
import notificationIcon from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/sms.svg";
import { useSearchParams, useRouter } from 'next/navigation';

interface TabProps {
    setActiveTab: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ setActiveTab }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const param = searchParams.get('search');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTabState] = useState<string>(param == "forgotPassword" ? "password" : "profile");

    useEffect(() => {
        if (param === "forgotPassword") {
            const newUrl = window.location.pathname;
            router.replace(newUrl); // Xóa chuỗi truy vấn mà không tải lại trang
        }
    }, [param, router]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setActiveTabState(tab);
    };

    const isActiveLink = (tab: string) => {
        return activeTab === tab
            ? "bg-blue-200"
            : "text-gray-600";
    };

    return (
        <div className="relative">
            <div
                className={`relative h-[1037px] px-2 pb-2 bg-white shadow-lg flex-col justify-start items-start inline-flex transition-all duration-300 ${
                    isCollapsed ? "w-20" : "w-72"
                }`}
            >
                <button
                    onClick={toggleCollapse}
                    className="absolute top-4 right-[-15px] p-2 bg-white border border-zinc-300 rounded-full cursor-pointer"
                >
                    {isCollapsed ? (
                        <AiOutlineRight className="w-3 h-3" />
                    ) : (
                        <AiOutlineLeft className="w-3 h-3" />
                    )}
                </button>
                <div className="w-full h-40 pt-4 pb-1 rounded-tl-lg rounded-tr-lg flex-col justify-start items-start gap-6 flex">
                    <div className="self-stretch h-28 flex-col justify-start items-start gap-3 flex">
                        <div className="self-stretch justify-start items-center gap-4 inline-flex w-[95%]">
                            <div
                                onClick={() => handleTabClick("profile")}
                                className={`grow px-4 py-3 rounded-lg justify-start gap-3 text-lg hover:bg-blue-200 transition duration-500 font-medium leading-snug flex items-center cursor-pointer ${
                                    isCollapsed ? "justify-center" : ""
                                } ${isActiveLink("profile")}`}
                            >
                                <Image
                                    src={profileIcon}
                                    alt=""
                                    className={`size-6 ${isActiveLink(
                                        "profile"
                                    )}`}
                                ></Image>
                                {!isCollapsed && (
                                    <span className="text-lg font-medium leading-5 font-inter ml-2">
                                        Profile
                                    </span>
                                )}
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="mt-2 font-normal text-xl leading-6 text-disable w-full border-b border-gray-300 pb-4 px-4 py-3">
                                Setting
                            </div>
                        )}
                        <div className="self-stretch justify-start items-center gap-4 inline-flex w-[95%]">
                            <div
                                onClick={() => handleTabClick("password")}
                                className={`grow text-lg px-4 py-3 rounded-lg gap-3 font-medium hover:bg-blue-200 transition duration-500 leading-snug flex items-center cursor-pointer ${
                                    isCollapsed ? "justify-center" : ""
                                } ${isActiveLink("password")}`}
                            >
                                <Image
                                    src={passwordIcon}
                                    alt=""
                                    className={`size-6 ${isActiveLink(
                                        "password"
                                    )}`}
                                ></Image>
                                {!isCollapsed && (
                                    <span className="text-lg font-medium leading-5 font-inter ml-2">
                                        Password
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="self-stretch h-12 flex-col justify-start items-start gap-3 flex">
                            <div className="self-stretch justify-start items-center gap-4 inline-flex w-[95%]">
                                <div
                                    onClick={() => handleTabClick("notifications")}
                                    className={`grow px-4 py-3 rounded-lg gap-3 text-lg font-medium hover:bg-blue-200 transition duration-500 flex items-center leading-snug cursor-pointer ${
                                        isCollapsed ? "justify-center" : ""
                                    } ${isActiveLink("notifications")}`}
                                >
                                    <Image
                                        src={notificationIcon}
                                        alt=""
                                        className={`size-6 ${isActiveLink(
                                            "notifications"
                                        )}`}
                                    ></Image>
                                    {!isCollapsed && (
                                        <span className="text-lg font-medium leading-5 font-inter ml-2">
                                            Notifications
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tab;
