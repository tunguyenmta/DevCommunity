/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useRef, useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import Avatar from "react-avatar";
import Image from "next/image";
import arrowRight3 from "../../../public/asstets/icons/Themes (13)/vuesax/linear/arrow-right-3.svg";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";

interface Comment {
    id: string;
    content: string;
    parentId: string | null;
    nickName: string;
    createdDate: string;
}

interface CommentProps {
    comments: Comment[];
    componentId: string;
    userId: string;
    anonymousNameDefault: string;
    commentPermission: string;
    userAccount: {
        id: string;
        sub: string;
        email: string;
        avatar: string;
        auth: string;
        exp: number;
        iat: number;
    } | null;
    userToken: string;
}

const Comments: React.FC<CommentProps> = ({ comments, componentId, userId, anonymousNameDefault, commentPermission, userAccount, userToken }) => {
    const inputNickName = useRef<HTMLInputElement>(null);
    const inputContentComment = useRef<HTMLTextAreaElement>(null);
    const [nickName, setNickName] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [commentList, setCommentList] = useState<Comment[]>(comments);
    const [anonymousName, setAnonymousName] = useState<string>("");
    const [nickNameReply, setNickNameReply] = useState<string>("");
    const [showAllComments, setShowAllComments] = useState<boolean>(false);
    const [charCount, setCharCount] = useState<number>(0);
    const [isSaveNickName, setIsSaveNickName] = useState<boolean>(false);
    const [nameError, setNameError] = useState<string>("");
    const [messageError, setMessageError] = useState<string>("");

    useEffect(() => {
        if (userAccount) {
            setNickName(userAccount.sub);
        } else {
            setNickName(anonymousNameDefault);
        }
    }, [anonymousNameDefault]);

    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}ws`);
        const stompClient: CompatClient = Stomp.over(socket);

        stompClient.connect(
            {},
            (frame: any) => {
                console.log("Connected: " + frame);
                stompClient.subscribe(`/topic/comment/component/create/${componentId}`, (message) => {
                    if (message.body) {
                        const newComment = JSON.parse(message.body);
                        setAnonymousName(newComment.nickName);
                        setCommentList((prevComments) => [newComment, ...prevComments]);
                    }
                });
            },
            (error: any) => {
                console.error("WebSocket error", error);
            }
        );

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    console.log("WebSocket connection closed");
                });
            }
        };
    }, [componentId]);

    useEffect(() => {
        if (isSaveNickName) {
            setNickName(anonymousName);
        } else setNickName(userAccount ? userAccount.sub : anonymousNameDefault);
    }, [anonymousName]);

    const handleReply = (id: string, nickName: string) => {
        setParentId(id);
        setNickNameReply(nickName);
        if (userAccount || nickName != "") {
            inputContentComment.current?.focus();
        } else if (inputNickName.current) {
            inputNickName.current.focus();
        }
    };

    const handleSendComment = async () => {
        let valid = true;

        if (nickName.trim() === "") {
            setNameError("Name is required");
            valid = false;
        } else {
            setNameError("");
        }

        if (content.trim() === "") {
            setMessageError("Something to say!");
            valid = false;
        } else {
            setMessageError("");
        }

        if (!valid) {
            return;
        }

        const commentData = {
            nickName: userAccount ? userAccount.sub : nickName,
            content: content,
            parentId: parentId,
            isSaveNickName: userAccount ? true : isSaveNickName,
        };

        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
            ipClient: userId,
        };

        if (userAccount) {
            headers["Authorization"] = `Bearer ${userToken}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/comments/component/${componentId}`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(commentData),
        });

        if (response.ok) {
            setParentId("");
            setNickNameReply("");
            setContent("");
            setParentId(null);
            setCharCount(0);
            setIsSaveNickName(false);
        } else {
            console.error("Failed to post comment", response.status, response.statusText);
            const errorData = await response.json();
            console.error("Error details:", errorData);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        if (newContent.length <= 500) {
            setContent(newContent);
            setCharCount(newContent.length);
        }
    };

    const renderComments = (comments: Comment[], parentId: string | null = null, parentName: string = "", depth: number = 0) => {
        const filteredComments = comments.filter((comment) => comment.parentId === parentId);
        const displayedComments = showAllComments ? filteredComments : filteredComments.slice(0, 5);

        return displayedComments.map((comment) => (
            <div key={comment.id} className="w-full">
                <div className="self-stretch justify-start items-start gap-2 flex bg-gray4 p-4 rounded-lg">
                    <Avatar
                        name={comment.nickName.split("")[0]}
                        size="40"
                        className="rounded-[50%]"
                        textSizeRatio={2.2}
                        color="#FFD8BF"
                        fgColor="#FA541C"
                    />
                    <div className="grow shrink basis-0 flex-col justify-center items-start inline-flex text-wrap">
                        <div className="text-black1 relative text-xl font-bold font-inter flex items-center text-wrap">
                            {comment.nickName}
                            {parentName && (
                                <span className="flex items-center">
                                    <Image src={arrowRight3} alt="" className="mx-1 size-7"></Image>
                                    {parentName}
                                </span>
                            )}
                        </div>
                        <div className="self-stretch text-black1 text-xl font-light font-inter leading-8">{comment.content}</div>
                        <div className="w-full h-11 mt-2 items-center inline-flex">
                            <div className="flex-col inline-flex">
                                <div className="text-gray1 text-xl font-normal font-inter leading-snug">{comment.createdDate.split("T")[0]}</div>
                            </div>
                            <div className="gap-1 flex ml-auto">
                                {depth < 2 && (
                                    <div className="px-4 py-3 rounded-sm justify-center items-center gap-3 flex">
                                        <div className="w-6 h-6 pr-0.5 pb-0.5 justify-center items-center flex"></div>
                                        <div className="pr-4 py-3 rounded-sm flex justify-center items-center gap-3">
                                            <div
                                                onClick={() => handleReply(comment.id, comment.nickName)}
                                                className="text-center cursor-pointer text-black1 text-xl font-semibold font-inter leading-snug"
                                            >
                                                Reply
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pl-10 mt-4">{renderComments(comments, comment.id, comment.nickName, depth + 1)}</div>
            </div>
        ));
    };

    return (
        commentPermission !== "NO_ONE" && (
            <div className="mt-4 md:flex sm:grid">
                {/* List Comment */}
                <div className="w-full md:w-1/2 flex-col justify-start items-start gap-6 inline-flex mr-4">
                    <div className="self-stretch bg-white flex-col justify-start items-start gap-3 flex">
                        {commentList.length > 0 ? (
                            renderComments(commentList)
                        ) : (
                            <div>
                                <h1 className="font-inter font-semibold text-[56px] leading-[67px]">Comments</h1>
                                <p className="font-inter font-normal text-xl leading-5 mt-4">
                                    No comments have been posted yet. Please feel free to comment first!
                                </p>
                                <p className="font-inter font-light text-xl leading-6 mt-7">
                                    Note: Make sure your comment is related to the topic of the article above. Lets start a personal and meaningful
                                    conversation!
                                </p>
                            </div>
                        )}
                    </div>
                    {!showAllComments && commentList.length > 6 && (
                        <div
                            className="w-full h-12 px-4 rounded-sm justify-center items-center gap-3 inline-flex"
                            onClick={() => setShowAllComments(true)}
                        >
                            <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                                <p className="text-center text-black1 text-xl font-semibold font-inter">Click to view all comments</p>
                                <span>
                                    <VscFoldDown size={15} className="mt-1 animate-bounce" />
                                </span>
                            </div>
                        </div>
                    )}
                    {showAllComments && (
                        <div
                            className="w-full h-12 px-4 rounded-sm justify-center items-center gap-3 inline-flex"
                            onClick={() => setShowAllComments(false)}
                        >
                            <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                                <span>
                                    <VscFoldUp size={15} className="mt-1 animate-bounce" />
                                </span>
                                <p className="text-center text-black1 text-xl font-semibold font-inter  ">Hide comments</p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Enter comment */}
                <div className="w-full md:w-1/2 ml-0 md:ml-4 flex-col items-start gap-2 inline-flex mt-2">
                    <h1 className="font-inter font-semibold text-2xl leading-7">
                        LEAVE A COMMENT
                    </h1>
                    <div className="mr-2 bg-lightYellow p-4 font-inter font-normal text-xl leading-9">
                        Comments are moderated. They will be published only if they add to the discussion in a constructive way. If you disagree,
                        please be polite. We all want to learn from each other here. We use GitHub Flavored Markdown for comments. Call out code
                        within a sentence with single backticks (`
                        <span className="text-red1">command</span>`). For a distinct block, use triple backticks (```
                        <span className="text-red1">code block</span>```).
                    </div>
                    <div className="w-full mt-6">
                        <div className="text-black1 font-inter font-semibold text-xl leading-5 mb-4">Name</div>
                        <input
                            ref={inputNickName}
                            className={`w-full h-12 px-5 rounded-lg border border-zinc-300 font-light text-xl leading-6 ${
                                userAccount ? "bg-borderGray1" : ""
                            }`}
                            placeholder="Please enter your real name here!"
                            value={nickName}
                            disabled={userAccount ? true : false}
                            onChange={(e) => setNickName(e.target.value)}
                        />
                        {nameError && <div className="text-yellow-400 text-xl leading-9 font-normal">{nameError}</div>}
                    </div>
                    <div className="w-full mt-4">
                        <div className="text-black1 font-inter font-semibold text-xl leading-5 mb-4">
                            Message {nickNameReply && <span>to {nickNameReply}</span>} <span className="text-red1">*</span>
                        </div>
                        <textarea
                            ref={inputContentComment}
                            className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 font-light text-xl"
                            placeholder="Please enter your comment here!"
                            value={content}
                            onChange={handleContentChange}
                            rows={5}
                        />
                        <div className="text-gray-500 text-xl font-inter leading-9 font-normal float-right border-yellow-400">{charCount}/500</div>
                        {messageError && <div className="text-yellow-400 text-xl leading-9 font-normal">{messageError}</div>}
                    </div>
                    {!userAccount && (
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                name=""
                                id=""
                                className="w-5 h-5 rounded-xl mr-2 cursor-pointer"
                                checked={isSaveNickName}
                                onChange={(e) => setIsSaveNickName(e.target.checked)}
                            />{" "}
                            <span className="font-inter text-xl leading-5 font-normal">
                                Save my name in this browser for the next time I comment.
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleSendComment}
                        className="w-full mt-4 px-[16px] py-[12px] text-[18px] justify-center font-semibold text-white flex gap-[12px] items-center rounded-[8px] bg-[#3C7FF5] hover:bg-blue2 hover:text-blue3 transition duration-500 ease-in-out"
                    >
                        <FiSend className="w-[24px] h-[24px]" />
                        <span>Component comment</span>
                    </button>
                </div>
            </div>
        )
    );
};

export default Comments;
