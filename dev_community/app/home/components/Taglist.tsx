'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoPlaySkipForwardOutline } from "react-icons/io5";

interface TagProps {
  id: number;
  name: string;
}
interface TaglistProps {
  tags: TagProps[];
}

const Taglist: React.FC<TaglistProps> = ({ tags }) => {

  return (
    <div className="sticky top-0 left-0 right-0 z-20 bg-white">
      <div className="flex items-center gap-6 py-[12px] px-6 shadow-headerShadow overflow-x-auto custom-scrollbar">
        {
          tags.slice(0, 10).map((tag, index) => (
            <Link key={index} href={`/articles/hashtag/${tag.id}`}>
              <button
                key={tag.id}
                className="min-w-max py-[12px] px-[16px] border-[2px] text-blue3 bg-blue5 rounded-md font-semibold hover:bg-white transition duration-500 ease-in-out hover:text-blue3 hover:border-blue3"
              >
                {tag.name}
              </button>
            </Link>
          ))}
        <Link href="/articles" className="flex items-center min-w-max gap-2 border bg-white border-blue3 rounded-md text-blue3 py-[13px] px-[25px] font-semibold group transition duration-500 ease-in-out hover:text-white hover:bg-blue3 hover:border-blue3">
          <h2>
            <span>Jump to all articles</span>
          </h2>
          <span>
            <IoPlaySkipForwardOutline />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Taglist;
