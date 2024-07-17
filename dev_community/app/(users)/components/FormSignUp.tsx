"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { toast } from "react-toastify";

interface FormSignUpProps {
    onRouting: () => void;
}
const FormSignUp = ({ onRouting }: FormSignUpProps) => {
    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            username: Yup.string()
                .min(3, "Must be 3 characters or more")
                .max(20, "Must be 20 characters or less")
                .matches(/^[a-zA-Z0-9]*$/, "Only letters and numbers are allowed")
                .required("Username is required"),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Must be only digits")
                .min(10, "Must be 10 digits")
                .max(15, "Must be 15 digits or less")
                .required("Contract number is required"),
            password: Yup.string()
                .min(8, "Must be 8 characters or more")
                .matches(/[A-Z]/, "Must contain at least one uppercase letter (A-Z)")
                .matches(/[a-z]/, "Must contain at least one lowercase letter (a-z)")
                .matches(/[0-9]/, "Must contain at least one number (0-9)")
                .matches(/[@$!%*?&]/, "Must contain at least one special character (@, $, !, %, *, ?, &)")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), undefined], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: async (values) => {
            const trimmedValues = {
                email: values.email.trim(),
                username: values.username.trim(),
                phone: values.phone.trim(),
                password: values.password,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/authenticate/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(trimmedValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errors: { [key: string]: string } = {};
                if (errorData.message === "Username is already existed") {
                    errors.username = "Username is already existed";
                }

                if (errorData.message === "Email is already existed") {
                    errors.email = "Email is already existed";
                }
                formik.setErrors(errors);
                throw new Error(errorData.message);
            }
            toast.success("Sign Up Success! Please check your email for confirmation.", {
                position: "top-center",
                autoClose: 5000,
            });
            setTimeout(() => {
                onRouting();
            }, 3000);
        },
    });

    return (
        <>
            <div className="absolute z-50 sm:w-539px w-[385px] sm:h-800px h-fit flex-shrink-0 rounded-40px bg-formLogin shadow-formLogin sm:top-103px top-[20px] ml-3 mr-2 sm:mx-0 sm:right-64 sm:left-auto bottom-4 sm:bottom-auto">
                <div className="text-black1 sm:text-2xl text-xl font-normal leading-normal sm:mt-44px sm:ml-44px mt-8 ml-8">
                    Welcome to{" "}
                    <Link href="/">
                        <span className="text-blue3">SH COMMUNITY</span>
                    </Link>
                </div>
                <h1 className="text-black1 sm:text-48px text-4xl leading-normal sm:ml-44px ml-8 mt-2 font-semibold">Sign up</h1>

                {/* Form Sign up */}
                <form className="mt-8 sm:mx-11 mx-8" onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="email">
                            Email address
                        </label>
                        <input
                            className="shadow appearance-none border rounded-9px w-full h-57px py-2 sm:px-6 px-3 text-gray-700 leading-tight flex-shrink-0"
                            id="email"
                            type="text"
                            placeholder="Email address"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-sm">{formik.errors.email}</div> : null}
                    </div>
                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded-9px w-full h-57px py-2 sm:px-6 px-3 text-gray-700 leading-tight flex-shrink-0"
                                id="username"
                                type="text"
                                placeholder="Username"
                                {...formik.getFieldProps("username")}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="text-red-500 text-sm">{formik.errors.username}</div>
                            ) : null}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="phone">
                                Contract Number
                            </label>
                            <input
                                className="shadow appearance-none border rounded-9px w-full h-57px py-2 sm:px-6 px-3 text-gray-700 leading-tight flex-shrink-0"
                                id="phone"
                                type="text"
                                placeholder="Contract Number"
                                {...formik.getFieldProps("phone")}
                            />
                            {formik.touched.phone && formik.errors.phone ? <div className="text-red-500 text-sm">{formik.errors.phone}</div> : null}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="password">
                            Enter password
                        </label>
                        <input
                            className="shadow appearance-none border rounded-9px w-full h-57px py-2 sm:px-6 px-3 text-gray-700 leading-tight flex-shrink-0"
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-950 font-normal text-base leading-tight mb-4" htmlFor="confirmPassword">
                            Confirm password
                        </label>
                        <input
                            className="shadow appearance-none border rounded-9px w-full h-57px py-2 sm:px-6 px-3 text-gray-700 leading-tight flex-shrink-0"
                            id="confirmPassword"
                            type="password"
                            placeholder="Password"
                            {...formik.getFieldProps("confirmPassword")}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="shadow-btn bg-blue3 text-white font-bold py-2 px-4 rounded-12px w-full h-57px focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="sm:mt-10 mt-4 mb-4 flex justify-center font-normal leading-relaxed text-base text-sencondary">
                    Have an Account ?{" "}
                    <Link href="/login">
                        <span className="text-blue3 ms-4"> Sign in </span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default FormSignUp;
