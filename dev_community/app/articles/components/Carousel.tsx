/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { RxTrackNext } from "react-icons/rx";
import { VscFlame } from "react-icons/vsc";
import "./CarouselArticle.css";
import Link from "next/link";
import Avatar from "react-avatar";
interface TrendingPost {
    id: number;
    title: string;
    content: string;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    user: {
        username: string;
        avatar: {
            path: string;
            mediaType: string;
            originalName: string;
        };
    };
    totalView: number;
    createdDate: string;
    hashTagList: {
        id: number;
        name: string;
    }[];
}

const fetchPostTrending = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/post/hot-topic`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch tags");
    }
    return res.json();
};
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
    return trimmed.slice(0, dot[2]);
}
const CarouselHero = () => {
    const [listTrending, setListTrending] = useState<TrendingPost[]>([]);
    const [isShowDots, setIsShowDots] = useState<boolean>(false);

    const handleResize = () => {
        setIsShowDots(window.innerWidth >= 640);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsShowDots(window.innerWidth >= 640);
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    useEffect(() => {
        fetchPostTrending().then((data) => {
            setListTrending(data);
        });
    }, []);

    return (
        <>
            {listTrending.length > 0 ? (
                <div id="trending-carousel" className="carousel p-38px bg-TrendingCarousel rounded-40px shadow-trendingCarousel overflow-hidden">
                    <Carousel autoplay dots={isShowDots}>
                        {listTrending.map((item: TrendingPost) => {
                            return (
                                <div key={item.id}>
                                    <div className="sm:w-[1288px]">
                                        <h5 className="sm:text-[20px] sm:leading-[24px]">Category</h5>
                                        <h2 className="sm:pb-56px sm:text-[60px] sm:leading-[73px] font-semibold">Articles</h2>
                                        <div className="sm:flex sm:items-center sm:gap-20px sm:h-[252px]">
                                            <div className="sm:w-[280px] flex justify-center mb-4 sm:mb-0">
                                                {item.user.avatar ? (
                                                    <img
                                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + item.user.avatar.path}
                                                        alt={item.title}
                                                        className="shadow-avatarShadow sm:w-[200px] sm:h-[200px] w-[100px] h-[100px] object-cover rounded-[16px] rotate-[-18deg] border-[5px] border-blue3"
                                                    />
                                                ) : (
                                                    <Avatar
                                                        name={item.user.username.split("")[0]}
                                                        className="sm:w-[200px] sm:h-[200px] object-cover rounded-[16px] rotate-[-18deg] border-[5px] border-blue3"
                                                        color="#FFD8BF"
                                                        style={{
                                                            border: "none",
                                                            boxSizing: "content-box",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="sm:w-[1000px]">
                                                <div className="flex gap-20 items-center ">
                                                    <h3 className="text-blue3 font-semibold text-[20px] leading-[24px]">
                                                        {item.user.username}{" "}
                                                        <span className="text-gray2 font-light text-[16px] leading-[19px] ml-1">Wrote</span>
                                                    </h3>
                                                    {item.totalView > 1000 && (
                                                        <div className="flex items-center gap-3 text-red1 font-medium">
                                                            <p>
                                                                <VscFlame />
                                                            </p>
                                                            <p>
                                                                {item.totalView} {item.totalView > 1 ? "views" : "view"}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <h2 className="break-words sm:text-48px text-xl font-semibold pt-3 sm:leading-56px">
                                                    {item.title.length > 100 ? `${item.title.substring(0, 100)}...` : item.title}
                                                </h2>
                                                <div className="flex gap-4 items-center pt-16px">
                                                    <h4 className="text-black font-light font-light mr-3 text-[16px] leading-[24px] text-nowrap">
                                                        {item.createdDate.split("T")[0]} in
                                                    </h4>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {item.hashTagList.map((d, i) => {
                                                            return (
                                                                <Link
                                                                    href={`/articles/hashtag/${d.id}`}
                                                                    className="btn px-12px py-7px bg-yellow1 text-white rounded-[8px] font-[400] text-[16px] leading-[24px] hover:bg-blue3 hover:text-white transition duration-500 ease-in-out"
                                                                    key={d.id}
                                                                >
                                                                    {d.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:pt-[24px] mb-4">
                                            <p className="h-80px sm:text-21px text-base font-normal">
                                                {extractTextFromHTML(item.content).length > 100
                                                    ? `${extractTextFromHTML(item.content).substring(0, 100)}...`
                                                    : extractTextFromHTML(item.content)}
                                            </p>
                                            <Link href={`/detail/${item.id}`}>
                                                <button className="border-b-2 p-2 border-b-blue3 flex sm:text-[18px] items-center gap-2 font-medium text-[#515151] group hover:text-blue3 hover:border-b-transparent transition duration-500 ease-in-out">
                                                    Continue Reading
                                                    <RxTrackNext />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            ) : null}
        </>
    );
};

export default CarouselHero;
