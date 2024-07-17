import React from "react";
import { CiPen } from "react-icons/ci";
import { PiGearLight } from "react-icons/pi";

const Purpose = () => {
    return (
        <div className="w-[290px]">
            <div className="bg-[#F0F6FF] p-[16px]">
                <h2 className="text-[20px] font-semibold pb-[8px]">Purposes</h2>
                <p className="w-[260px] pb-[8px] text-[16px] font-normal text-[#BDBDBD]">
                    Fully configured posts and content presentation can help
                    increase the visibility of your posts.
                </p>
                <a
                    href="#post-content"
                    className="flex items-center gap-[10px] py-[8px] px-[16px] rounded-[4px] hover:bg-yellow1 hover:text-white transition duration-500 ease-in-out"
                >
                    <p>
                        <CiPen className="w-[24px] h-[24px]" />
                    </p>
                    <h3 className="text-[16px] leading-[19px] font-semibold">
                        Content detail
                    </h3>
                </a>
                <a
                    href="#publish-settings"
                    className="flex items-center gap-[10px] rounded-[4px] py-[8px] px-[16px] hover:bg-yellow1 hover:text-white transition duration-500 ease-in-out"
                >
                    <p>
                        <PiGearLight className="w-[24px] h-[24px]" />
                    </p>
                    <h3 className="text-[16px] leading-[19px] font-semibold">
                        Publish setting
                    </h3>
                </a>
            </div>
        </div>
    );
};

export default Purpose;
