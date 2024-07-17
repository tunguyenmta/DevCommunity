/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import "./Carousel.css";
import { useRouter } from "next/navigation";
interface Component {
  id: number;
  title: string;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  createdDate: string;
  hashTagList: {
    id: number;
    name: string;
  }[];

  resource: {
    html: string;
    css: string;
    javascript: string;
  };


  typePopular: "NONE" | "UPDATE" | "NEW";
}

interface ComponentCarousel {
  components: Component[];
}

const Carousel: React.FC<ComponentCarousel> = ({ components }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20  py-8 lg:py-20 w-full">
      <div className="w-[300px] min-h-[545px] bg-blue4 rounded-16px pt-137px pl-25px pr-16px pb-36px flex-shrink-0">
        <div className="">
          <h2 className="text-48px leading-[56px] font-bold w-1/2">
            Popular This Month
          </h2>
          <p className="leading-20px pt-56px">
            Powered by <span className=" text-blue3">SH-Community</span>
          </p>
        </div>
      </div>
      <div className="min-h-[560px] p-5 flex items-center overflow-y-hidden scrollbar-thumb-rounded-full">
        {components.map((item, index) => {
          return (
            <div
              className={`flex-shrink-0 cursor-pointer card mb-20px py-36px px-16px bg-white border-5px border-blue5 w-[400px] h-520px rounded-16px shadow-carousel ${index > 0 ? "-ml-[200px]" : "ml-0"
                } card transform-card-hover transition-transform duration-card-hover ease-out`}
              key={item.id}
              onClick={() => router.push(`/showcomponents/${item.id}`)}
            >
              <h3>
                <span className="font-bold text-gray2 mr-2">
                  {item.typePopular == "NONE"
                    ? ""
                    : item.typePopular == "NEW"
                      ? "New"
                      : "Update"}
                </span>
                <span className="text-gray2 font-extralight">
                  {item.createdDate.split("T")[0]}
                </span>
              </h3>
              <h2 className="font-bold py-[20px] text-[30px]">{item.title}</h2>
              <div className="flex items-center gap-3 text-blue3 pb-3">
                {item.hashTagList.map((tag, index) => {
                  return (
                    <button
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/articles/hashtag/${tag.id}`);
                      }}
                      key={tag.id}
                      className="px-5 py-2 rounded-md hover:bg-yellow1 hover:text-white transition duration-500 ease-in-out"
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
              <div className="overflow-y-hidden h-[60%] flex items-center justify-center pointer-events-none">
                <div className="w-[100%] h-[100%]">
                  <iframe
                    srcDoc={`<html><head>
                      <style>${item.resource.css.replace(/<\/style>/g, '<\\/style>')}}
                          </style>
                          </head>
                          <body style="height: 100vh; display: flex; justify-content: center; align-items: center;overflow:hidden">
                          ${item.resource.html.replace(/<\/script>/g, '<\\/script>')}<script>${item.resource.javascript.replace(/<\/script>/g, '<\\/script>')}
                          </script>
                          </body></html>`}
                    className="w-full h-full "
                  ></iframe>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
