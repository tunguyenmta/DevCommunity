/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import "./profile.css";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/utils/contextProvider";
const Password = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordAgain, setNewPasswordAgain] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [newPasswordAgainError, setNewPasswordAgainError] = useState("");
    const {userToken} = useAppContext()
    const validateNewPassword = (password:string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleUpdatePassword = async () => {
        let valid = true;

        if (!currentPassword) {
            setCurrentPasswordError("Current password is required");
            valid = false;
        } else {
            setCurrentPasswordError("");
        }

        if (!newPassword) {
            setNewPasswordError("New password is required");
            valid = false;
        } else if (!validateNewPassword(newPassword)) {
            setNewPasswordError("New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            valid = false;
        } else {
            setNewPasswordError("");
        }

        if (!newPasswordAgain) {
            setNewPasswordAgainError("Please confirm your new password");
            valid = false;
        } else if (newPassword !== newPasswordAgain) {
            setNewPasswordAgainError("New passwords do not match");
            valid = false;
        } else {
            setNewPasswordAgainError("");
        }

        if (!valid) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/users/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                Expires: "0",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
            }),
        });

        if (response.ok) {
            toast.success("Update Password Success!", {
                position: "top-center",
                autoClose: 1000
            })
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordAgain("");
        } else {
            setCurrentPasswordError("Current password is incorrect");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-12">
           
            <h1 className="font-bold text-xl leading-6 text-black1">
                Reset password 
            </h1>
            <p className="font-normal text-base leading-5 text-disable mt-4">
                Updating your password will cause all other browser sessions to 
                be logged out.
            </p>
            <div className="mt-6 space-y-4">
                <div className="w-1/2">
                    <label className="font-semibold text-base leading-5 text-black1">
                        Current password
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    {currentPasswordError && (
                        <div className="text-red-500 text-sm mt-1">
                            {currentPasswordError}
                        </div>
                    )}
                </div>
                <div className="w-1/2">
                    <label className="font-semibold text-base leading-5 text-black1">
                        New password
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPasswordError && (
                        <div className="text-red-500 text-sm mt-1">
                            <p>* Minimum of 8 characters</p>
                            <p>* Must contain at least one uppercase letter (A-Z)</p>
                            <p>* Must contain at least one lowercase letter (a-z)</p>
                            <p>* Must contain at least one digit (0-9)</p>
                            <p>* Must contain at least one special charater (e.g., @, #, $, %, &, etc.)</p>
                        </div>
                    )}
                </div>
                <div className="w-1/2">
                    <label className="font-semibold text-base leading-5 text-black1">
                        New password again
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                        placeholder="Enter new password again"
                        value={newPasswordAgain}
                        onChange={(e) => setNewPasswordAgain(e.target.value)}
                    />
                    {newPasswordAgainError && (
                        <div className="text-red-500 text-sm mt-1">
                            {newPasswordAgainError}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full flex items-center justify-end mt-6">
                <button
                    className="bg-blue3 text-white text-lg leading-5 px-3 py-3 rounded-lg border border-blue3 hover:bg-white hover:text-blue3 ease-in-out transition duration-500"
                    onClick={handleUpdatePassword}
                >
                    Update password
                </button>
            </div>
        </div>
    );
};

export default Password;
