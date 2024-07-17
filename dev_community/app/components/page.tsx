import React from "react";
import Header from "../home/components/Header";
import Taglist from "../home/components/Taglist";
import ListComponent from "./components/listComponent";
import Filters from "../posts/componnents/FiltersPost";
// Api tagList header
const fetchTags = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`,
        {
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                Expires: "0",
            },
            cache: "no-store",
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch tags");
    }
    return res.json();
};

const Components = async () => {
    const tags = await fetchTags();
    return (
        <div className="flex flex-col">
            <Header
            />
            <Taglist tags={tags} />
            <div className="px-[40px] py-[52px] flex gap-[24px] justify-between flex-1 min-h-screen">
                <Filters />
                <div className="w-full flex flex-col">
                    <ListComponent></ListComponent>
                </div>
            </div>
        </div>
    )
}

export default Components;