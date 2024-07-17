import Link from "next/link"
import React, { useState, useEffect, useContext, useRef } from "react";
import { CgProfile } from "react-icons/cg"
import { IoNotificationsSharp } from "react-icons/io5"
import iconHeart from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/heart-noti.svg";
import iconComment from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/comment-noti.svg";
import iconShare from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/share-noti.svg";
import iconArticle from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/article-noti.svg";
import iconComponent from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/component-noti.svg";
import iconProfile from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/setting-noti.svg";
import { parseISO, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { Context, useAppContext } from "@/app/utils/contextProvider";
import { usePathname, useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Avatar from "react-avatar";
import Image from "next/image";

import EditProfile from "./EditProfile";
import { FaRegBell } from "react-icons/fa";

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

const NotificationMenuMobile = ({ showMenu, handleShowMenu }: any) => {
    const [show, setShow] = useState<boolean>(false)
    const [showProfile, setShowProfile] = useState<boolean>(false)
    const [showNotification, setShowNotification] = useState<boolean>(false)
    const { userToken, setUserToken } = useAppContext();
    const router = useRouter();
    const userId = useContext(Context);

    const [userAccount, setUserAccount] = useState<UserProps | null>(userToken ? (jwt.decode(userToken) as UserProps) : null);
    const [countNotification, setCountnotification] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);



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



    const handleReadEach = (notificationId: string) => {
        if (userToken && notificationId) {
            fetchReadEach(userToken, notificationId)
                .then(() => { })
                .catch((error) => {
                    console.error("Failed to mark all notifications as read:", error);
                });
        }
    };


    useEffect(() => {
        if (userToken) {
            const decodedToken = jwt.decode(userToken) as UserProps;
            if (decodedToken) {
                setUserAccount(decodedToken);
            } else {
                router.push("/login");
            }
        }
    }, [router]);

    useEffect(() => {
        if (userToken) {
            const decodedToken = jwt.decode(userToken) as UserProps;
            if (decodedToken) {
                setUserAccount(decodedToken);
            } else {
                router.push("/login");
            }
        }
    }, [router]);

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
        if (userToken) {
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
                        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
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


    const handleclickfile = () => {
        setShow(!show)
    }
    const handleclickProFile = () => {
        setShowProfile(!showProfile)
    }
    const handleclickNotification = () => {
        setShowNotification(!showNotification)
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
    }

    useEffect(() => {
        if (showNotification) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showNotification]);

    return (

        <div className="md:hidden block ">
            <div className="flex items-center gap-5">
                <div className="relative cursor-pointer" onClick={handleclickNotification}>
                    <FaRegBell className="size-6 cursor-pointer" />
                    {countNotification != 0 && (
                        <span className="absolute px-1.5 -top-2 -right-3 bg-red-500 text-[14px] rounded-full text-white">{countNotification}</span>
                    )}
                </div>
                <div className="relative cursor-pointer" onClick={handleclickfile}>
                    {userAccount === null ? (
                        <>
                            <CgProfile className="text-white w-6 h-6 " />
                        </>
                    ) : (
                        <div className="flex gap-2">
                            {userAccount.avatar ? (
                                <Link href="#">
                                    <img
                                        className="w-8 h-8 rounded-full ml-2 border"
                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + JSON.parse(userAccount?.avatar).path}
                                        alt="avatar"
                                    />
                                </Link>

                            ) : (
                                <Avatar
                                    name={userAccount.sub.split("")[0]}
                                    size="30"
                                    className="rounded-full"
                                    textSizeRatio={2.2}
                                    color="#FFD8BF"
                                    fgColor="#FA541C"
                                />
                            )}
                            <span className="h-3 w-3 rounded-full border-2 border-white bg-green-500 block absolute top-0 -right-1"></span>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div
                    className={showNotification ? "bg-white h-full w-full fixed top-0 right-0 ease-in duration-300 z-[200]" : "bg-white h-full w-[50%] fixed top-0 right-[-100%] ease-in duration-300 z-[200]"}>
                    <div className="max-w-[1112px] h-full mx-auto px-4 mt-3 ">
                        <div className="flex items-center gap-2">
                            <span onClick={() => setShowNotification(!showNotification)} className="hover:bg-blue-50 rounded p-1.5 cursor-pointer">Back</span>
                        </div>
                        <div className="overflow-y-auto h-[calc(100vh-100px)] pb-5 custom-scrollbar ">


                            <div className="overflow-x-hidden">
                                {notifications.length > 0 &&
                                    notifications.map((notification) => {
                                        const { text, icon } = getNotificationTextAndIcon(notification.action);
                                        return (
                                            <a
                                                href={
                                                    notification.href
                                                        ? notification.href
                                                            .replace("{baseHrefComponent}", "/showcomponents")
                                                            .replace("{baseHrefPost}", "/detail") + (text == "New comment" ? "?newcomment" : "")
                                                        : ""
                                                }
                                                key={notification.id}
                                            >
                                                <div
                                                    onClick={() => handleReadEach(notification.id)}
                                                    className={`hover:bg-[#F7F9FB] mt-2 transition ease-in-out duration-500 flex items-start justify-start w-full cursor-pointer p-4 rounded-3xl ${notification.read == false && "bg-gray4"
                                                        }`}
                                                >
                                                    <Image src={icon} alt="icon" className="size-12 mr-4" />
                                                    <div className="w-full">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="font-semibold text-base leading-5 text-black1">{text}</p>
                                                            <p className="font-normal text-base leading-5 text-disable">
                                                                {formatTimeAgo(notification.createdDate)}
                                                            </p>
                                                        </div>
                                                        <p className="font-normal text-base leading-5 text-secondary mt-1">
                                                            {notification.message
                                                                .replace("{actor}", notification.metadata.actor)
                                                                .replace("{message}", notification.metadata?.message)
                                                                .replace("{title}", notification.metadata?.title)
                                                                .replace("{time}", notification.metadata?.time?.split("T")[0] || "")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
                <EditProfile show={show} showProfile={showProfile} handleClickFile={handleclickfile} handleClickProfile={handleclickProFile} />
            </div>
        </div>

    )
}

export default NotificationMenuMobile