"use client";

import React, { useState, useEffect } from "react";
import { FaChevronUp, FaFacebookF } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import Cat from '../../../public/asstets/icons/cat.svg'
import Image from "next/image";

interface HashTag {
    id: number;
    name: string;
}

interface HasTagListProp {
    tags: HashTag[];
}

const Footer: React.FC<HasTagListProp> = ({ tags }) => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleScroll = () => {
        if (window.scrollY === 0) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="w-full mt-20 ">
            <div className="w-full h-20 bg-grayFooter flex items-center justify-between px-6 md:px-[140px]">
                <div className="text-black1">
                    <span className="mr-3 font-inter font-bold">Customer Inquiry</span>
                    <span className="text-blue3">02-1236-7891</span> - Excluding weekends and public holidays
                    <span className="text-blue3 ml-1">whale_help_@shsoftvina.com</span>
                </div>
                <div className="flex items-center">
                    <FaFacebookF className="size-5" />
                    <FaGithub className="ml-3 size-5" />
                </div>
            </div>
            <div className="bg-blue3 text-white ">
                <div className="w-full font-inter font-bold text-xl lg:px-20 mx-auto px-6">
                    <div className="py-10 text-[15px] md:text-[20px] md:text-center">BROWSE ALL TOPICS</div>
                    <div className="md:flex items-center justify-center w-full">
                        <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-y-6 gap-x-6">
                            {tags.map((tag) => (
                                <li key={tag.id} className="rounded-[12px] px-3 py-[8px] border-[2px] border-transparent whitespace-nowrap overflow-hidden text-ellipsis hover:border-white transition duration-500" >
                                    <a href={`/articles/hashtag/${tag.id}`} className=" ease-in-out text-[15px] md:text-[20px]">
                                        {tag.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="relative flex items-center justify-center w-full mt-20 text-center  md:p-0 px-6 ">
                    <div className="font-inter text-lg leading-5 ">
                        <a href="#" className="mr-12 hover:text-yellow-300 transition duration-500 ease-in-out font-normal underline">
                            Privacy policy
                        </a>
                        <a href="#" className="hover:text-yellow-300  transition duration-500 ease-in-out font-normal underline">
                            Membership login
                        </a>
                        <p className="mt-12 leading-10 pb-6 text-lg font-inter font-light text-[12px] md:text-[20px]">
                            With a commitment to quality content for the community.
                            <br />
                            Founded by SH SOFTVINA - 2024.
                            <br />
                            Discover a treasure trove of free, diverse, and high-quality UI resources. Elevate your designs with our Platform!
                        </p>
                    </div>

                    {isVisible && (
                        <div>
                            <button
                                onClick={scrollToTop}
                                className="fixed bottom-3 md:bottom-10 right-3 p-3 md:p-5 bg-blue-200  md:bg-blue3 border text-white rounded-full md:hover:bg-blue-700 transition duration-500 ease-in-out"
                            >
                                <FaChevronUp size={25} className="font-bold" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Footer;
