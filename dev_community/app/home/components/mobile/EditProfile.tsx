import { Context, useAppContext } from "@/app/utils/contextProvider";
import { useRouter } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";

import { useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { CgProfile } from "react-icons/cg";
import Avatar from "react-avatar";
import { SlArrowDown, SlArrowLeft } from "react-icons/sl";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import './EditProfile.css'
import { Tag } from "antd";
interface UserProps {
    id: string;
    sub: string;
    email: string;
    avatar: string;
    auth: string;
    exp: number;
    iat: number;
}

interface EditProfileProps {
    show: boolean;
    showProfile: boolean;
    handleClickFile: () => void;
    handleClickProfile: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ show, showProfile, handleClickFile, handleClickProfile }) => {
    const userId = useContext(Context);
    const router = useRouter();
    const { userToken, setUserToken } = useAppContext();
    const [userAccount, setUserAccount] = useState<UserProps | null>(null);
    const [inputVisible, setInputVisible] = useState(false);


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

    const handleonClick = async () => {
        const res = await fetch("http://localhost:3000/pages/api/auth", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(res);

        if (res.ok) {
            setUserToken("");
            setUserAccount(null);
            router.push("/");
        } else {
            console.error("Logout failed");
        }
    }
    const showInput = () => {
        setInputVisible(true);
    };
    useEffect(() => {
        if (show || showProfile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show, showProfile]);

    return (
        <div>
            <div
                className={show ? "bg-white h-full w-full fixed top-0 right-0 ease-in duration-300 z-[100]" : "bg-white h-full w-[50%] fixed top-0 right-[-100%] ease-in duration-300 z-[100]"}>
                <div className="max-w-[1112px] h-full mx-auto px-4 mt-3">
                    <div className="flex items-center gap-2">
                        <span onClick={handleClickFile} className="hover:bg-blue-50 rounded p-1.5 cursor-pointer">Back</span>
                    </div>
                    <div className="w-full h-[1px] bg-gray-300 my-6"></div>
                    <div className="overflow-y-auto h-[calc(100vh-100px)] pb-5 custom-scrollbar">
                        <div className="flex justify-between items-center bg-slate-200 p-2 rounded-md">
                            <div className=" flex items-center gap-2">

                                {userAccount === null ? (
                                    <>
                                        <CgProfile className="text-white w-6 h-6 " />
                                    </>
                                ) : (
                                    <div className="relative">
                                        {userAccount.avatar ? (
                                            <Link href="#">

                                                <img
                                                    className="w-12 h-12 rounded-full ml-2 border"
                                                    src={process.env.NEXT_PUBLIC_BASE_IMG_URL + JSON.parse(userAccount?.avatar).path}
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
                                        <span className="h-4 w-4 rounded-full border-2 border-gray-200 bg-green-500 block absolute top-0 right-0"></span>
                                    </div>
                                )}
                                <p>{userAccount?.sub.toUpperCase()}</p>
                            </div>

                            <span className="flex items-center gap-x-2 font-medium text-[12px] cursor-pointer bg-slate-300 transition-all p-2 rounded-md" onClick={handleClickProfile}><p>Edit Profile</p><SlArrowDown /></span>
                        </div>
                        <div className="mt-10" onClick={handleonClick}>
                            <div className="cursor-pointer flex justify-center items-center btn border border-blue3 rounded-md md:py-[15px] md:px-8 px-2 py-2 text-xl font-inter text-white font-semibold leading-6 bg-blue3  hover:bg-white hover:text-blue3 transition duration-500 ease-in-out">
                                <span className="md:text-xl text-sm ">Logout</span> <IoIosLogOut />
                            </div>
                        </div>
                        <div>
                            <div onClick={(e) => e.stopPropagation()} className={showProfile ? `bg-white h-full w-full fixed bottom-0 ease-in duration-700 right-0 ` : `bg-white  h-full w-full fixed -bottom-[100%] ease-in duration-700 right-0`}>
                                <div className="max-w-[500px] mx-auto px-5 overflow-y-auto overflow-x-hidden h-screen pb-5 custom-scrollbar">
                                    <div className="my-8">
                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-black cursor-pointer" onClick={handleClickProfile}>
                                                <SlArrowLeft />
                                            </div>
                                            <p className="text-[18px] font-medium cursor-pointer">
                                                save
                                            </p>
                                        </div>
                                        <div className="mx-auto text-center  flex flex-col items-center">
                                            <p className="font-medium">Edit Profile</p>
                                            <div className="relative w-20 h-20 mt-2">
                                                <img className="w-20 h-20 rounded-full absolute" src="https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                                                <div className="w-20 h-20 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
                                                    <img className="hidden group-hover:block w-12" src="https://www.svgrepo.com/show/33565/upload.svg" alt="" />
                                                </div>
                                            </div>
                                            <p className="font-medium">Change Photo</p>
                                        </div>
                                        <div>
                                            <div className="mt-10">
                                                <h1 className="font-bold text-[20px]">Basic information</h1>
                                                <p>This information will be visible on your public profile.</p>
                                            </div>
                                            <div className="mt-10">
                                                <label className="text-gray-800 text-xs block mb-2">Username</label>
                                                <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">First name</label>
                                                    <div className="relative flex items-center">
                                                        <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                                    </div>
                                                </div>
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">Last name</label>
                                                    <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">Email</label>
                                                    <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                                </div>
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">Phone number</label>
                                                    <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                                </div>
                                            </div>
                                            <div className="mt-10">
                                                <label className="text-gray-800 text-xs block mb-2">Country</label>
                                                <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                            </div>
                                        </div>

                                        {/* ===================================================== */}

                                        <div>
                                            <div className="mt-10">
                                                <h1 className="font-bold text-[20px]">Professional information</h1>
                                                <p>This information will be visible on your public profile.</p>
                                            </div>
                                            <div className="mt-10">
                                                <label className="text-gray-800 text-xs block mb-2">Title</label>
                                                <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                            </div>
                                            <div className="mt-10">
                                                <label className="text-gray-800 text-xs block mb-2">School or University</label>
                                                <div className="relative flex items-center">
                                                    <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                                </div>
                                            </div>

                                            <div className="mt-10">
                                                <label className="text-gray-800 text-xs block mb-2">Degree</label>
                                                <input name="name" type="text" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />

                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">Start From</label>
                                                    <input name="date" type="date" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />
                                                </div>
                                                <div className="mt-10">
                                                    <label className="text-gray-800 text-xs block mb-2">Ending In</label>
                                                    <input name="date" type="date" required className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none" placeholder="Enter name" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-10">
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
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile