import React from "react";
import Image from "next/image";
import { TbShare3 } from "react-icons/tb";
import { MainComponent, Tag } from "iconsax-react";

interface HashTag {
    id: number;
    name: string;
}
const HashtagList = ({ hashTagList, componentId }: { hashTagList: HashTag[], componentId: number | undefined }) => {
    return (
        <>
            <div className="self-stretch flex-col justify-center items-start gap-2 flex bg-gray4 p-5 mt-2 rounded-lg">
                <div className="self-stretch justify-start items-start md:flex md:flex-row sm:flex-col">
                    <div className="flex items-center gap-2 mr-5">
                        <MainComponent className="text-blue3" />
                        <span className="font-normal text-gray1">{hashTagList.length} Examples</span>
                    </div>
                    <div className=" flex items-center gap-2 ">
                        <div className=" items-center flex gap-2  flex-wrap my-2 md:my-0">
                            <span>
                                {" "}
                                <Tag className="text-blue3" />
                            </span>
                            {hashTagList.map((hashTag) => (
                                <div key={hashTag.id} className="flex items-center">
                                    <a className="text-blue3 underline text-base font-normal font-inter leading-tight cursor-pointer mr-2">
                                        {hashTag.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="justify-start items-start flex text-base font-inter font-normal">
                    <TbShare3 className="text-blue3 size-6 mr-2" />
                    <span className="text-gray1 mr-2">Share on</span>
                    <a
                        href={"https://www.facebook.com/sharer/sharer.php?u=" + process.env.NEXT_PUBLIC_LINK_SHARE + "/detail/" + componentId}
                        className="text-blue3 underline"
                        target="_blank"
                    >
                        Facebook
                    </a>
                    ,{" "}
                    <a
                        href={`https://x.com/share?url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${componentId}`}
                        className="text-blue3 underline ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        X
                    </a>
                    ,{" "}
                    <a
                        href={`http://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_LINK_SHARE}/detail/${componentId}`}
                        className="text-blue3 underline ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Linkedin
                    </a>
                </div>
            </div>
        </>
    );
};

export default HashtagList;
