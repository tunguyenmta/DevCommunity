/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect, useRef } from "react";
import { TbShare3 } from "react-icons/tb";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import comment from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/coment.png";
import tag from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/tag.svg";
import heart from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/heart.svg";
import share from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/share.svg";
import "./Content.css";
import jwt from "jsonwebtoken";
import { useAppContext } from "@/app/utils/contextProvider";
import { toast } from "react-toastify";

const sendReadingTime = async (postId: string, time: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/posts/${postId}/reading-time?second=` + time, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        },
        body: JSON.stringify({}),
    });
    if (!res.ok) {
        throw new Error("Failed to update reading time");
    }
    return "";
};

interface contentPost {
    title: string;
    content: string;
    postingTime: string;
    hashTagList: [];
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    readMediumTime: 0;
    totalComment: 0;
    listIpClientLiked: [];
    user: {
        username: string
    };
    fbAppId: string;
}

interface idProps {
    postId: string;
    userId: string;
    contentPost: contentPost;
    scrollToComments: () => void;
}

interface UserProps {
    id: string;
    sub: string;
    email: string;
    avatar: string;
    auth: string;
    exp: number;
    iat: number;
}

const Content: React.FC<idProps> = ({ postId, userId, contentPost, scrollToComments }) => {
    const { userToken } = useAppContext();
    const [title, setTitle] = useState("");
    const [postTime, setPostTime] = useState("");
    const [username, setUsername] = useState("");
    const [readMediumTime, setReadMediumTime] = useState(0);
    const [tags, setTags] = useState([]);
    const [img, setImg] = useState("");
    const [content, setContent] = useState("");
    const [totalComment, setTotalComment] = useState(0);
    const [readingTime, setReadingTime] = useState(0);
    const [countLike, setCountLike] = useState(0);
    const [listIpClientLiked, setListIpClientLiked] = useState<string[]>([]);
    const [liked, setLiked] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userAccount, setUserAccount] = useState<UserProps | null>(null);
    const [appID, setAppID] = useState<string>("");

    const increaseCounting = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/posts/${postId}/sharing`, {
            method: "PUT",
        });
        if (!res.ok) {
            throw new Error("Failed to update sharing count");
        }
        toast.success("Sharing successful", {
            autoClose: 1000,
            position: "top-center",
        });
    };

    const sharePost = (url: string) => {
        window.FB.ui(
            {
                method: "share",
                href: url, // Replace this URL with the URL you want to share
            },
            function (response: any) {
                if (!response.error_message) {
                    console.log(response);
                    increaseCounting();
                    // alert('Sharing successful');
                } else {
                    console.log(response);
                    toast.error("Error while sharing", {
                        autoClose: 1000,
                        position: "top-center",
                    });
                    // alert('Error while sharing');
                }
            }
        );
    };

    useEffect(() => {
        if (userToken) {
            const decodedToken = jwt.decode(userToken) as UserProps;
            if (decodedToken) {
                setUserAccount(decodedToken);
            }
        }
    }, []);

    useEffect(() => {
        // Check if the Facebook SDK script is already loaded
        if (!document.getElementById("facebook-jssdk")) {
            // Create a script element
            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.defer = true;
            if (appID) {
                script.onload = () => {
                    window.FB.init({
                        appId: appID, // Replace YOUR_APP_ID with your actual app ID
                        autoLogAppEvents: true,
                        xfbml: true,
                        version: "v11.0",
                    });
                };
                // Append the script element to the document body
                document.body.appendChild(script);
            }
        }
    }, [appID]);

    useEffect(() => {
        const getContent = async () => {
            const data = contentPost;
            const styledContent = `<style>
                @import "https://cdn.jsdelivr.net/npm/tailwindcss@^2.0/dist/tailwind.min.css";
                body, html { overflow: hidden;}
            </style>
            <div class="tailwind-styles-here">
            ${data.content
                .replace(/<p(.*?)>/g, '<p class="font-inter font-normal text-xl leading-10 text-black1">')
                .replace(/<h1(.*?)>/g, '<h1$1 class="font-inter text-black1 font-bold text-4xl leading-10">')
                .replace(/<h2(.*?)>/g, '<h2$1 class="font-inter text-black1 font-bold text-2xl leading-10 gap-5">')}
            </div>`;
            setAppID(contentPost.fbAppId);
            setContent(styledContent);
            setTitle(data.title);
            setPostTime(data.postingTime);
            setTags(data.hashTagList || []);
            setImg(data.cover.path);
            setReadMediumTime(data.readMediumTime);
            setTotalComment(data.totalComment);
            setListIpClientLiked(data.listIpClientLiked);
            setUsername(data.user.username);
        };
        getContent();
    }, [postId, userId]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                sendReadingTime(postId, readingTime);
                setReadingTime(0);
            } else {
                intervalRef.current = setInterval(() => {
                    setReadingTime((prevTime) => prevTime + 1);
                }, 1000);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        intervalRef.current = setInterval(() => {
            setReadingTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [readingTime, postId]);

    useEffect(() => {
        if (userAccount) {
            if (listIpClientLiked.includes(userAccount.sub)) {
                setLiked(true);
            }
        } else if (listIpClientLiked.includes(userId)) {
            setLiked(true);
        }
        setCountLike(listIpClientLiked.length);
    }, [listIpClientLiked, userId]);

    const handleLike = async () => {
        try {
            const headers: { [key: string]: string } = {
                "Content-Type": "application/json",
                ipClient: userId,
            };

            if (userToken) {
                headers["Authorization"] = `Bearer ${userToken}`;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/likes/post/${postId}`, {
                method: "POST",
                headers: headers,
            });

            if (!response.ok) {
                console.error("Failed to like the post", response.status, response.statusText);
                return;
            }

            if (!liked) {
                setLiked(true);
                setCountLike(countLike + 1);
            } else {
                setLiked(false);
                setCountLike(countLike - 1);
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    const resizeIframe = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.style.height = iframeRef.current.contentWindow.document.documentElement.scrollHeight + "px";
        }
    };

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.addEventListener("load", resizeIframe);
        }

        return () => {
            if (iframeRef.current) {
                iframeRef.current.removeEventListener("load", resizeIframe);
            }
        };
    }, [content]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="w-full">
            <div className="w-full flex-col justify-start items-start gap-6 inline-flex border-b">
                <div className="w-full px-6 bg-white rounded-xl flex-col justify-center items-start gap-3 flex">
                    <div className="w-full pb-3 flex-col justify-start items-start gap-4 flex">
                        <div className="text-black1 text-base font-normal font-inter capitalize">
                            <span className="font-bold text-xl text-gray3">{username}</span> /{" "}
                            <span className="font-normal text-base text-gray3">{postTime && postTime.split("T")[0]} / </span>
                            <a
                                href="#"
                                className="text-blue3 underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToComments();
                                }}
                            >
                                {totalComment} comments
                            </a>
                        </div>
                        <div className="text-black1 text-wrap font-bold font-inter capitalize text-5xl leading-normal">{title}</div>
                        <div className="self-stretch flex-col justify-center items-start gap-2 flex bg-gray4 p-5 mt-2 rounded-lg">
                            <div className="self-stretch justify-start items-start flex sm:flex-row flex-col">
                                <div className="flex items-center mr-3 text-nowrap">
                                    <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.77 10C2.34 10 2 9.66 2 9.23V6.92C2 4.21 4.21 2 6.92 2H9.23C9.66 2 10 2.34 10 2.77C10 3.2 9.66 3.54 9.23 3.54H6.92C5.05 3.54 3.54 5.06 3.54 6.92V9.23C3.54 9.66 3.19 10 2.77 10Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M21.23 10C20.81 10 20.46 9.66 20.46 9.23V6.92C20.46 5.05 18.94 3.54 17.08 3.54H14.77C14.34 3.54 14 3.19 14 2.77C14 2.35 14.34 2 14.77 2H17.08C19.79 2 22 4.21 22 6.92V9.23C22 9.66 21.66 10 21.23 10Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M17.0799 21.9997H15.6899C15.2699 21.9997 14.9199 21.6597 14.9199 21.2297C14.9199 20.8097 15.2599 20.4597 15.6899 20.4597H17.0799C18.9499 20.4597 20.4599 18.9397 20.4599 17.0797V15.6997C20.4599 15.2797 20.7999 14.9297 21.2299 14.9297C21.6499 14.9297 21.9999 15.2697 21.9999 15.6997V17.0797C21.9999 19.7897 19.7899 21.9997 17.0799 21.9997Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M9.23 22H6.92C4.21 22 2 19.79 2 17.08V14.77C2 14.34 2.34 14 2.77 14C3.2 14 3.54 14.34 3.54 14.77V17.08C3.54 18.95 5.06 20.46 6.92 20.46H9.23C9.65 20.46 10 20.8 10 21.23C10 21.66 9.66 22 9.23 22Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M18.4595 11.2305H17.0995H6.89953H5.53953C5.10953 11.2305 4.76953 11.5805 4.76953 12.0005C4.76953 12.4205 5.10953 12.7705 5.53953 12.7705H6.89953H17.0995H18.4595C18.8895 12.7705 19.2295 12.4205 19.2295 12.0005C19.2295 11.5805 18.8895 11.2305 18.4595 11.2305Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M6.90039 13.9405V14.2705C6.90039 15.9305 8.24039 17.2705 9.90039 17.2705H14.1004C15.7604 17.2705 17.1004 15.9305 17.1004 14.2705V13.9405C17.1004 13.8205 17.0104 13.7305 16.8904 13.7305H7.11039C6.99039 13.7305 6.90039 13.8205 6.90039 13.9405Z"
                                            fill="#3C7FF5"
                                        />
                                        <path
                                            d="M6.90039 10.0605V9.73047C6.90039 8.07047 8.24039 6.73047 9.90039 6.73047H14.1004C15.7604 6.73047 17.1004 8.07047 17.1004 9.73047V10.0605C17.1004 10.1805 17.0104 10.2705 16.8904 10.2705H7.11039C6.99039 10.2705 6.90039 10.1805 6.90039 10.0605Z"
                                            fill="#3C7FF5"
                                        />
                                    </svg>
                                    <span className="font-inter font-normal text-base text-gray1">{readMediumTime} min read</span>
                                </div>
                                <div className="justify-start items-center gap-2 inline-flex flex-wrap mt-2 sm:mt-0">
                                    <Image src={tag} alt="" className="size-6 sm:ml-2"></Image>
                                    {tags.length > 0 &&
                                        tags.map((tag: any, index) => (
                                            <div key={tag.id} className="justify-start items-center flex">
                                                <a
                                                    href={`/articles/hashtag/${tag.id}`}
                                                    className="text-blue3 underline text-base font-normal font-inter leading-tight"
                                                >
                                                    {tag.name}
                                                </a>
                                                {index < tags.length - 1 && ","}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="justify-start items-start flex text-base font-inter font-normal">
                                <TbShare3 className="text-blue3 size-6 mr-2" />
                                <span className="text-gray1 mr-2">Share on</span>
                                <button
                                    className="text-blue3 underline"
                                    onClick={() => sharePost(`${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${postId}`)}
                                >
                                    Facebook
                                </button>
                                ,{" "}
                                <a
                                    href={`https://x.com/share?url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${postId}`}
                                    className="text-blue3 underline ml-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    X
                                </a>
                                ,{" "}
                                <a
                                    href={`http://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${postId}`}
                                    className="text-blue3 underline ml-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Linkedin
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex-col justify-start items-start gap-6 flex">
                        <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                            {img && <img className="sm:h-[679px]" src={process.env.NEXT_PUBLIC_BASE_IMG_URL + img} />}
                            <iframe
                                ref={iframeRef}
                                srcDoc={content}
                                id="content-iframe"
                                className="border-0"
                                title="Content"
                                width="100%"
                                onLoad={resizeIframe}
                                style={{ overflow: "hidden" }}
                            />
                        </div>
                    </div>
                    <div className="w-full ms-4 h-12 flex justify-between items-center gap-4 mb-5">
                        <div className="flex justify-start items-center gap-6">
                            <div className="px-2 py-3 rounded-sm flex justify-center items-center gap-3 cursor-pointer" onClick={handleLike}>
                                <Image src={heart} alt="" className={`size-7 ${liked ? "red-heart" : ""}`}></Image>
                                <div
                                    className={`text-black1 text-2xl font-normal font-inter leading-tight whitespace-nowrap ${
                                        liked ? "text-red-500" : "text-black1"
                                    }`}
                                >
                                    {countLike}
                                </div>
                            </div>
                            <div className="pr-4 py-3 rounded-sm flex justify-center items-center gap-3">
                                <Image src={comment} alt="" className="size-7"></Image>
                                <div className="text-black1 text-2xl font-normal font-inter leading-snug whitespace-nowrap">{totalComment}</div>
                            </div>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <div className="px-4 py-3 rounded-sm flex justify-center items-center gap-3 cursor-pointer" onClick={toggleDropdown}>
                                <Image src={share} alt="" className="size-7"></Image>
                            </div>
                            {showDropdown && (
                                <div className="absolute left-12 min-w-40 bg-white border rounded shadow-lg">
                                    <a
                                        href={
                                            "https://www.facebook.com/sharer/sharer.php?u=" + process.env.NEXT_PUBLIC_LINK_SHARE + "/detail/" + postId
                                        }
                                        target="_blank"
                                        className="hover:bg-gray-200 px-2 py-2 text-gray-800 flex items-center text-lg"
                                    >
                                        <FaFacebook className="size-6 mr-2 text-blue3" /> Facebook
                                    </a>
                                    <a
                                        href={`https://x.com/share?url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${postId}`}
                                        target="_blank"
                                        className="hover:bg-gray-200 px-2 py-2 text-gray-800 flex items-center text-lg"
                                    >
                                        <FaXTwitter className="size-6 mr-2" /> X
                                    </a>
                                    <a
                                        href={`http://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${postId}`}
                                        target="_blank"
                                        className="hover:bg-gray-200 px-2 py-2 text-gray-800 flex items-center text-lg"
                                    >
                                        <FaLinkedin className="size-6 mr-2 text-blue-500" /> Linkedin
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
