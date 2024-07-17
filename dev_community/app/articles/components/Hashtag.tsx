"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TagProps {
  name: string;
  id: number;
  
}
interface TaglistProps {
  tags: TagProps[];
  currentTag?: {
    id: number;
    name: string;
  }
}
const Hashtag: React.FC<TaglistProps> = ({ tags, currentTag }) => {
  const params = useParams<{ hashtagId: string }>();
  return (
    <>
      {currentTag && <div className="px-[195px]">
        <h4 className="pt-[16px]">Category</h4>
        <h2 className="font-semibold text-[32px]">{currentTag.name}</h2>
      </div> }
      <div className="py-36px sm:px-[195px] px-[20px] flex gap-16px items-center flex-wrap">
        {tags.map((tag, index) => {
          return (
            <Link
              href={`/articles/hashtag/${tag.id}`}
              className="min-w-max py-[13px] px-[25px] border-[2px] border-[#FFFBC5] text-[#E29400] bg-[#FFFBC5] rounded-md font-semibold hover:bg-white transition duration-500 ease-in-out hover:border-[#E29400]"
              key={index}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
    </>
  );
};
export default Hashtag;
