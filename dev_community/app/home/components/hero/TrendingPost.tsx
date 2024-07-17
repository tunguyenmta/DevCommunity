/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Carousel } from "antd";

interface Post {
    id: number;
    title: string;
    content: string;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    totalView: number;
    user:{
       username: string;
       avatar: {
        path: string;
        mediaType: string;
        originalName: string;
       } 
    }
    createdDate: string;
    hashTagList: {
        id: number;
        name: string;
    }[];
}

interface TrendingPostProps {
    posts: Post[];
}

const TrendingPost: React.FC<TrendingPostProps> = ({ posts }) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleRef2 = useRef<HTMLHeadingElement>(null);
    const [trimmedTitle, setTrimmedTitle] = useState(posts[0]?.title || "");
    const [trimmedTitle2, setTrimmedTitle2] = useState(posts[3]?.title || "");
    const titleRef3 = useRef<HTMLHeadingElement>(null);
    const [trimmedTitle3, setTrimmedTitle3] = useState(posts[1]?.title || "");
    const router = useRouter();
    const titleRef4 = useRef<HTMLHeadingElement>(null);
    const [trimmedTitle4, setTrimmedTitle4] = useState(posts[2]?.title || "");

    const [componentsHighlights, setComponentsHighlights] = useState<TrendingPostProps[]>([]);
    useEffect(() => {
        if (posts[0]) {
            const originalTitle = posts[0].title;
            const titleElement = titleRef.current;
            if (titleElement) {
                let currentTitle = originalTitle;
                titleElement.innerText = currentTitle;

                while (titleElement.offsetHeight > 500 && currentTitle.length > 0) {
                    currentTitle = currentTitle.slice(0, -1);
                    titleElement.innerText = currentTitle + "...";
                }

                setTrimmedTitle(titleElement.innerText);
            }
        }
        if (posts[3]) {
            const originalTitle2 = posts[3].title;
            const titleElement2 = titleRef2.current;
            if (titleElement2) {
                let currentTitle = originalTitle2;
                titleElement2.innerText = currentTitle;

                while (titleElement2.offsetHeight > 300 && currentTitle.length > 0) {
                    currentTitle = currentTitle.slice(0, -1);
                    titleElement2.innerText = currentTitle + "...";
                    console.log(titleElement2);
                }

                setTrimmedTitle2(titleElement2.innerText);
            }
        }
        if (posts[1]) {
            const originalTitle3 = posts[1].title;
            const titleElement3 = titleRef3.current;
            if (titleElement3) {
                let currentTitle = originalTitle3;
                titleElement3.innerText = currentTitle;

                while (titleElement3.offsetHeight > 100 && currentTitle.length > 0) {
                    currentTitle = currentTitle.slice(0, -1);
                    titleElement3.innerText = currentTitle + "...";
                }

                setTrimmedTitle3(titleElement3.innerText);
            }
        }
        if (posts[2]) {
            const originalTitle4 = posts[2].title;
            const titleElement4 = titleRef4.current;
            if (titleElement4) {
                let currentTitle = originalTitle4;
                titleElement4.innerText = currentTitle;

                while (titleElement4.offsetHeight > 150 && currentTitle.length > 0) {
                    currentTitle = currentTitle.slice(0, -1);
                    titleElement4.innerText = currentTitle + "...";
                }

                setTrimmedTitle4(titleElement4.innerText);
            }
        }
    }, [posts]);

    return (
        <>
            {posts.length > 0 && (
                <div className="p-40px rounded-40px bg-hero1 shadow-hero1 " id="book-container">
                    <div className=" md:block hidden relative ">
                        <div className="flex ">
                            <div className="p-20px w-[65%]">
                                {posts[0] && (
                                    <Link href={`/detail/${posts[0].id}`}>
                                        <div className="flex items-center p-5 min-h-[532px] group">
                                            <div className="w-[35%]">
                                                <p className="font-bold text-xl leading-6 text-gray1">
                                                    {posts[0].user.username} <span className="font-light text-base leading-5 text-gray1 ml-2">Wrote</span>
                                                </p>
                                                <h2
                                                    ref={titleRef}
                                                    className="break-words mt-4 font-extrabold text-[32px] leading-normal text-black1 hover:text-blue3 transition duration-500 ease-in-out"
                                                >
                                                    {trimmedTitle}
                                                </h2>
                                                <div className="flex gap-2 items-center flex-wrap mt-5">
                                                    In
                                                    {posts[0].hashTagList.map((tag, i) => (
                                                        <span
                                                            className="font-semibold text-lg leading-5 text-blue3 hover:text-black1 transition ease-in-out duration-500 underline"
                                                            key={tag.id}
                                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                router.push(`/articles/hashtag/${tag.id}`);
                                                            }}
                                                        >
                                                            {tag.name}{" "}
                                                            {i < posts[0].hashTagList.length - 1 && <span className="text-black text-lg">,</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[65%] min-h-[500px]">
                                                <div className="w-[95%]">
                                                    <img
                                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + posts[0].cover.path}
                                                        alt={posts[0].title}
                                                        className="w-full object-fill h-full object-center rounded-[16px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-8 w-[35%] group">
                                {posts[1] && <div className="w-3px bg-heroBorderToBottom"></div>}
                                {posts[1] && (
                                    <Link href={`/detail/${posts[1].id}`}>
                                        <div className="p-5 h-full">
                                            <div>
                                                <img
                                                    src={process.env.NEXT_PUBLIC_BASE_IMG_URL + posts[1].cover.path}
                                                    alt={posts[1].title}
                                                    className="w-[496px] h-[323px] rounded-[16px] object-cover"
                                                />
                                            </div>
                                            <p className="font-bold text-xl leading-6 text-gray1 mt-1">
                                                {posts[1].user.username} <span className="font-light text-base leading-5 text-gray1 ml-2">Wrote</span>
                                            </p>
                                            <h2
                                                ref={titleRef3}
                                                className="break-words max-w-[450px] mt-4 font-extrabold text-[30px] leading-normal text-black1 hover:text-blue3 transition duration-500 ease-in-out"
                                            >
                                                {trimmedTitle3}
                                                {/* {posts[1].title} */}
                                            </h2>
                                            <div className="flex gap-2 items-center flex-wrap mt-5">
                                                In
                                                {posts[1].hashTagList.map((tag, i) => (
                                                    <span
                                                        className="font-semibold text-lg leading-5 text-blue3 hover:text-black1 transition ease-in-out duration-500 underline"
                                                        key={tag.id}
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            router.push(`/articles/hashtag/${tag.id}`);
                                                        }}
                                                    >
                                                        {tag.name}{" "}
                                                        {i < posts[1].hashTagList.length - 1 && <span className="text-black text-lg">,</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                        {posts[2] && <div className="h-2px bg-heroSeparateLinear"></div>}
                        <div className="flex py-5">
                            {posts[2] && (
                                <Link className="w-[35%]" href={`/detail/${posts[2].id}`}>
                                    <div className="flex gap-16 px-20px">
                                        <div className="p-5 group">
                                            <div>
                                                <img
                                                    src={process.env.NEXT_PUBLIC_BASE_IMG_URL + posts[2].cover.path}
                                                    alt={posts[2].title}
                                                    className="rounded-[16px] w-[496px] h-[323px] object-cover"
                                                />
                                            </div>
                                            <p className="font-bold text-xl leading-6 text-gray1 mt-1">
                                                {posts[2].user.username} <span className="font-light text-base leading-5 text-gray1 ml-2">Wrote</span>
                                            </p>
                                            <h2
                                                ref={titleRef4}
                                                className="break-words mt-4 font-extrabold text-[32px] leading-normal text-black1 hover:text-blue3 transition duration-500 ease-in-out"
                                            >
                                                {trimmedTitle4}
                                            </h2>
                                            <div className="flex gap-2 items-center flex-wrap mt-5">
                                                In
                                                {posts[2].hashTagList.map((tag, i) => (
                                                    <span
                                                        className="font-semibold text-lg leading-5 text-blue3 hover:text-black1 transition ease-in-out duration-500 underline"
                                                        key={tag.id}
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            router.push(`/articles/hashtag/${tag.id}`);
                                                        }}
                                                    >
                                                        {tag.name}{" "}
                                                        {i < posts[2].hashTagList.length - 1 && <span className="text-black text-lg">,</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {posts[2] && <div className="-translate-y-5 w-3px bg-heroBorderToTop"></div>}

                            <div className="px-[40px] py-20px group w-[64%] overflow-hidden">
                                {posts[3] && (
                                    <Link className="h-full flex items-center" href={`/detail/${posts[3]?.id}`}>
                                        <div className="flex items-center gap-5">
                                            <div className="w-[35%]">
                                                <p className="font-bold text-xl leading-6 text-gray1 mt-1">
                                                    {posts[3]?.user.username}{" "}
                                                    <span className="font-light text-base leading-5 text-gray1 ml-2">Wrote</span>
                                                </p>
                                                <h2
                                                    ref={titleRef2}
                                                    className="break-words mt-4 font-extrabold text-[32px] leading-normal text-black1 hover:text-blue3 transition duration-500 ease-in-out"
                                                >
                                                    {trimmedTitle2}
                                                </h2>
                                                <div className="flex gap-2 items-center flex-wrap mt-5">
                                                    In
                                                    {posts[3]?.hashTagList.map((tag, i) => (
                                                        <span
                                                            className="font-semibold text-lg leading-5 text-blue3 hover:text-black1 transition ease-in-out duration-500 underline"
                                                            key={tag.id}
                                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                router.push(`/articles/hashtag/${tag.id}`);
                                                            }}
                                                        >
                                                            {tag.name}{" "}
                                                            {i < posts[3].hashTagList.length - 1 && <span className="text-black text-lg">,</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[65%] min-h-[500px]">
                                                <div className="w-[95%]">
                                                    <img
                                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + posts[3].cover.path}
                                                        alt={posts[3].title}
                                                        className="w-full object-fill h-full object-center rounded-[16px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="carousel md:hidden block">
                        <Carousel autoplay>
                            {posts.map((item, index) => {
                                return (
                                    <div key={item.id}>
                                        <div className="flex flex-col justify-between ">
                                            <div className="flex items-center">
                                                <Link href={`/detail/${item?.id}`}>
                                                    <h1 className="text-[25px] font-bold text-[#292929]">{item.user.username}</h1>
                                                </Link>
                                                <span className="font-light text-base leading-5 text-gray1 ml-2">Wrote</span>
                                            </div>
                                            <div className="">
                                                <Link href={`/detail/${item?.id}`}>
                                                    <h1 className="text-[25px] font-bold text-[#292929]">{item.title}</h1>
                                                </Link>

                                                <span className="text-[20px] text-[#292929]">In </span>
                                                {item.hashTagList.map((tag, i) => {
                                                    return (
                                                        <span
                                                            className="font-semibold text-lg leading-5 text-[#292929] hover:text-black1 transition ease-in-out duration-500 underline"
                                                            key={tag.id}
                                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                router.push(`/articles/hashtag/${tag.id}`);
                                                            }}
                                                        >
                                                            {tag.name}{" "}
                                                            {i < item.hashTagList.length - 1 && <span className="text-black text-lg"> ,</span>}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Carousel>
                    </div>
                </div>
            )}
        </>
    );
};

export default TrendingPost;
