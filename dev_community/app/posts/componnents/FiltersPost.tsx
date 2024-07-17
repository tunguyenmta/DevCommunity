"use client";
import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import iconArticle from "../../../public/asstets/icons/Themes (13)/vuesax/linear/article.svg";
import iconComponent from "../../../public/asstets/icons/Themes (13)/vuesax/linear/main-component.svg";
import iconBook from "../../../public/asstets/icons/Themes (13)/vuesax/linear/book-1.svg";

const Filters = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const isActiveLink = (path: string) => {
        return pathname === path ? "bg-blue-200" : "text-gray-600";
    };

    const handleLinkClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className="relative">
            <div
                className={`relative h-[900px] px-2 pb-2 bg-white shadow-lg flex-col justify-start items-start inline-flex transition-all duration-300 ${
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
                                onClick={() => handleLinkClick("/posts")}
                                className={`grow px-4 py-3 rounded-lg justify-start gap-3 text-lg hover:bg-blue-200 transition duration-500 font-medium leading-snug flex items-center cursor-pointer ${
                                    isCollapsed ? "justify-center" : ""
                                } ${isActiveLink("/posts")}`}
                            >
                                <a
                                    href="/posts"
                                    className="flex items-center"
                                >
                                    <Image
                                        src={iconArticle}
                                        alt=""
                                        className={`size-6 ${isActiveLink(
                                            "/posts"
                                        )}`}
                                    ></Image>
                                    {!isCollapsed && (
                                        <span className="text-lg font-medium leading-5 font-inter ml-4">
                                            Article
                                        </span>
                                    )}
                                </a>
                            </div>
                        </div>
                        <div className="self-stretch justify-start items-center gap-4 inline-flex w-[95%]">
                            <div
                                onClick={() => handleLinkClick("/components")}
                                className={`grow text-lg px-4 py-3 rounded-lg gap-3 font-medium hover:bg-blue-200 transition duration-500 leading-snug flex items-center cursor-pointer ${
                                    isCollapsed ? "justify-center" : ""
                                } ${isActiveLink("/components")}`}
                            >
                                <a
                                    href="/components"
                                    className="flex items-center"
                                >
                                    <Image
                                        src={iconComponent}
                                        alt=""
                                        className={`size-6 ${isActiveLink(
                                            "/components"
                                        )}`}
                                    ></Image>
                                    {!isCollapsed && (
                                        <span className="text-lg font-medium leading-5 font-inter ml-4">
                                            Component
                                        </span>
                                    )}
                                </a>
                            </div>
                        </div>
                        <div className="self-stretch h-12 flex-col justify-start items-start gap-3 flex">
                            <div className="self-stretch justify-start items-center gap-4 inline-flex w-[95%]">
                                <div
                                    onClick={() => handleLinkClick("/books")}
                                    className={`grow px-4 py-3 rounded-lg gap-3 text-lg font-medium hover:bg-blue-200 transition duration-500 flex items-center leading-snug cursor-pointer ${
                                        isCollapsed ? "justify-center" : ""
                                    } ${isActiveLink("/books")}`}
                                >
                                    <a
                                        href="/books"
                                        className="flex items-center"
                                    >
                                        <Image
                                            src={iconBook}
                                            alt=""
                                            className={`size-6 ${isActiveLink(
                                                "/books"
                                            )}`}
                                        ></Image>
                                        {!isCollapsed && (
                                            <span className="text-lg font-medium leading-5 font-inter ml-4">
                                                Book & Whitepaper
                                            </span>
                                        )}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
