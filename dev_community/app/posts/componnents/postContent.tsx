"use client"; 
import React, { useEffect } from "react";
// import { toast } from "react-toastify";
import Header from "../../home/components/Header";
import Taglist from "../../home/components/Taglist";
import Filters from "./FiltersPost";
import ListComponent from "./ListPost";

interface TagProps {
  id: number;
  name: string;
}

interface PostContentProps {
  tags: TagProps[];
}

const PostContent: React.FC<PostContentProps> = ({ tags }) => {
  // useEffect(() => {
  //   const state = window.history.state;
  //   if (state?.toast && state?.message) {
  //     if (state.toast === 'success') {
  //       toast.success(state.message);
  //     }
  //     window.history.replaceState({}, '', window.location.pathname);
  //   }
  // }, []);

  return (
    <div className="flex flex-col">
      <Header/>
      <Taglist tags={tags} />
      <div className="px-[40px] py-[52px] flex gap-[24px] justify-between flex-1 min-h-screen">
        <Filters />
        <div className="w-full flex flex-col">
          <ListComponent />
        </div>
      </div>
    </div>
  );
};

export default PostContent;
