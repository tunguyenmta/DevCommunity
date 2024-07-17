/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { LuCopyPlus } from "react-icons/lu";
interface RelatedPostsProps {
    showSearchDiv: () => void;
    listExample: Example[];
}
interface Example {
    id: number;
    title: string;
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ showSearchDiv, listExample }) => {
    // const [isShow, setIsShow] = useState<boolean>(false);
    useEffect(() => {}, [listExample]);
    return (
        <div className="w-[420px]">
            <div className="p-[16px] rounded-[12px] bg-white">
                <h2 className="font-semibold text-2xl leading-7 mb-4">Attach components</h2>
                <p className="pb-[8px] text-[16px] font-normal text-xl leading-6 min-w-[370px] text-disable mt-4">
                    Fully configured articles and content presentation can help increase the visibility of your articles.(maximum 4 components)
                </p>
                <div className="pt-[8px]">
                    <button
                        onClick={showSearchDiv}
                        className="w-full px-[16px] py-[12px] rounded-[8px] border-[2px] bg-blue5 flex justify-center items-center gap-[12px] group hover:bg-white hover:border-blue3 transition duration-500 ease-in-out"
                    >
                        <LuCopyPlus className="w-[24px] h-[24px] text-blue3" />
                        <span className="text-[18px] text-blue3 font-semibold ">
                            Add component
                        </span>
                    </button>
                </div>
            </div>
            {listExample && listExample.length > 0 && (
                <div className="mt-[16px]">
                    {listExample.map((item) => {
                        console.log(item);
                        return (
                            <div key={item.id} className="rounded-[8px] my-[20px] bg-[#F7F9FB] p-5">
                                <div className="p-3 rounded-[8px]">
                                    <div className="w-[95%] h-[100%]">
                                        <iframe
                                            srcDoc={`<html><head><style>${item.resource.css}
                          </style></head><body style="height: 100%; display: flex; justify-content: center; align-items: center">${item.resource.html}<script>${item.resource.javascript}</script></body></html>`}
                                            className="w-full h-full "
                                        ></iframe>
                                    </div>
                                </div>
                                <h3 className="text-[18px] font-semibold text-center">{item.title}</h3>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RelatedPosts;
