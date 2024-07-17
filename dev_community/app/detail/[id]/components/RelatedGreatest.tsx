/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { ImFire } from "react-icons/im";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
interface ListRelatedGreatest {
    id: string;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    title: string;
    content: string;
    totalView: number | null;
    createdBy: string;
    createdDate: string;
    hashTagList: {
        id: number;
        name: string;
    }[];
    user: {
        avatar: {
            path: string;
            mediaType: string;
            originalName: string;
        };
    };
}

interface ListRelatedGreatestProps {
    listRelatedGreatests: ListRelatedGreatest[];
}

function extractTextFromHTML(htmlContent: string) {
    const withoutTags = htmlContent.replace(/<[^>]+>/g, "");
    const withoutCSS = withoutTags.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    const withoutJS = withoutCSS.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    const withoutComments = withoutJS.replace(/<!--[\s\S]*?-->/g, "");
    const trimmed = withoutComments.trim();
    let dot: number[] = [];
    trimmed.split("").forEach((item, index) => {
        if (item === ".") dot.push(index);
    });
    return trimmed.slice(0, dot[1]);
}

const RelateGreatest: React.FC<ListRelatedGreatestProps> = ({ listRelatedGreatests }) => {
    const router = useRouter();

    const truncateText = (text: string, maxlength: number) => {
        if (text.trim().length > maxlength) {
            return text.slice(0, maxlength) + "...";
        }
        return text;
    };

    if (!listRelatedGreatests || listRelatedGreatests.length === 0) {
        return "";
    }
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        event.preventDefault();
        event.stopPropagation();
        router.push(`/articles/hashtag/${id}`);
    };

    return (
        <div>
            <div className="flex items-center gap-4 mt-2">
                <div className="h-[2px] w-[150px] border-2 border-black"></div>
                <h2 className="sm:text-4xl text-2xl font-semibold">Related greatest</h2>
            </div>

            <div className="w-full ml-[170px] mt-12 mb-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                {listRelatedGreatests.map((item, index) => (
                    <Link key={item.id} href={`/detail/${item.id}`} className="sm:w-[700px]">
                        <div className={`justify-start items-start gap-5 flex group ${index >= 2 ? "mt-20" : ""}`}>
                            <div className="w-auto flex justify-center">
                                {item.user.avatar ? (
                                    <img
                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + item.user.avatar.path}
                                        alt={item.title}
                                        className="sm:w-[96px] sm:h-[96px] object-cover border-[5px] rounded-[16px] border-blue3 rotate-[18deg] group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                                    />
                                ) : (
                                    <Avatar
                                        name={item.createdBy.split("")[0]}
                                        className="sm:w-[96px] sm:h-[96px] object-cover border-[5px] border-blue3 rounded-[16px] rotate-[18deg] group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                                        color="#FFD8BF"
                                        style={{
                                            border: "none",
                                            boxSizing: "content-box",
                                        }}
                                    />
                                )}
                            </div>

                            <div className="flex-col justify-start items-start gap-4 inline-flex">
                                <div className="justify-start items-start gap-3 inline-flex">
                                    <div className="text-blue3 text-xl leading-6 font-semibold">{item.createdBy}</div>
                                    <div className="w-[65%] text-base text-gray1 font-light leading-6">Wrote</div>
                                    {item.totalView && item.totalView > 999 && (
                                        <div className="px-3 py-1 rounded-sm justify-center items-center gap-2.5 flex">
                                            <div className="w-3.5 h-4 flex-col justify-center items-center inline-flex text-red1">
                                                <ImFire />
                                            </div>
                                            <div className="text-center text-sm font-normal leading-snug text-red1">{item.totalView} view</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-col justify-center items-start gap-6 flex">
                                    <div className="w-536px text-black1 text-32px font-bold capitalize hover:text-blue3 cursor-pointer">
                                        {truncateText(item.title, 50)}
                                    </div>
                                    <div className="w-536px text-black1 text-xl font-light">
                                        {truncateText(extractTextFromHTML(item.content), 120)}
                                    </div>
                                </div>
                                <div className="mt-2 ms-4 flex-wrap items-center gap-2.5 flex">
                                    {item.createdDate.split("T")[0]} in
                                    {item.hashTagList.map((tag, index) => (
                                        <button
                                            key={tag.id}
                                            className="underline font-semibold hover:bg-white hover:text-blue3 transition duration-500 ease-in-out no"
                                            onClick={(e) => handleButtonClick(e, tag.id)}
                                            style={{
                                                display: index < 4 || (index % 4 === 0 && index >= 4) ? "block" : "none",
                                            }}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelateGreatest;
