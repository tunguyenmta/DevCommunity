/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { RiAttachment2 } from "react-icons/ri";
import { useAppContext } from "@/app/utils/contextProvider";
interface Example {
  id: number;
  title: string;
  resource: {
    html: string;
    css: string;
    javascript: string;
  };
}
interface SearchResults {
  example: Example[];
  keyword: string;
}

interface SearchResultProps {
  results: SearchResults;
  onClose: () => void;
  setRelatedExample: (exampleID: number[]) => void;
  listExample: number[];
  setListExample: (listExample: Example[]) => void;
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
  return trimmed.slice(0, dot[1]);
}
const SearchResult: React.FC<SearchResultProps> = ({
  results,
  onClose,
  setRelatedExample,
  listExample,
  setListExample,
}) => {
  const [exampleRelated, setExampleRelated] = useState<number[]>([
    ...listExample,
  ]);
  const {userToken} = useAppContext()
  const [listAllExample, setListAllExample] = useState<Example[]>([]);
  const fetchAllExample = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/examples?keyword= `,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const data = await response.json();
    setListAllExample(data);
  };
  useEffect(() => {
    fetchAllExample();
  }, []);
  const handleAddExample = (example: Example) => {
    if (!exampleRelated.includes(example.id)) {
      if (exampleRelated.length >= 4) {
        // Remove the first item and add the new one
        setExampleRelated((prev) => [...prev.slice(1), example.id]);
      } else {
        // Add the new item
        setExampleRelated((prev) => [...prev, example.id]);
      }
    } else {
      // Remove the item
      setExampleRelated((prev) => prev.filter((item) => item !== example.id));
    }
  };

  return (
    <>
      <div className="absolute max-h-screen overflow-y-auto w-667px top-64px z-50 bg-white shadow-searchBox rounded-b-12px">
        <div className="h-[85vh] max-h-[85vh] flex flex-col">
          <div className="flex-1 p-[30px] flex gap-5 flex-wrap">
            {results.example.map((example) => {
              return (
                <div
                  key={example.id}
                  className="w-[48%] h-[280px] rounded-[8px] border-[1px]"
                >
                  <div className="flex justify-between p-3">
                    <h3 className="text-[14px] font-semibold">
                      {example.title}
                    </h3>
                    <button
                      onClick={() => handleAddExample(example)}
                      className={`w-[20px] h-[20px] rounded-[6px] border-[1px] ${
                        exampleRelated.includes(example.id)
                          ? "border-blue3"
                          : "border-black"
                      }  flex items-center justify-center`}
                    >
                      {exampleRelated.includes(example.id) ? (
                        <FaCheck className="text-blue3" />
                      ) : (
                        ""
                      )}
                    </button>
                  </div>
                  <div className="border-t-[1px]">
                    <div className="p-5">
                      {/* <img src={process.env.NEXT_PUBLIC_BASE_IMG_URL + example.cover.path} alt={example.title} className="object-fit"/> */}
                      <div className="w-[95%] h-[100%]">
                        <iframe
                          srcDoc={`<html><head><style>${example.resource.css}
                          body, html{
                          height: 100%;
                          }
                          </style></head><body style="height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden">${example.resource.html}<script>${example.resource.javascript}</script></body></html>`}
                          className="w-full h-full "
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute z-50 -bottom-[85vh] w-full bg-white p-5 flex justify-end gap-5 items-center">
        <button
          className="py-3 px-5 font-bold bg-gray-200 rounded-[8px] hover:bg-gray-500 hover:text-white transition duration-500 ease-in-out"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
        {exampleRelated.length > 0 ? (
          <button
            onClick={() => {
              setListExample(
                listAllExample.filter((item) =>
                  exampleRelated.includes(item.id)
                )
              );
              setRelatedExample(
                results.example
                  .filter((item) => exampleRelated.includes(item.id))
                  .map((d) => d.id)
              );
              onClose();
            }}
            className="flex items-center bg-blue3 py-3 px-5 rounded-[8px] text-white gap-[10px] group hover:bg-yellow1 transition duration-500 ease-in-out"
          >
            <div className="border-[1px] boder-white rounded-[4px] p-[2px]">
              <RiAttachment2 />
            </div>{" "}
            <p>
              Attach {exampleRelated.length}{" "}
              {exampleRelated.length > 1 ? "components" : "component"}
            </p>
          </button>
        ) : (
          <button
            onClick={() => {
              setListExample(
                listAllExample.filter((item) =>
                  exampleRelated.includes(item.id)
                )
              );
              setRelatedExample(
                results.example
                  .filter((item) => exampleRelated.includes(item.id))
                  .map((d) => d.id)
              );
              onClose();
            }}
            className="flex items-center bg-red1 py-3 px-5 rounded-[8px] text-white gap-[10px] group hover:bg-yellow1 transition duration-500 ease-in-out"
          >
            Clear Related
          </button>
        )}
      </div>
    </>
  );
};

export default SearchResult;
