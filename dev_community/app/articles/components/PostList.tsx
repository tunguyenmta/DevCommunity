/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import CardPost from "./CardPost";
import "./Postlist.css";
interface Post {
    id: number;
    title: string;
    content: string;
    cover: string;
    totalView: number;
    createdDate: string;
    user: {
        username: string;
        avatar: string;
    };
    hashTagList: {
        name: string;
        id: number;
    }[];
    readMediumTime: number;
    totalComment: number;
}

interface PostListProps {
    posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPosts = posts.length;
    const [pageSize, setPageSize] = useState<number>(10); // Number of posts per page

    const totalPages = Math.ceil(totalPosts / pageSize);

    // Function to get the posts for the current page
    const getCurrentPagePosts = (): Post[] => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return posts.slice(startIndex, endIndex);
    };

    // Function to handle page change
    const onPageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById("trending-post-list");

        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: "smooth", // optional, for smooth scrolling
            });
        }
    };

    const onShowSizeChange = (current: number, size: number) => {
        setPageSize(size);
        setCurrentPage(current);
    };

    useEffect(() => {
        // Ensure current page is within valid range when posts change
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [posts]);

    return (
        <>
            <div className="sm:pl-204px pl-6 pr-536px" id="trending-post-list">
                {getCurrentPagePosts().map((post: Post) => {
                    return <CardPost key={post.id} {...post} />;
                })}
            </div>
            <div
                className="flex justify-center md:justify-end sm:pr-536px pb-134px"
                id="trending-pagination"
            >
                {posts.length > 0 && (
                    <Pagination
                        current={currentPage}
                        total={totalPosts}
                        pageSize={pageSize}
                        onChange={onPageChange}
                        showSizeChanger={totalPosts > 10 ? true : false}
                        onShowSizeChange={onShowSizeChange}
                    />
                )}
            </div>
        </>
    );
};

export default PostList;
