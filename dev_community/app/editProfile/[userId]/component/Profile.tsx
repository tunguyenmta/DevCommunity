/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
import { Flex, Input, Tag, Tooltip, Upload, Modal, UploadFile, UploadProps, message } from "antd";
import { toast } from "react-toastify";
import { LuPlus } from "react-icons/lu";
import "./profile.css";
import jwt from "jsonwebtoken";
import { ref } from "yup";

interface UserProps {
    id: string;
    sub: string;
    email: string;
    avatar: string;
    auth: string;
    exp: number;
    iat: number;
}

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    country: string;
    title: string;
    school: string;
    degree: string;
    startFrom: string;
    endingIn: string;
    skills: string[];
}

const tagInputStyle: React.CSSProperties = {
    width: 120,
    height: 46,
    marginInlineEnd: 8,
    verticalAlign: "top",
    fontSize: 16,
};

const fetchUser = async (userId: string, tokenUser: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/users/profile`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user data");
    }
    return res.json();
};

const fetchUpdate = async (
    userId: string,
    tokenUser: string,
    data: User,
    setUserToken: (token: string) => void,
    setRefreshToken: (token: string) => void
) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${tokenUser}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update user data");
    } 

    const newToken = await res.json();
    
    const response = await fetch("http://localhost:3000/pages/api/auth", {
        method: "POST",
        body: JSON.stringify({ token: newToken.idToken, refreshToken: newToken.idRefreshToken, maxAge: newToken.refreshTokenValidSecond }),
    });
    
    const userToken = await response.json();
    
    if (userToken) {
        setUserToken(userToken.accessToken);
        setRefreshToken(userToken.refreshToken);
    }
};

const Profile = () => {
    const { userToken, setUserToken, setRefreshToken } = useAppContext();
    const [tags, setTags] = useState<string[]>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState("");
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [user, setUser] = useState<User>();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            if (userToken) {
                const decodedToken = jwt.decode(userToken) as UserProps;
                const data = (await fetchUser(decodedToken.id, userToken)) as User;
                setUser(data);
                setTags(data.skills ? data.skills : []);

                setFileList([
                    {
                        uid: "-1",
                        name: data.avatar ? "avatar" : "",
                        status: "done",
                        url: data.avatar ? process.env.NEXT_PUBLIC_BASE_IMG_URL + data.avatar.path : undefined,
                    },
                ]);
            }
        };
        fetchData();
    }, [userToken]);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [editInputValue]);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue("");
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setEditInputValue("");
    };

    const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
    };

    const beforeUpload = (file: UploadFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
        if (!isJpgOrPng) {
            toast.error("You can only upload JPG/PNG file!");
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const handleCancelPreview = () => setPreviewVisible(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewImage(file.url || file.preview || "");
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || "");
    };

    const uploadProps: UploadProps = {
        name: "file",
        beforeUpload: beforeUpload,
        onChange: handleUploadChange,
        onPreview: handlePreview,
        multiple: false,
        accept: ".jpeg,.jpg,.png",
        listType: "picture-card",
        fileList,
    };

    const getBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const validateField = (name: string, value: string) => {
        let error = "";
        switch (name) {
            case "username":
                if (!value) {
                    error = "Username is required";
                }
                break;
            case "email":
                if (!value) {
                    error = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is invalid";
                }
                break;
            case "phone":
                if (!value) {
                    error = "Phone number is required";
                } else if (!/^\d{10,15}$/.test(value)) {
                    error = "Phone number must be between 10 and 15 digits";
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleFieldChange = (name: string, value: string) => {
        setUser((prevUser) => {
            const updatedUser = { ...prevUser!, [name]: value || "" };
            return updatedUser;
        });
        validateField(name, value);
    };

    const handleUpdateProfile = async (setUserToken: (token: string) => void, setRefreshToken: (token: string) => void) => {
        if (userToken && user) {
            try {
                if (fileList.length > 0) {
                    const avatarFormData = new FormData();
                    if (fileList[0].originFileObj) {
                        avatarFormData.append("files", fileList[0].originFileObj as Blob);

                        const avatarResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
                            method: "POST",
                            body: avatarFormData,
                        });

                        if (!avatarResponse.ok) {
                            throw new Error("Failed to upload avatar image");
                        }

                        const avatarData = await avatarResponse.json();

                        user.avatar = avatarData[0];
                    }
                }

                await fetchUpdate(
                    user.id,
                    userToken,
                    {
                        ...user,
                        skills: tags,
                    },
                    setUserToken,
                    setRefreshToken
                );
                toast.success("Profile updated successfully", { position: "top-center", autoClose: 1000 });
            } catch (error) {
                setErrors((prevErrors) => ({ ...prevErrors, username: "Username already exists" }));
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="flex">
                <div className="w-2/3">
                    {/* Basic information */}
                    <h1 className="font-bold text-xl leading-6 text-black1">Basic information</h1>
                    <p className="font-normal text-base leading-5 text-disable mt-4">This information will be visible on your public profile.</p>
                    {/* Fields */}
                    <div className="mt-6 space-y-4">
                        {/* Username */}
                        <div>
                            <label className="font-semibold text-base leading-5 text-black1">Username</label>
                            <input
                                type="text"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                placeholder="Enter Username"
                                value={user?.username || ""}
                                onChange={(e) => handleFieldChange("username", e.target.value)}
                            />
                            {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
                        </div>
                        {/* Firstname and Lastname */}
                        <div className="flex space-x-4 w-4/5">
                            <div className="flex-1 mr-4">
                                <label className="font-semibold text-base leading-5 text-black1">First Name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="Enter First Name"
                                    value={user?.firstName || ""}
                                    onChange={(e) => handleFieldChange("firstName", e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-semibold text-base leading-5 text-black1">Last Name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="Enter Last Name"
                                    value={user?.lastName || ""}
                                    onChange={(e) => handleFieldChange("lastName", e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Email and Phone Number */}
                        <div className="flex space-x-4 w-4/5">
                            <div className="flex-1 mr-4">
                                <label className="font-semibold text-base leading-5 text-black1">Email</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12 bg-gray-300"
                                    placeholder="Enter Email"
                                    value={user?.email || ""}
                                    onChange={(e) => handleFieldChange("email", e.target.value)}
                                    disabled
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                            <div className="flex-1">
                                <label className="font-semibold text-base leading-5 text-black1">Phone Number</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="Enter Phone Number"
                                    value={user?.phone || ""}
                                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                                />
                                {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                            </div>
                        </div>
                        {/* Country */}
                        <div>
                            <label className="font-semibold text-base leading-5 text-black1">Country</label>
                            <input
                                type="text"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                placeholder="e.g, Ho Chi Minh, Viet Nam"
                                value={user?.country || ""}
                                onChange={(e) => handleFieldChange("country", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Professional information */}
                    <h1 className="font-bold text-xl leading-6 text-black1 mt-14">Professional information</h1>
                    <p className="font-normal text-base leading-5 text-disable mt-4">This information will be visible on your public profile.</p>
                    {/* Fields */}
                    <div className="mt-6 space-y-4">
                        {/* Title and School or Unviersity */}
                        <div className="flex space-x-4">
                            <div className="flex-1 mr-4">
                                <label className="font-semibold text-base leading-5 text-black1">Title</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="e.g., Software Engineer, Product Manager"
                                    value={user?.title || ""}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-semibold text-base leading-5 text-black1">School or University</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="School Name"
                                    value={user?.school || ""}
                                    onChange={(e) => handleFieldChange("school", e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Degree and Dates */}
                        <div className="flex space-x-4">
                            <div className="w-3/5">
                                <label className="font-semibold text-base leading-5 text-black1">Degree</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="e.g., Bachelor of UI/UX"
                                    value={user?.degree || ""}
                                    onChange={(e) => handleFieldChange("degree", e.target.value)}
                                />
                            </div>
                            <div className="w-1/5">
                                <label className="font-semibold text-base leading-5 text-black1">Start From</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="Enter Start Date"
                                    value={user?.startFrom || ""}
                                    onChange={(e) => handleFieldChange("startFrom", e.target.value)}
                                />
                            </div>
                            <div className="w-1/5">
                                <label className="font-semibold text-base leading-5 text-black1">Ending In</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 h-12"
                                    placeholder="Enter End Date"
                                    value={user?.endingIn || ""}
                                    onChange={(e) => handleFieldChange("endingIn", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <p className="font-semibold text-base leading-5 text-black1">Skills</p>
                            <p className="font-normal text-base leading-5 text-disable mt-4">
                                What are your areas of expertise? Ex: User interface, Ecommerce, CSS, etc.
                            </p>
                            <Flex gap="4px 0" wrap className="mt-4">
                                {tags &&
                                    tags.map<React.ReactNode>((tag, index) => {
                                        if (editInputIndex === index) {
                                            return (
                                                <Input
                                                    ref={editInputRef}
                                                    key={tag}
                                                    size="small"
                                                    style={tagInputStyle}
                                                    value={editInputValue}
                                                    onChange={handleEditInputChange}
                                                    onBlur={handleEditInputConfirm}
                                                    onPressEnter={handleEditInputConfirm}
                                                />
                                            );
                                        }
                                        const isLongTag = tag.length > 20;
                                        const tagElem = (
                                            <Tag
                                                key={tag}
                                                closable
                                                style={{
                                                    userSelect: "none",
                                                    padding: "12px 16px",
                                                    fontSize: 16,
                                                    background: "#FAFAFA",
                                                    fontWeight: 400,
                                                }}
                                                onClose={() => handleClose(tag)}
                                            >
                                                <span
                                                    onDoubleClick={(e) => {
                                                        if (index !== 0) {
                                                            setEditInputIndex(index);
                                                            setEditInputValue(tag);
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                </span>
                                            </Tag>
                                        );
                                        return isLongTag ? (
                                            <Tooltip title={tag} key={tag}>
                                                {tagElem}
                                            </Tooltip>
                                        ) : (
                                            tagElem
                                        );
                                    })}
                                {inputVisible ? (
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        size="small"
                                        style={tagInputStyle}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onBlur={handleInputConfirm}
                                        onPressEnter={handleInputConfirm}
                                    />
                                ) : (
                                    <Tag
                                        style={{
                                            padding: "12px 16px",
                                            fontSize: 16,
                                            boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.02)",
                                            background: "white",
                                            border: "1px dashed #d9d9d9",
                                        }}
                                        icon={<PlusOutlined />}
                                        onClick={showInput}
                                    >
                                        New Skill
                                    </Tag>
                                )}
                            </Flex>
                        </div>
                    </div>
                </div>
                {/* Img */}
                <div className="w-1/3" id="uploadAvatar">
                    <p className="font-semibold text-base leading-5 text-black1">Avatar</p>
                    <div className="flex items-center justify-center w-full mb-4">
                        <Upload {...uploadProps}>
                            {fileList.length >= 1 ? null : (
                                <div className="flex flex-col items-center justify-center">
                                    <LuPlus className="size-6 mr-1" />
                                    <div className="font-normal text-base leading-5 text-disable" style={{ marginTop: 8 }}>
                                        Upload
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-end mt-4">
                <button
                    className="bg-blue3 text-white text-lg leading-5 px-3 py-3 rounded-lg border border-blue3 hover:bg-white hover:text-blue3 ease-in-out transition duration-500"
                    onClick={() => handleUpdateProfile(setUserToken, setRefreshToken)}
                >
                    Update profile
                </button>
            </div>
            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default Profile;
