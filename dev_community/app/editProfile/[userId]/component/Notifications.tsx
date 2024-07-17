/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/utils/contextProvider";
const fetchNotifications = async (tokenUser: string) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/group-noti`,
        {
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                Expires: "0",
                Authorization: `Bearer ${tokenUser}`,
            },
            cache: "no-store",
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch notification");
    }
    return res.json();
};

const updateNotifications = async (tokenUser: string, notifications: string[]) => {
    console.log(notifications);
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/group-noti`,
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenUser}`,
            },
            body: JSON.stringify(notifications),
        }
    );
    if (!res.ok) {
        throw new Error("Failed to update notifications");
    }
};

const Notifications = () => {
    const [notificationSettings, setNotificationSettings] = useState<string[]>([]);
    const {userToken} = useAppContext()

    useEffect(() => {
        if (userToken) {
            fetchNotifications(userToken)
                .then((data) => {
                    setNotificationSettings(data);
                })
                .catch((error) => {
                    toast.error("Failed to fetch notifications");
                });
        }
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setNotificationSettings((prevSettings) => {
            if (checked) {
                return [...prevSettings, name.toUpperCase()];
            } else {
                return prevSettings.filter((setting) => setting !== name.toUpperCase());
            }
        });
    };

    const handleUpdatePassword = () => {
        if (userToken) {
            const updatedNotifications = [];
            if (notificationSettings.includes("ACCOUNT_ACTIVITY")) {
                updatedNotifications.push("ACCOUNT_ACTIVITY");
            }
            if (notificationSettings.includes("SOCIAL_INTERACTIONS")) {
                updatedNotifications.push("SOCIAL_INTERACTIONS");
            }

            updateNotifications(userToken, updatedNotifications)
                .then(() => {
                    toast.success("Notifications updated successfully");
                })
                .catch((error) => {
                    toast.error("Failed to update notifications");
                });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-12">
            <h1 className="font-bold text-xl leading-6 text-black1">
                Dashboard notifications
            </h1>
            <div className="mt-6">
                <div className="flex items-center justify-between font-normal text-base leading-5 text-black1">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="account_activity"
                            id="account_activity"
                            className="mr-2 h-5 w-5 rounded-lg cursor-pointer"
                            checked={notificationSettings.includes("ACCOUNT_ACTIVITY")}
                            onChange={handleCheckboxChange}
                        />
                        Account activity
                    </div>
                    <p className="text-disable">
                        Announcements about login attempts, and password changes
                        of your account activity.
                    </p>
                </div>
                <div className="flex items-center justify-between font-normal text-base leading-5 text-black1 mt-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="system_updates"
                            id="system_updates"
                            className="mr-2 h-5 w-5 rounded-lg cursor-pointer"
                            checked={true}
                            readOnly disabled
                        />
                        System updates
                    </div>
                    <p className="text-disable">
                        Updates on Devcommunity’s new features, products, and
                        more.
                    </p>
                </div>
                <div className="flex items-center justify-between font-normal text-base leading-5 text-black1 mt-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="social_interactions"
                            id="social_interactions"
                            className="mr-2 h-5 w-5 rounded-lg cursor-pointer"
                            checked={notificationSettings.includes("SOCIAL_INTERACTIONS")}
                            onChange={handleCheckboxChange}
                        />
                        Social interactions
                    </div>
                    <p className="text-disable">
                        Roundup of new shares, likes, and comments of your
                        Article/Component.
                    </p>
                </div>
            </div>
            <div className="w-full flex items-center justify-end mt-6">
                <button
                    className="bg-blue3 text-white text-lg leading-5 px-3 py-3 rounded-lg border border-blue3 hover:bg-white hover:text-blue3 ease-in-out transition duration-500"
                    onClick={handleUpdatePassword}
                >
                    Update notifications
                </button>
            </div>
        </div>
    );
};

export default Notifications;
