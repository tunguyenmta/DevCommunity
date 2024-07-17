/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
interface Card {
  id: number;
  title: string;
  content: string;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  totalView: number;
  user: {
    username: string;
    avatar: {
      path: string;
      mediaType: string;
      originalName: string;
    };
  };
  createdDate: string;
  hashTagList: {
    id: number;
    name: string;
  }[];
}

interface LatestProps {
  cards: Card[];
}

function extractTextFromHTML(htmlContent: string) {
  // Remove HTML tags and CSS
  const withoutTags = htmlContent.replace(/<[^>]+>/g, "");

  // Remove CSS
  const withoutCSS = withoutTags.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove JavaScript
  const withoutJS = withoutCSS.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Remove comments
  const withoutComments = withoutJS.replace(/<!--[\s\S]*?-->/g, "");

  // Trim excess whitespace
  const trimmed = withoutComments.trim();
  let dot: number[] = [];
  trimmed.split("").forEach((item, index) => {
    if (item == ".") dot.push(index);
  });
  // Return the extracted text
  return trimmed.slice(0, dot[2]);
}

const Latest: React.FC<LatestProps> = ({ cards }) => {
  const router = useRouter();
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/articles/hashtag/${id}`);
  };
  return (
    <div className="grid md:flex py-5 px-6 md:py-95px md:px-77px md:gap-x-5 gap-y-20 ">
      <div className="flex md:flex-col md:items-center">
        <div className="border-l-2 border-black1 h-150px mb-16px md:block hidden"></div>
        <div
          className="text-[35px] md:text-48px text-black1 font-bold rotate-0 md:rotate-360 md:[writing-mode:vertical-rl] md:[writing-mode:0]"
          style={{
            textOrientation: "mixed",
          }}
        >
          Latest & Greatest
          <div className="border-b-2 border-black1 w-full md:hidden block"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between gap-20 w-full">
        {cards.map((item, index) => {
          return (
            <Link key={item.id} href={`/detail/${item.id}`} >
              <div className="grid md:flex gap-10 group">
                <div className="flex ">
                  {item.user.avatar ? (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_BASE_IMG_URL +
                        item.user.avatar.path
                      }
                      alt={item.title}
                      className="shadow-avatarShadow w-[96px] h-[96px] object-cover border-[5px] rounded-[16px] border-blue-500 rotate-[18deg] group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                    />
                  ) : (
                    <Avatar
                      name={item.user.username.split("")[0]}
                      className="w-[96px] h-[96px] object-cover border-[5px] border-blue3 rounded-[16px] rotate-[18deg] group-hover:rotate-[0] transition-transform duration-500 ease-in-out"
                      color="#FFD8BF"
                      style={{
                        border: "none",
                        boxSizing: "content-box",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 max-w-4/5">
                  <div className="flex justify-between">
                    <h4 className="text-blue3 font-semibold text-[20px] leading-[24px]">
                      {item.user.username}{" "}
                      <span className="pl-1 text-gray2 font-light text-[16px] leading-[19px]">
                        Wrote
                      </span>
                    </h4>
                    {item.totalView > 1000 && (
                      <h4 className="text-red1 flex items-center gap-3">
                        <span>
                          <svg
                            width="15"
                            height="16"
                            viewBox="0 0 15 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.94912 1.03516L7.68412 1.53128C8.61648 2.15106 9.33268 3.11053 9.71412 4.25078C9.84362 3.92266 9.99762 3.60437 10.1405 3.28281L10.7128 3.92659C11.9973 5.37166 13.217 7.53728 13.217 9.64056C13.217 12.4611 11.6712 14.2494 9.19787 14.5585L8.38704 14.6596L8.56437 13.7638C8.70262 13.0629 8.72771 12.6048 8.69854 12.2839C8.66354 11.8803 8.49321 11.5634 8.28087 11.2484C8.07787 10.9465 7.87662 10.644 7.71562 10.3099C7.05354 10.8986 6.79687 11.4302 6.71462 11.8679C6.60962 12.4283 6.75837 13.0012 7.03021 13.6128L7.50971 14.6917L6.44454 14.5585C4.94187 14.3708 3.46137 13.2414 2.87804 11.5936C2.26846 9.86959 2.69954 7.78338 4.66887 5.86319C5.97554 4.58941 6.66737 2.93762 6.94912 1.03516ZM7.72612 3.20078C7.28162 4.60516 6.42821 5.88484 5.43246 6.85544C3.73437 8.51116 3.58212 10.0343 3.96246 11.1079C4.24537 11.9086 4.85612 12.5668 5.58004 12.9402C5.49496 12.498 5.49257 12.0408 5.57304 11.5975C5.76321 10.5829 6.41187 9.63203 7.65787 8.75594L8.28612 8.31428L8.52062 9.10506C8.72596 9.79806 9.15179 10.2883 9.48487 10.8966C9.85121 11.566 9.92121 12.3338 9.84654 13.1003C11.3749 12.6705 12.0504 11.3665 12.0504 9.64056C12.0504 8.18237 11.2687 6.75175 10.4929 5.6335C10.1732 6.43937 9.49945 6.72288 8.84204 7.093V6.03119C8.84204 5.13278 8.51712 4.0375 7.72612 3.20144V3.20078Z"
                              fill="#FF274C"
                            />
                          </svg>
                        </span>
                        <span>
                          {item.totalView}{" "}
                          {item.totalView > 1 ? "views" : "view"}
                        </span>
                      </h4>
                    )}
                  </div>
                  <h2 className="text-32px leading-[38px] font-semibold pt-[22px] pb-25px group-hover:text-blue3 transition duration-500 ease-in-out">
                    {item.title.length > 100
                      ? item.title.substring(0, 100) + "..."
                      : item.title}
                  </h2>
                  <p className="text-black1">
                    {extractTextFromHTML(item.content).length > 200
                      ? `${extractTextFromHTML(item.content).substring(
                        0,
                        200
                      )}...`
                      : extractTextFromHTML(item.content)}
                  </p>
                  <div className="flex items-center gap-2 pt-16px">
                    <p className="font-light text-gray2">
                      {item.createdDate.split("T")[0]} in
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.hashTagList.map((tag, i) => {
                        return (
                          <React.Fragment key={tag.id}>
                            <button
                              style={{ textUnderlineOffset: "4px", textDecorationThickness: "2px" }}
                              className="underline font-semibold hover:bg-white hover:text-blue3 transition duration-500 ease-in-out "
                              onClick={(
                                e: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ) => handleButtonClick(e, tag.id)}
                            >
                              {tag.name}
                            </button>
                            {i < item.hashTagList.length - 1 && <span className="text-[18px]">, </span>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

          );
        })}
      </div>
    </div>
  );
};

export default Latest;
