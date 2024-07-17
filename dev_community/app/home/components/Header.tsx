"use client";
import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Searchbar from "./Searchbar";
import jwt from "jsonwebtoken";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Context, useAppContext } from "@/app/utils/contextProvider";
import { BiLogInCircle } from "react-icons/bi";
import Avatar from "react-avatar";
import Image from "next/image";
import iconDashboard from "../../../public/asstets/icons/Themes (13)/vuesax/linear/element-3.svg";
import iconSetting from "../../../public/asstets/icons/Themes (13)/vuesax/linear/setting-2.svg";
import iconHeart from "../../../public/asstets/icons/Themes (13)/vuesax/linear/heart-noti.svg";
import iconComment from "../../../public/asstets/icons/Themes (13)/vuesax/linear/comment-noti.svg";
import iconShare from "../../../public/asstets/icons/Themes (13)/vuesax/linear/share-noti.svg";
import iconArticle from "../../../public/asstets/icons/Themes (13)/vuesax/linear/article-noti.svg";
import iconComponent from "../../../public/asstets/icons/Themes (13)/vuesax/linear/component-noti.svg";
import iconProfile from "../../../public/asstets/icons/Themes (13)/vuesax/linear/setting-noti.svg";
import { FaRegBell } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { parseISO, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import MenuMobile from "./MenuMobile";
import NotificationMenuMobile from "./mobile/NotiMenuProfileMobile";
import { useActiveItem } from "@/app/utils/ActiveItemContext";
import { differenceInSeconds } from "date-fns";
type ActionKeys = keyof typeof actionMappings;

const actionMappings = {
    PASSWORD_CHANGE: { text: "Password changed", icon: iconProfile },
    CREATE_COMPONENT: { text: "Component created", icon: iconComponent },
    UPDATE_COMPONENT: { text: "Component updated", icon: iconComponent },
    DELETE_COMPONENT: { text: "Component deleted", icon: iconComponent },
    CREATE_POST: { text: "New article created", icon: iconArticle },
    UPDATE_POST: { text: "Article updated", icon: iconArticle },
    DELETE_POST: { text: "Article deleted", icon: iconArticle },
    POST_SHARE: { text: "Article shared", icon: iconShare },
    COMPONENT_SHARE: { text: "Component shared", icon: iconShare },
    NEW_AND_REPLY_COMMENT_POST: { text: "New comment", icon: iconComment },
    NEW_AND_REPLY_COMMENT_COMPONENT: { text: "New comment", icon: iconComment },
    POST_LIKED: { text: "Article liked", icon: iconHeart },
    COMPONENT_LIKED: { text: "Component liked", icon: iconHeart },
};

const getNotificationTextAndIcon = (action: string) => {
    const key = Object.keys(actionMappings).find((k) => action.includes(k)) as ActionKeys | undefined;
    if (key) {
        return actionMappings[key];
    }
    return { text: "Unknown action", icon: iconProfile };
};

interface UserProps {
    id: string;
    sub: string;
    email: string;
    avatar: string;
    auth: string;
    exp: number;
    iat: number;
}

interface Notification {
    id: string;
    href: string;
    createdDate: string;
    action: string;
    read: boolean;
    message: string;
    metadata: {
        actor: string;
        message: string;
        title: string;
        time?: string;
    };
}

const fetchCountNotification = async (tokenUser: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/notifications/count/unread`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notification count");
    }
    const data = await res.json();
    return data;
};

const fetchNotifications = async (tokenUser: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/notifications`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notification count");
    }
    const data = await res.json();
    return data;
};

const fetchReadAll = async (tokenUser: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/notifications/update-read-all`, {
        method: "PUT",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notification count");
    }
};

const fetchReadEach = async (tokenUser: string, notificationId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/notifications/update-unread/${notificationId}`, {
        method: "PUT",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notification count");
    }
};

const Header: React.FC = () => {
    const { userToken, refreshToken, setUserToken } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();
    const userId = useContext(Context);
    const notiRef = useRef<HTMLDivElement>(null);
    const [userAccount, setUserAccount] = useState<UserProps | null>(() => {
        const now = new Date();
        const decodedToken = jwt.decode(userToken) as UserProps | null;
        if (!decodedToken) {
            return null;
        } else {
            const expiresAt = new Date(decodedToken.exp * 1000);

            if (differenceInSeconds(expiresAt, now) < 1) {
                return null;
            } else {
                return decodedToken;
            }
        }
    });
    const [countNotification, setCountnotification] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isShowNoti, setIsshowNoti] = useState(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const items: MenuProps["items"] = [
        {
            label: (
                <Link href="/posts" className="flex items-center">
                    <Image src={iconDashboard} alt="" className="size-5 mr-2"></Image>
                    Dashboard
                </Link>
            ),
            key: "0",
        },
        {
            label: userAccount ? (
                <Link href={`/editProfile/${userAccount.id}`} className="flex items-center">
                    <Image src={iconSetting} alt="" className="size-5 mr-2"></Image> Edit Profile
                </Link>
            ) : (
                <></>
            ),
            key: "1",
        },
        {
            type: "divider",
        },
        {
            label: (
                <div className="flex items-center text-red1">
                    <AiOutlineLogout className="size-5 mr-2" /> Log Out
                </div>
            ),
            key: "3",
            onClick: async () => {
                const res = await fetch("http://localhost:3000/pages/api/auth", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    setUserToken("");
                    setUserAccount(null);
                    router.push("/");
                } else {
                    console.error("Logout failed");
                }
            },
        },
    ];

    const updateIP = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/ips`, {
            headers: {
                "Content-Type": "application/json",
                ipClient: String(userId.userId),
            },
            body: JSON.stringify({}),
            method: "POST",
        });
    };

    const handleShowNoti = () => {
        setIsshowNoti(!isShowNoti);
    };
    const handleShowMenu = () => {
        setShowMenu(!showMenu);
    };
    useEffect(() => {
        if (userToken) {
            const decodedToken = jwt.decode(userToken) as UserProps;
            if (decodedToken && decodedToken.exp * 1000 > new Date().getTime()) {
                setUserAccount(decodedToken);
            } else {
                setUserAccount(null);
                router.push("/");
                router.refresh();
            }
        } else {
            setUserAccount(null);
        }
    }, [userToken]);

    useEffect(() => {
        if (String(userId.userId) != "") {
            updateIP();
        }
    }, [userId]);

    const formatTimeAgo = (dateString: string) => {
        const date = parseISO(dateString);
        const minutesDifference = differenceInMinutes(new Date(), date);
        const hoursDifference = differenceInHours(new Date(), date);
        const daysDifference = differenceInDays(new Date(), date);

        if (minutesDifference < 60) {
            return `${minutesDifference} minute${minutesDifference !== 1 ? "s" : ""} ago`;
        } else if (hoursDifference < 24) {
            return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
        } else {
            return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
        }
    };

    const handleMarkAllAsRead = (event: React.MouseEvent<HTMLParagraphElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (userToken) {
            fetchReadAll(userToken)
                .then(() => {
                    setCountnotification(0);
                    setNotifications((prevNotifications) =>
                        prevNotifications.map((notification) => ({
                            ...notification,
                            read: true,
                        }))
                    );
                })
                .catch((error) => {
                    console.error("Failed to mark all notifications as read:", error);
                });
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setIsshowNoti(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notiRef]);

    const handleReadEach = (notificationId: string) => {
        if (userToken && notificationId) {
            fetchReadEach(userToken, notificationId)
                .then(() => {})
                .catch((error) => {
                    console.error("Failed to mark all notifications as read:", error);
                });
        }
    };

    useEffect(() => {
        const decodedToken = jwt.decode(userToken) as UserProps;

        if (decodedToken && decodedToken.exp * 1000 > new Date().getTime()) {
            fetchCountNotification(userToken)
                .then((count: number) => {
                    setCountnotification(count);
                })
                .catch((error) => {
                    console.error("Failed to fetch notification count:", error);
                    setCountnotification(0);
                });
            fetchNotifications(userToken)
                .then((data) => {
                    setNotifications(data);
                })
                .catch((error) => {
                    console.error("Failed to fetch notifications:", error);
                    setNotifications([]);
                });
        }
    }, []);

    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}ws`);
        const stompClient: CompatClient = Stomp.over(socket);

        stompClient.connect(
            {},
            (frame: any) => {
                stompClient.subscribe(`/topic/notification/global/${userAccount?.id}`, (message) => {
                    if (message.body) {
                        const newNotification = JSON.parse(message.body);
                        const notificationWithRead = {
                            ...newNotification,
                            read: false,
                        };

                        setNotifications((prevNotifications) => [notificationWithRead, ...prevNotifications]);
                        setCountnotification((prevCount) => prevCount + 1);
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
    }, [userAccount?.id]);

    const { activeHeader, setActiveHeader } = useActiveItem();

    useEffect(() => {
        const pathParts = pathname.split("/");
        if (pathParts[1] === "showcomponents") {
            setActiveHeader("component");
        } else if (pathParts[1] === "detail") {
            setActiveHeader("articles");
        } else {
            setActiveHeader(pathParts[1]);
        }
    }, [pathname]);
    const [showHeader, setShowHeader] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            setShowHeader(scrollTop === 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div
                className={`pb-5 md:pb-0 w-full sticky top-0 left-0 right-0 transition-opacity duration-300  ${
                    showHeader ? "opacity-100 z-30" : "opacity-0 z-20"
                }`}
            >
                <div className="bg-white py-20px px-6 ">
                    <div className="flex justify-between  gap-0 md:gap-20  items-center">
                        <div className="flex items-center w-full gap-0 ">
                            <div className="flex justify-center items-center gap-x-8">
                                <div
                                    onClick={handleShowMenu}
                                    className="w-6 h-5 flex flex-col justify-between items-center md:hidden text-4xl text-black cursor-pointer overflow-hidden group"
                                >
                                    <span className="w-full h-[2px] bg-black inline-flex transform group-hover:-translate-x-2 transition-all ease-in-out duration-300"></span>
                                    <span className="w-full h-[2px] bg-black inline-flex transform -translate-x-3 group-hover:-translate-x-0 transition-all ease-in-out duration-300"></span>
                                    <span className="w-full h-[2px] bg-black inline-flex transform -translate-x-1 group-hover:-translate-x-3 transition-all ease-in-out duration-300"></span>
                                </div>
                                <div className="flex justify-start">
                                    <Link href="/" className={`${activeHeader === "/" && ""}`} onClick={() => setActiveHeader("/")}>
                                        <h2 className="font-inter text-[25px]  md:text-[40px] leading-[48px] font-bold text-blueLogo">SHSOFTVINA</h2>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full md:block hidden ml-20">
                                <Link
                                    className={`mr-32px text-25px leading-30px font-bold font-inter hover:text-blue3 transition duration-500 ease-in-out ${
                                        activeHeader === "articles" ? "text-blue3" : ""
                                    }`}
                                    href="/articles"
                                    passHref
                                    onClick={() => setActiveHeader("articles")}
                                >
                                    Articles
                                </Link>

                                <Link
                                    className={`text-25px leading-30px font-bold font-inter hover:text-blue3 transition duration-500 ease-in-out ${
                                        activeHeader === "component" ? "text-blue3" : ""
                                    }`}
                                    href="/showcomponents"
                                    passHref
                                    onClick={() => setActiveHeader("component")}
                                >
                                    Component
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-end w-full gap-2 md:gap-8 ">
                            <div className="hidden xl:block">
                                <Searchbar isInHeader={true} />
                            </div>
                            {userAccount != null && (
                                <div className="md:block hidden z-20">
                                    <div className="flex items-center flex-col relative" onClick={handleShowNoti} ref={notiRef}>
                                        <FaRegBell className="size-6 cursor-pointer" />
                                        <p className="font-normal text-base leading-6 text-disable cursor-pointer">Notifications</p>
                                        {countNotification != 0 && (
                                            <p className="absolute bottom-10 left-14 text-white p-[0px_6px_0px_6px] bg-red1 rounded-[8px] cursor-pointer">
                                                {countNotification}
                                            </p>
                                        )}
                                        {isShowNoti && (
                                            <div className="bg-white w-[520px] h-[650px] shadow-lg rounded-xl absolute right-16 top-14 p-4">
                                                <div className="flex items-center justify-between p-4">
                                                    <p className="font-bold text-xl leading-6 text-black1">Notifications</p>
                                                    <p
                                                        className="cursor-pointer text-blue3 font-semibold text-base"
                                                        onClick={(event) => handleMarkAllAsRead(event)}
                                                    >
                                                        Mark all as read
                                                    </p>
                                                </div>
                                                <div className="max-h-[550px] overflow-y-auto overflow-x-hidden mt-2">
                                                    {notifications.length > 0 &&
                                                        notifications.map((notification) => {
                                                            const { text, icon } = getNotificationTextAndIcon(notification.action);
                                                            return (
                                                                <a
                                                                    onClick={(e) => {
                                                                        if (!notification.href) {
                                                                            e.preventDefault();
                                                                            if (notification.action.includes("POST")) {
                                                                                toast.error("POST has been delete!", {
                                                                                    position: "top-center",
                                                                                    autoClose: 2000,
                                                                                });
                                                                            } else if (notification.action.includes("COMPONENT")) {
                                                                                toast.error("COMPONENT has been delete!", {
                                                                                    position: "top-center",
                                                                                    autoClose: 2000,
                                                                                });
                                                                            }
                                                                        }
                                                                    }}
                                                                    href={
                                                                        notification.href
                                                                            ? notification.href
                                                                                  .replace("{baseHrefComponent}", "/showcomponents")
                                                                                  .replace("{baseHrefPost}", "/detail") +
                                                                              (text == "New comment" ? "?newcomment" : "")
                                                                            : ""
                                                                    }
                                                                    key={Math.floor(Math.random() * 1000000)}
                                                                >
                                                                    <div
                                                                        onClick={() => handleReadEach(notification.id)}
                                                                        className={`hover:bg-[#F7F9FB] mt-2 transition ease-in-out duration-500 flex items-start justify-start w-full cursor-pointer p-4 rounded-3xl ${
                                                                            notification.read == false && "bg-gray4"
                                                                        }`}
                                                                    >
                                                                        <Image src={icon} alt="" className="size-12 mr-4" />
                                                                        <div className="w-full">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <p className="font-semibold text-base leading-5 text-black1">
                                                                                    {text}
                                                                                </p>
                                                                                <p className="font-normal text-base leading-5 text-disable">
                                                                                    {formatTimeAgo(notification.createdDate)}
                                                                                </p>
                                                                            </div>
                                                                            <p className="font-normal text-base leading-5 text-secondary mt-1">
                                                                                {notification.message
                                                                                    .replace("{actor}", notification.metadata.actor)
                                                                                    .replace("{message}", notification.metadata?.message)
                                                                                    .replace("{title}", notification.metadata?.title)
                                                                                    .replace(
                                                                                        "{time}",
                                                                                        notification.metadata?.time?.split("T")[0] || ""
                                                                                    )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {userAccount === null ? (
                                <>
                                    <Link href="/login" className="ml-0 md:ml-5">
                                        <p className="flex items-center btn border border-blue3 rounded-md md:py-[15px] md:px-8 px-2 py-2 text-xl font-inter text-white font-semibold leading-6 bg-blue3  hover:bg-white hover:text-blue3 transition duration-500 ease-in-out">
                                            <BiLogInCircle className="size-6 mr-1 " /> <span className="md:text-xl text-sm">Login</span>
                                        </p>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="md:block hidden">
                                        <div className="flex justify-center items-center mb-0 md:mb-5 ">
                                            {userAccount.avatar ? (
                                                <Link href="#">
                                                    <img
                                                        className="w-12 h-12 max-w-12 rounded-full ml-2 border"
                                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + JSON.parse(userAccount.avatar).path}
                                                        alt="avatar"
                                                    />
                                                </Link>
                                            ) : (
                                                <Avatar
                                                    name={userAccount.sub.split("")[0]}
                                                    size="40"
                                                    className="rounded-[50%]"
                                                    textSizeRatio={2.2}
                                                    color="#FFD8BF"
                                                    fgColor="#FA541C"
                                                />
                                            )}
                                            <Dropdown menu={{ items }} trigger={["click"]} className="ml-2">
                                                <div onClick={(e) => e.preventDefault()}>
                                                    <Space className="text-18px font-normal font-inter leading-relaxed text-gray-600">
                                                        {userAccount.sub}
                                                        <DownOutlined style={{ width: "15px" }} />
                                                    </Space>
                                                </div>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <NotificationMenuMobile />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="w-full xl:hidden block pt-3">
                        <Searchbar isInHeader={true} />
                    </div>
                </div>
            </div>
            <MenuMobile showMenu={showMenu} handleShowMenu={handleShowMenu} />
        </>
    );
};

export default Header;
