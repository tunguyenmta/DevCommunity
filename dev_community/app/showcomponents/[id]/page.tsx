/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { TfiAlarmClock } from "react-icons/tfi";
import HashtagList from "../components/HashtagList";
import CodeEditorr from "../components/CodeEditor";
import CategoryCmp from "../components/CategoryCmp";
import { useEffect, useRef, useState } from "react";
import Changelog from "../components/Changelog";
import Comments from "../components/Comments";
import Image from "next/image";
import comment from "../../../public/asstets/icons/Themes (13)/vuesax/linear/coment.png";
import heart from "../../../public/asstets/icons/Themes (13)/vuesax/linear/heart.svg";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import jwt from "jsonwebtoken";
import { useAppContext } from "@/app/utils/contextProvider";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

interface UserProps {
    id: string;
    sub: string;
    email: string;
    avatar: string;
    auth: string;
    exp: number;
    iat: number;
}

const fetchComponentComment = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/comments/component/${id}`, {
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

const Page = ({ params }: { params: { id: string } }) => {
    const [data, setData] = useState<ShowComponentDetail | undefined>(undefined);
    const [comments, setComments] = useState([]);
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const changelogRef = useRef<HTMLDivElement>(null);
    const [userId, setUserId] = useState<string | "">("");
    const [nickNameDefault, setNickNameDefault] = useState("");
    const [liked, setLiked] = useState(false);
    const [countLike, setCountLike] = useState(0);
    const [listIpClientLiked, setListIpClientLiked] = useState<string[]>([]);
    const [totalComment, setTotalComment] = useState(0);
    const { userToken } = useAppContext();
    const [userAccount, setUserAccount] = useState<UserProps | null>(null);
    const commentsRef = useRef<HTMLDivElement>(null);

    const handleViewClick = () => {
        setShow(!show);
        if (!show && changelogRef.current) {
            changelogRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/components/${params?.id}`, {
                    headers: {
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                        Expires: "0",
                        ipClient: userId,
                    },
                    cache: "no-store",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const results = await response.json();
                setData(results);
                setListIpClientLiked(results.listIpClientLiked);
                setTotalComment(results.totalComment);
                setNickNameDefault(results.nickNameDefault);
                const commentsData = await fetchComponentComment(params.id);
                setComments(commentsData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, userId]);

    useEffect(() => {
        const checkCommentsRender = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("newcomment") && data && commentsRef.current) {
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
    }, [data, comments]);

    // Handle like component
    const handleLike = async () => {
        try {
            const headers: { [key: string]: string } = {
                "Content-Type": "application/json",
                ipClient: userId,
            };

            if (userToken) {
                headers["Authorization"] = `Bearer ${userToken}`;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/likes/component/${data?.id}`, {
                method: "POST",
                headers: headers,
            });

            if (!response.ok) {
                console.error("Failed to like the component", response.status, response.statusText);
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
            console.error("Error liking the component:", error);
        }
    };

    useEffect(() => {
        if (userToken) {
            const decodedToken = jwt.decode(userToken) as UserProps;
            if (decodedToken) {
                setUserAccount(decodedToken);
            }
        }
    }, []);

    // Check Liked
    useEffect(() => {
        if (userAccount) {
            if (listIpClientLiked.includes(userAccount.sub)) {
                setLiked(true)
            }
        } else if (listIpClientLiked.includes(userId)) {
            setLiked(true);
        }
        setCountLike(listIpClientLiked.length);
    }, [listIpClientLiked, userId]);

    const getUserId = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setUserId(result.visitorId);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            getUserId()
        }
    }, []);

    if (loading)
        return (
            <div className="text-center h-screen w-full max-w-[1192px] p-6 md:0">
                <h1 className="text-left text-[50px] font-bold text-gray-200 dark:text-gray-300">SHSOFTVINA</h1>
                <p className="w-48 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-full h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-64 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-4/5 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-48 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-full h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-64 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                <p className="w-4/5 h-5 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
            </div>
        );

    if (error) return <div className="text-black text-center flex items-center">Error: {error}</div>;

    return (
        <div>
            <Changelog show={show} handle={handleViewClick} paramsId={params.id} />
            <div>
                <CategoryCmp
                    examples={
                        data?.examples.map((item) => ({
                            id: item.id,
                            title: item.title,
                        })) || []
                    }
                />
            </div>

            <div className="h-full max-w-[1192px] rounded-lg px-6 md:0">
                <div>
                    <div className=" md:hidden block">
                        <Link href='/showcomponents' className="flex items-center">
                            <IoIosArrowBack className="size-5" /><p className="text-[20px]">Back</p>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-[24px] md:text-[46px] font-bold mx-w-[100px]">{data?.title}</h1>
                        <button
                            type="button"
                            className="flex gap-2 px-4 py-2 rounded-lg border border-gray-300 outline-none hover:bg-gray-200 transition-all duration-300"
                            onClick={handleViewClick}
                        >
                            <span>
                                <TfiAlarmClock size={20} />
                            </span>
                            <p className="font-semibold text-gray-500">Changelog</p>
                        </button>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: data?.description || "",
                        }}
                    ></div>
                </div>

                <div className="mb-[56px] mt-[24px]">
                    <HashtagList
                        hashTagList={
                            data?.hashTagList?.map((item) => ({
                                id: item.id,
                                name: item.name,
                            })) || []
                        }
                        componentId={data?.id}
                    />
                </div>
                <div className="mb-[56px] mt-[24px]">
                    <h1 id="whentouse" className="text-[25px] leading-[30px] font-bold">
                        When to use
                    </h1>
                    <div className="my-5">
                        <div className="flex items-center gap-4">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data?.whenToUse || "",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 id="examples" className="text-[25px] leading-[30px] font-bold mb-6">
                        Examples
                    </h1>
                    <div className="my-5">
                        <CodeEditorr />
                    </div>

                    <div id="commnent" className="w-full h-12 mb-8">
                        <div className="flex justify-start items-center gap-6">
                            <div className="px-2 py-3 rounded-sm flex justify-center items-center gap-3 cursor-pointer" onClick={handleLike}>
                                <Image src={heart} alt="" className={`size-7 ${liked ? "red-heart" : ""}`}></Image>
                                <div
                                    className={`text-black1 text-2xl font-normal font-inter leading-tight whitespace-nowrap ${liked ? "text-red-500" : "text-black1"
                                        }`}
                                >
                                    {countLike}
                                </div>
                            </div>
                            <div className="pr-4 py-3 rounded-sm flex justify-center items-center gap-3">
                                <Image src={comment} alt="comment" className="size-7 "></Image>
                                <div className="text-black1 text-2xl font-normal font-inter leading-snug whitespace-nowrap">{totalComment}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-[1px] w-full"></div>

                    <div>
                        <Comments
                            userToken={userToken}
                            comments={comments}
                            anonymousNameDefault={nickNameDefault ?? ""}
                            commentPermission={""}
                            componentId={params.id}
                            userId={userId}
                            userAccount={userAccount ? userAccount : null}
                        ></Comments>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
