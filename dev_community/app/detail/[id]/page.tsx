/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../home/components/Header";
import Taglist from "../../home/components/Taglist";
import RelateComponents from "./components/RelatedComponents";
import Content from "./components/Content";
import TimeLine from "./components/TimeLine";
import Comments from "./components/Comments";
import RelateGreatest from "./components/RelatedGreatest";
import Footer from "../../home/components/Footer";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useAppContext } from "@/app/utils/contextProvider";

const fetchTags = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch tags");
    }
    return res.json();
};

const fetchPostDetail = async (id: string, userId: string, userToken: string) => {
    const headers: HeadersInit = {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        ipClient: userId,
    };
    
    if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/posts/` + id, {
        headers: headers,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch postDetail");
    }
    return res.json();
};

const fetchPostComment = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/comments/post/${id}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch content");
    }
    return res.json();
};

const markPostAsRead = async (postId: string, userId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/read-full/post/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ipClient: userId,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to mark post as read");
    }
};

export default function PostDetail({ params }: { params: { id: string } }) {
    const { userToken } = useAppContext();
    const [tags, setTags] = useState([]);
    const [postContent, setPostContent] = useState<any>(null);
    const [postComment, setPostComment] = useState([]);
    const [userId, setUserId] = useState<string | "">("");
    const [commentPermission, setCommentPermission] = useState("");
    const [isPostRead, setIsPostRead] = useState(false);
    const commentsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

    useEffect(() => {
        const fetchFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            if(result){
                setUserId(result.visitorId);
            }
        };
        fetchFingerprint();
    }, []);

    const handleScroll = async () => {
        if (typeof window !== "undefined") {
            if (window.scrollY < lastScrollY || (lastScrollY === 0 && window.scrollY === 0)) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }

            if (commentsRef.current && !isPostRead && userId && !hasMarkedAsRead) {
                const rect = commentsRef.current.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

                if (isVisible) {
                    setIsPostRead(true);
                    setHasMarkedAsRead(true);
                    if (params.id && userId) {
                        await markPostAsRead(params.id, userId);
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined" && userId) {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [lastScrollY, userId, hasMarkedAsRead]);

    useEffect(() => {
        const getUserIdAndLoadData = async () => {
            if (userId) {
                const [tags, postContent, postComment] = await Promise.all([
                    fetchTags(),
                    fetchPostDetail(params.id, userId, userToken),
                    fetchPostComment(params.id),
                ]);
                setTags(tags);
                setPostContent(postContent);
                setPostComment(postComment);
                setCommentPermission(postContent.commentPermission);
            }
        };

        getUserIdAndLoadData();
    }, [params.id, userId]);

    useEffect(() => {
        const checkCommentsRender = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("newcomment") && postComment.length > 0 && postContent && commentsRef.current) {
                const observer = await new MutationObserver(() => {
                    if (commentsRef.current) {
                        commentsRef.current.scrollIntoView({ behavior: "smooth" });
                        observer.disconnect();

                        urlParams.delete("newcomment");
                        const newUrl = window.location.pathname + "?" + urlParams.toString();
                        window.history.replaceState({}, "", newUrl);
                    }
                });
                observer.observe(commentsRef.current, { childList: true, subtree: true });
            }
        };
        checkCommentsRender();
    }, [postContent, postComment]);

    const scrollToComments = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!postContent) {
        return <div>Loading...</div>;
    }

    const listRelatedGreatests = postContent.listRelatedGreatest;

    return (
        <div className="">
            <div
                className={`sticky top-0 left-0 right-0  bg-white transition-opacity duration-300 z-20 ${showHeader ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <Header />
            </div>
            <div className="sticky top-0 left-0 right-0 z-10 bg-white transition-opacity duration-300 opacity-100">
                <Taglist tags={tags} />
            </div>
            <div className="overflow-hidden">
                <div className="flex justify-between w-full px-6">
                    <div className="max-w-[360px] w-full mt-10 md:block hidden">
                        {postContent.examples.length > 0 && (
                            <RelateComponents relateComponent={postContent.examples}></RelateComponents>
                        )}
                    </div>
                    <div className="mt-10 w-full max-w-[1144px] mx-auto" ref={contentRef}>
                        <Content postId={params.id} userId={userId} contentPost={postContent} scrollToComments={scrollToComments} />
                        <div ref={commentsRef} className="mb-2" id="commnent">
                            <Comments
                                comments={postComment || []}
                                anonymousNameDefault={postContent.nickNameDefault ? postContent.nickNameDefault : ""}
                                commentPermission={commentPermission}
                                postId={params.id}
                                userId={userId}
                            ></Comments>
                        </div>
                    </div>
                    <div className="mt-20 w-full max-w-[278px] lg:w-[278px] lg:block hidden">
                        {postContent.tableContent.length > 0 && (
                            <TimeLine tableContents={postContent.tableContent ? postContent.tableContent : []} contentRef={contentRef} />
                        )}
                    </div>
                </div>
                <div className="hidden sm:block">
                    <RelateGreatest listRelatedGreatests={listRelatedGreatests}></RelateGreatest>
                </div>
                <Footer tags={tags}></Footer>
            </div>
        </div>
    );
}
