/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Pagination, Carousel, notification } from "antd";
import Link from "next/link";
import Image from "next/image";
import smsicon from "../../../public/asstets/icons/Themes (13)/vuesax/linear/sms.svg";

import "./Book.css";
interface book {
  id: number;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  href: string;
  title: string;
}
interface BookProps {
  books: book[];
}

interface Component {
  id: number;
  title: string;
  resource: {
    html: string;
    css: string;
    javascript: string;
  };
  createdDate: string;
  hashTagList: {
    id: number;
    name: string;
  }[];
  typePopular: "NONE" | "UPDATE" | "NEW";
}

const Book: React.FC<BookProps> = ({ books }) => {
  const [componentsHighlights, setComponentsHighlights] = useState<Component[]>(
    []
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const pageSize = 8; // Number of posts per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalBooks = books.length;

  // Function to get the posts for the current page
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return books.slice(startIndex, endIndex);
  };


  // Function to handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchComponentPopular = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/component/popular`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch popular components");
    }
    let data: Component[] = await res.json();
    if (data.length > 5) {
      data = data.slice(0, 5);
    }
    setComponentsHighlights(data);
  };
  useEffect(() => {
    fetchComponentPopular();
  }, []);

  const handleSubscribe = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/subcribe-mail/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      setEmailError("Failed to subscribe.");
    } else {
      notification.success({
        message: "Success",
        description: "Subscribed successfully!",
        placement: "top",
      });
      setEmail("");
    }
  };

  useEffect(() => {
    fetchComponentPopular();
  }, []);

  return (
    <div className="py-10 lg:py-[100px] px-6 lg:px-195px" id="book-container">
      <div className="flex items-center gap-x-16px">
        <div className="h-2px w-150px border-2px border-black1 md:block hidden"></div>
        <h2 className="text-[28px] md:text-48px font-semibold">Books & Whitepapers</h2>
      </div>
      <div className="lg:flex grid gap-20px mt-16 min-h-[997px]">
        <div className="min-w-[65%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-20px place-items-center">
            {books.map((item, index) => {
              return (
                <a href={item.href} target="_blank" key={item.id}>
                  <div className="rounded-12px bg-blue7 p-12px h-full min-h-[420px]">
                    <div>
                      <img
                        src={
                          item.cover
                            ? process.env.NEXT_PUBLIC_BASE_IMG_URL +
                            item.cover.path
                            : ""
                        }
                        alt={item.title}
                        className="w-full h-[297px] object-cover"
                      />
                    </div>
                    <h2 className="w-full text-28px font-semibold pt-12px px-12px pb-[20px] group-hover:text-blue3 transition duration-500 ease-in-out">
                      {item.title}
                    </h2>
                  </div>
                </a>
              );
            })}
          </div>


        </div>
        <div className="min-w-[35%] pt-44px pb-[70px] bg-white shadow-lg px-7 rounded-md border-2px border-gray-200">
          <div className="w-full mb-10 ">
            <h1 className="font-bold text-[30px] leading-9 text-center text-black1">
              Useful front-end & UX tips, delivered once a week.
            </h1>
            <p className="font-normal text-[20px] leading-6 text-center text-black1 mt-8 max-w-[407px] mx-auto">
              With tools to help you get your work done better. Subscribe and
              get notifications — in your inbox. 🎁
            </p>
            <div className="w-6 h-6 justify-center items-center flex">
              <div className="w-6 h-6 relative"></div>
            </div>
            <div className="relative w-full">
              <Image
                src={smsicon}
                alt=""
                className="z-30 text-center  absolute left-4 top-1/2 -translate-y-1/2"
              ></Image>
              <input
                type="email"
                className="w-full h-16 rounded-lg border px-4 pr-44 pl-12 relative shadow-lg"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                className="text-center border border-blue-500 bg-blue-500 rounded-lg absolute right-4 top-1/2 -translate-y-1/2 text-white px-4 py-3 font-semibold text-lg leading-4 hover:bg-white hover:text-blue-500 transition ease-in-out duration-500"
              >
                Subscribe
              </button>
            </div>
            {emailError && (
              <span className="text-red-500 text-sm mt-2 block">
                {emailError}
              </span>
            )}
          </div>
          <div>
            <div className="carousel pt-5">
              <Carousel autoplay>
                {componentsHighlights.map((item, index) => {
                  return (
                    <div key={item.id} className="w-[365px] h-[450px] ">
                      <div className="w-full h-full">
                        <iframe
                          srcDoc={`
                          <html>
                          <head>
                          <style>
                           * {
                                box-sizing: border-box;
                            }
                          ${item.resource.css.replace(/<\/style>/g, '<\\/style>')}}
                         
                          </style>
                          </head>
                          <body style="height: 90vh; display: flex; justify-content: center; align-items: center;overflow: hidden;">
                          ${item.resource.html.replace(/<\/script>/g, '<\\/script>')}
                          <script>${item.resource.javascript.replace(/<\/script>/g, '<\\/script>')}
                          </script></body></html>`}
                          className="w-full h-full "
                        ></iframe>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
          {/* <div className="flex justify-center pt-[60px]">
            <Link
              href="/showcomponents"
              className="py-8px px-32px bg-blue3 text-white rounded-md text-13px hover:bg-yellow1 transition duration-500 ease-in-out"
            >
              Get more components
            </Link>
          </div> */}
        </div>
      </div>
      <div className="text-center p-[50px]">
        {books.length > 8 && (
          <Pagination
            current={currentPage}
            defaultCurrent={1}
            total={totalBooks}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Book;
