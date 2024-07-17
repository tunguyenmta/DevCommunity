/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React from "react";
import { VscFlame } from "react-icons/vsc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import messageIcon from "../../../public/asstets/icons/Themes (13)/vuesax/linear/message-square.svg";
import scanIcon from "../../../public/asstets/icons/Themes (13)/vuesax/linear/scan.svg";
import "./CarouselArticle.css";
interface Post {
    id: number;
    title: string;
    content: string;
    cover: string;
    totalView: number;
    createdDate: string;
    user: {
        username: string;
        avatar: string;
    };
    hashTagList: {
        name: string;
        id: number;
    }[];
    readMediumTime: number;
    totalComment: number;
}

function extractTextFromHTML(htmlContent: string) {
    // Remove HTML tags and CSS
    const withoutTags = htmlContent.replace(/<[^>]+>/g, "");

    // Remove CSS
    const withoutCSS = withoutTags.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

    // Remove JavaScript
    const withoutJS = withoutCSS.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

    // Remove comments
    const withoutComments = withoutJS.replace(/<!--[\s\S]*?-->/g, "");

    // Trim excess whitespace
    const trimmed = withoutComments.trim();
    let dot: number[] = [];
    trimmed.split("").forEach((item, index) => {
        if (item == ".") dot.push(index);
    });
    // Return the extracted text
    return trimmed.slice(0, dot[3]);
}

const CardPost: React.FC<Post> = ({
    id,
    title,
    content,
    cover,
    totalView,
    createdDate,
    hashTagList,
    readMediumTime,
    totalComment,
    user,
}) => {
    const router = useRouter();
    return (
        <Link href={`/detail/${id}`}>
            <div className="py-[24px] group">
                <div className="sm:flex sm:items-center">
                    <div className="sm:w-[1180px] w-[380px]">
                        <div className="sm:flex gap-5">
                            <div className="w-[102px] mb-6">
                                {user.avatar ? (
                                    <img
                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + JSON.parse(user.avatar).path}
                                        alt={title}
                                        className="shadow-avatarShadow w-[96px] h-[96px] object-cover border-[5px] border-blue3 rotate-[20deg] rounded-[16px]  group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                                    />
                                ) : (
                                    <Avatar
                                        name={user.username.split("")[0]}
                                        className="w-[96px] h-[96px] object-cover border-[5px] border-blue3 rounded-[16px] rotate-[10deg] group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                                        color="#FFD8BF"
                                        style={{
                                            border: "none",
                                            boxSizing: "content-box",
                                        }}
                                    />
                                )}
                            </div>
                            <div className="sm:w-[870px]">
                                <div className="flex justify-between items-center w-2/3">
                                    <h3 className="font-semibold text-[20px] leading-[24px]">
                                        {user.username} <span className="text-gray2 font-light text-[16px] leading-[19px] ml-1">Wrote</span>
                                    </h3>
                                    {totalView > 1000 && (
                                        <div className="flex items-center text-red1 font-medium">
                                            <p>
                                                <VscFlame />
                                            </p>
                                            <p>
                                                {totalView} {totalView > 1 ? "views" : "view"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <h2 className="sm:break-words text-wrap sm:max-w-[700px] sm:text-42px sm:leading-[49px] text-2xl font-semibold pt-3 group-hover:text-blue3 transition duration-500 ease-in-out">
                                    {title.length > 100 ? title.substring(0, 100) + "..." : title}
                                </h2>
                                <p className="w-5/6 py-16px font-light">
                                    {extractTextFromHTML(content).length > 200
                                        ? `${extractTextFromHTML(content).substring(0, 200)}...`
                                        : extractTextFromHTML(content)}
                                </p>
                                <div className="flex gap-4 items-center py-16px ">
                                    <h4 className="text-black1 text-[16px] leading-[19px] font-light">{createdDate.split("T")[0]} in</h4>
                                    <div className="flex gap-2 flex-wrap max-w-3/4">
                                        {hashTagList &&
                                            hashTagList.map((d, i) => (
                                                <React.Fragment key={d.id}>
                                                    <button
                                                        style={{ textUnderlineOffset: "4px", textDecorationThickness: "2px" }}
                                                        className="underline font-semibold text-base hover:bg-white hover:text-blue3 hover:border-blue3 transition duration-500 ease-in-out"
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            router.push(`/articles/hashtag/${d.id}`);
                                                        }}
                                                    >
                                                        {d.name}
                                                    </button>
                                                    {i < hashTagList.length - 1 && <span className="text-[18px]">, </span>}
                                                </React.Fragment>
                                            ))}
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            router.push(`/detail/${id}`);
                                        }}
                                        className="text-blue3 font-semibold hidden sm:block"
                                    >
                                        Read more...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[190px] text-[18px]" id="colored-icon">
                        <div className="w-full flex items-center gap-4 py-2">
                            <Image src={scanIcon} alt="min to read" className="colored-icon"></Image>
                            <p className="font-semibold">
                                {readMediumTime} {readMediumTime > 1 ? "mins" : "min"} read
                            </p>
                        </div>
                        <div className="w-full flex items-center gap-4 py-2">
                            <Image src={messageIcon} alt="comment" className="colored-icon"></Image>
                            <p className="font-semibold">
                                {totalComment} {totalComment > 1 ? "comments" : "comment"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CardPost;
