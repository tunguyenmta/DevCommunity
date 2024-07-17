/* eslint-disable @next/next/no-img-element */
import React from "react";

const RelatedItems = ({ cover, title }: any) => {
    return (
        <div className="flex flex-col mt-6 pointer-events-none">
            <div className="h-[300px]">
                <iframe
                    srcDoc={`<html><head><style>${cover.css}
                                body, html{
                                height: 100%;
                                width: 100%;}
                        </style></head><body style="height: 100vh; display: flex; justify-content: center; align-items: center; overflow: hidden">${cover.html}<script>${cover.javascript}</script></body></html>`}
                    className="w-full h-full "
                ></iframe>
            </div>
            <h3 className="text-black1 font-inter font-normal text-xl leading-5 mt-2 text-center">{title}</h3>
        </div>
    );
};

export default RelatedItems;
