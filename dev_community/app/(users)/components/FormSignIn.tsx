"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import { useAppContext } from "@/app/utils/contextProvider";
interface UserProps {
    sub: string;
    auth: string;
    id: string;
    avatar: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    iat: number;
    exp: number;
    email: string;
}
interface FormSignInProps {
    onRouting: (route: string) => void;
    handleLoadingState: (loading: boolean) => void;
}

const fetchEmail = async (email: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/authenticate/forgot-pass/${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        throw new Error("Failed email");
    }
};

const FormSignIn = ({ onRouting, handleLoadingState }: FormSignInProps) => {
    const { setUserToken, setRefreshToken } = useAppContext();
    const [isForgotPass, setIsforgotPass] = useState(false);
    const [emailForgotPass, setEmailForgotPass] = useState("");
    const [messageError, setMessageError] = useState("");

    const isShowFormFoget = () => {
        setIsforgotPass(!isForgotPass);
        setMessageError("");
        formik.errors.password = "";
        formik.errors.username = "";
    };

    const handeForgotPassword = () => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailForgotPass)) {
            setMessageError("Invalid email address");
            return;
        }

        fetchEmail(emailForgotPass)
            .then(() => {
                toast.success("Plase check your email!", { position: "top-center", autoClose: 3000 });
                setIsforgotPass(false);
            })
            .catch((error) => {
                if (error.message == "Failed email") {
                    setMessageError("Email does not exist!")
                } else {
                    throw new Error(error)
                }
            });
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username or email is required"),
            password: Yup.string().required("Password is required"),
        }),

        onSubmit: async (values) => {
            handleLoadingState(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/authenticate/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error("Sign In Failed! Please check your sign in information.", {
                        position: "top-center",
                        autoClose: 500,
                    });
                    throw new Error(errorData.message);
                }
                const responseData = await response.json();
                toast.success("Sign In Successfully!", {
                    position: "top-center",
                    autoClose: 500,
                });
                const result1 = await fetch("http://localhost:3000/pages/api/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: responseData.idToken, refreshToken: responseData.idRefreshToken, maxAge: responseData.refreshTokenValidSecond}),
                });
                let tokenData = await result1.json();
                setUserToken(tokenData.accessToken);
                setRefreshToken(tokenData.refreshToken)
                const decodedToken = jwt.decode(tokenData.accessToken) as UserProps;
                if (decodedToken) {
                    const authen = decodedToken.auth;
                    if (authen == "ROLE_SUPER_ADMIN") {
                        onRouting("/posts");
                    } else {
                        onRouting("/");
                    }
                }
            } catch (error) {
                handleLoadingState(false);
                console.error("Sign in error:", error);
            }
        },
    });

    return (
        <>
            <div className="absolute z-50 sm:w-539px w-[385px] h-800px flex-shrink-0 rounded-40px bg-formLogin shadow-formLogin sm:top-103px top-[20px] ml-3 mr-2 sm:mx-0 sm:right-64 sm:left-auto bottom-4 sm:bottom-auto">
                <div className="text-black1 sm:text-2xl text-xl font-normal leading-normal sm:mt-44px sm:ml-44px mt-8 ml-8">
                    Welcome to{" "}
                    <Link href="/">
                        <span className="text-blue3">SH COMMUNITY</span>
                    </Link>
                </div>
                <h1 className="text-black1 sm:text-48px text-4xl leading-normal sm:ml-44px ml-8 mt-2 font-semibold">Sign in</h1>

                {/* Sign in by google account */}
                <div className="flex sm:space-x-4 sm:mt-62px mt-8">
                    <div className="relative sm:ml-44px ml-8 h-57px sm:w-379px w-[250px] flex-shrink-0 rounded-9px bg-blueLight flex items-center">
                        <svg
                            className="w-[26px] h-[26px] sm:ml-[32px] ml-3"
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                        >
                            <path
                                d="M24.3762 13.2523C24.3762 12.317 24.2988 11.6345 24.1312 10.9268H13.2334V15.1481H19.6302C19.5012 16.1972 18.8048 17.777 17.2572 18.8386L17.2355 18.98L20.6812 21.5959L20.9199 21.6193C23.1123 19.6349 24.3762 16.7153 24.3762 13.2523Z"
                                fill="#3C7FF5"
                            />
                            <path
                                d="M13.2328 24.3754C16.3667 24.3754 18.9976 23.3642 20.9193 21.6201L17.2566 18.8394C16.2764 19.5093 14.9609 19.9769 13.2328 19.9769C10.1634 19.9769 7.55826 17.9927 6.62961 15.25L6.49349 15.2613L2.91062 17.9787L2.86377 18.1064C4.77247 21.8222 8.6931 24.3754 13.2328 24.3754Z"
                                fill="#34A853"
                            />
                            <path
                                d="M6.62989 15.2501C6.38485 14.5423 6.24304 13.7839 6.24304 13.0004C6.24304 12.2167 6.38485 11.4584 6.617 10.7506L6.61051 10.5999L2.98273 7.83887L2.86404 7.8942C2.07737 9.43616 1.62598 11.1677 1.62598 13.0004C1.62598 14.833 2.07737 16.5645 2.86404 18.1064L6.62989 15.2501Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M13.2329 6.0233C15.4124 6.0233 16.8826 6.94594 17.7209 7.71696L20.9967 4.5825C18.9849 2.74987 16.3668 1.625 13.2329 1.625C8.69313 1.625 4.77248 4.17804 2.86377 7.89384L6.61674 10.7503C7.55829 8.00763 10.1634 6.0233 13.2329 6.0233Z"
                                fill="#EB4335"
                            />
                        </svg>
                        <Link
                            className="absolute sm:ml-80px ml-12 text-base font-normal leading-20px text-blue3"
                            href={process.env.NEXT_PUBLIC_GOOGLE_URL ? process.env.NEXT_PUBLIC_GOOGLE_URL : ""}
                        >
                            Sign in with Google
                        </Link>
                    </div>

                    {/* Sign in by Git account */}
                    <Link
                        href={process.env.NEXT_PUBLIC_GITHUB_URL ? process.env.NEXT_PUBLIC_GITHUB_URL : ""}
                        className="ml-3 h-57px w-60px bg-grayLight flex-shrink-0 rounded-9px flex items-center"
                    >
                        <svg className="w-24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"
                                fill="black"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Form Sign up */}
                {isForgotPass == true ? (
                    <div className="sm:mt-57px mt-8 sm:mx-11 mx-8">
                        <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="username">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded-9px w-full h-57px py-2 px-6 text-gray-700 leading-tight flex-shrink-0"
                            id="username"
                            type="email"
                            placeholder="Email address"
                            onChange={(e) => setEmailForgotPass(e.target.value)}
                        />
                        {messageError && (
                            <div className="text-red-500 text-sm">{messageError}</div>
                        )}
                        <div className="flex flex-col items-center justify-between mt-10 mb-10">
                            <button
                                onClick={handeForgotPassword}
                                className="shadow-btn bg-blue3 text-white font-bold py-2 px-4 rounded-12px w-full h-57px focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                            <div className="text-xl text-gray-500 mt-8 cursor-pointer" onClick={isShowFormFoget}>
                                Back
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <form className="sm:mt-57px mt-8 sm:mx-11 mx-8" onSubmit={formik.handleSubmit}>
                            <div>
                                <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="username">
                                    Enter your username or email address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded-9px w-full h-57px py-2 px-6 text-gray-700 leading-tight flex-shrink-0"
                                    id="username"
                                    type="text"
                                    placeholder="Username or email address"
                                    {...formik.getFieldProps("username")}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <div className="text-red-500 text-sm">{formik.errors.username}</div>
                                ) : null}
                            </div>
                            <div className="sm:mt-38px mt-7">
                                <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="password">
                                    Enter password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded-9px w-full h-57px py-2 px-6 text-gray-700 leading-tight flex-shrink-0"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps("password")}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className="text-end mt-4 sm:mb-44px mb-8  ">
                                <span
                                    className="hover:text-blue3 transition duration-500 ease-in-out text-base leading-relaxed font-normal cursor-pointer"
                                    onClick={isShowFormFoget}
                                >
                                    Forgot Password?
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="shadow-btn bg-blue3 text-white font-bold py-2 px-4 rounded-12px w-full h-57px focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <div className="sm:mt-10 mt-8 mb-5 flex justify-center font-normal leading-relaxed text-base text-sencondary">
                            Do not have an account ?{" "}
                            <Link href="/signup">
                                <span className="text-blue3 ms-4"> Sign up </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FormSignIn;
