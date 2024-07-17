/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import ExtractTextSnippetAndHighlight from "@/app/utils/extractTextWithKeyword";
import Link from "next/link";
interface Post {
  id: number;
  title: string;
  description: string;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  totalView: number;
  createdBy: string;
  createdDate: string;
  hashTagList: string[];
  user: {
    avatar: {
      path: string;
      mediaType: string;
      originalName: string;
    };
  };
}

interface Component {
  id: number;
  title: string;
  resource: {
    html: string;
    css: string;
    javascript: string;
  };
  description: string;
}

interface SearchResults {
  post: Post[];
  component: Component[];
  keyword: string;
}

interface SearchResultProps {
  results: SearchResults;
  onClose: () => void;
  resetKeyword: () => void;
}
function extractTextSnippet(htmlContent: string, keyword: string) {
  // Using DOMParser to safely convert HTML to text
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const textContent = doc.body.textContent || "";

  // Find the index of the keyword
  const keywordIndex = textContent.toLowerCase().indexOf(keyword.toLowerCase());

  // If keyword is not found, return empty or some default text
  if (keywordIndex === -1) {
    return "Keyword not found."; // or you could return the full content or a default message
  }

  // Calculate start and end indices for the snippet
  const start = Math.max(0, keywordIndex - 50); // Adjust start index to show more context before the keyword
  const end = Math.min(textContent.length, keywordIndex + 50 + keyword.length); // Extend the end index to include the keyword and following characters

  // Extract the snippet
  let snippet = textContent.slice(start, end);

  // Highlight the keyword in the snippet for visibility
  snippet = snippet.replace(
    new RegExp(keyword, "gi"),
    (match) => `<span class="font-semibold">${match}</span>`
  );

  return snippet;
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

  const trimmed = withoutComments.trim();
  let dot: number[] = [];
  trimmed.split("").forEach((item, index) => {
    if (item == ".") dot.push(index);
  });
  return trimmed;
}
const SearchResult: React.FC<SearchResultProps> = ({
  results,
  onClose,
  resetKeyword,
}) => {
  const [showImage, setShowImage] = useState(false);

  return (

    <>
      <div className="absolute top-[70px] w-full">

        {/* fixed max-w-[410px] md:max-w-[668px] */}
        <div className="p-3 border-b-2 sticky  w-full bg-white border rounded-t-xl z-[100]">
          <button
            onClick={() => {
              setShowImage(!showImage);
            }}
            className="btn border-2px bg-gray4 font-semibold rounded-md px-3 py-2"
          >
            {showImage ? "Text" : "Images"}
          </button>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()} className="absolute max-w-[668px] top-64px z-50 bg-white shadow-searchBox rounded-b-12px mt-[75px]">
        <div className="h-full flex flex-col">
          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            {!showImage ?
              (
                <div>
                  {results.post.filter((d) => {
                    return (
                      extractTextFromHTML(d.description).includes(
                        results.keyword
                      ) || extractTextFromHTML(d.title).includes(results.keyword)
                    );
                  }).length > 0 && (
                      <h4 className="text-base font-semibold bg-blue5 p-3">
                        Articles
                      </h4>
                    )}
                  {results.post
                    .filter((d) => {
                      return (
                        extractTextFromHTML(d.description).includes(
                          results.keyword
                        ) || extractTextFromHTML(d.title).includes(results.keyword)
                      );
                    })
                    .map((item, index) => {
                      return (
                        <Link
                          href={`/detail/${item.id}`}
                          onClick={() => {
                            onClose();
                            resetKeyword();
                          }}
                          key={`post_${item.id}_${index}`}
                        >
                          <div className="group hover:bg-[#F7F9FB] transition-color duration-500 ease-in-out">
                            <div className="flex items-center p-4 border-b border-borderGray1">
                              <div className="ml-4 w-full">
                                <h4 className="text-black font-bold">
                                  <ExtractTextSnippetAndHighlight
                                    htmlContent={item.title}
                                    keyword={results.keyword}
                                  ></ExtractTextSnippetAndHighlight>
                                </h4>
                                <p className="text-black">
                                  <ExtractTextSnippetAndHighlight
                                    htmlContent={item.description}
                                    keyword={results.keyword}
                                  ></ExtractTextSnippetAndHighlight>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  {results.component.filter((d) => {
                    return (
                      extractTextFromHTML(d.description).includes(
                        results.keyword
                      ) || extractTextFromHTML(d.title).includes(results.keyword)
                    );
                  }).length > 0 && (
                      <h4 className="text-base font-semibold bg-blue5 p-3">
                        Components
                      </h4>
                    )}
                  {results.component
                    .filter((d) => {
                      return (
                        extractTextFromHTML(d.description).includes(
                          results.keyword
                        ) || extractTextFromHTML(d.title).includes(results.keyword)
                      );
                    })
                    .map((item) => {
                      return (
                        <Link
                          href={`/showcomponents/${item.id}`}
                          onClick={() => {
                            onClose();
                            resetKeyword();
                          }}
                          key={`component_${item.id}`}
                        >
                          <div className="group hover:bg-[#F7F9FB] transition-color duration-500 ease-in-out">
                            <div className="flex items-center p-4 border-b border-borderGray1">
                              <div className="ml-4">
                                <h4 className="text-black font-bold">
                                  <ExtractTextSnippetAndHighlight
                                    htmlContent={item.title}
                                    keyword={results.keyword}
                                  ></ExtractTextSnippetAndHighlight>
                                </h4>
                                <p className="text-black">
                                  <ExtractTextSnippetAndHighlight
                                    htmlContent={item.description}
                                    keyword={results.keyword}
                                  ></ExtractTextSnippetAndHighlight>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )
              :
              (
                <>
                  {results.post.length === 0 && results.component.length === 0 ?
                    (
                      <h2>Not Found</h2>
                    ) :
                    (
                      <>
                        {results.post.filter((d) => {
                          return (
                            extractTextFromHTML(d.description).includes(
                              results.keyword
                            ) ||
                            extractTextFromHTML(d.title).includes(results.keyword)
                          );
                        }).length > 0 && (
                            <h4 className="text-base font-semibold bg-blue5 p-3">
                              Articles
                            </h4>
                          )}
                        <div className="grid grid-cols-2 place-items-center	place-content-evenly p-4 gap-5">
                          {results.post
                            .filter((d) => {
                              return (
                                extractTextFromHTML(d.description).includes(
                                  results.keyword
                                ) ||
                                extractTextFromHTML(d.title).includes(
                                  results.keyword
                                )
                              );
                            })
                            .map((item) => (
                              <Link
                                onClick={() => {
                                  onClose();
                                  resetKeyword();
                                }}
                                href={`/detail/${item.id}`}
                                key={`image-post-${item.id}`}
                                className="w-full h-[250px] overflow-hidden  border-2px py-3 rounded-lg mb-5 group hover:text-blue3 transition-color duration-500 ease-in-out"
                              >
                                <div>
                                  <div className="flex justify-between items-center border-b-2 px-3 pb-2">
                                    <h4 className="font-semibold">
                                      {item.title.length > 10
                                        ? `${item.title.slice(0, 10)}...`
                                        : item.title}
                                    </h4>
                                  </div>
                                  <div className="flex justify-center items-center">
                                    <img
                                      src={`${item.cover
                                        ? process.env.NEXT_PUBLIC_BASE_IMG_URL +
                                        item.cover.path.replace(/\\/g, "/")
                                        : ""
                                        }`}
                                      alt={item.title}
                                      className="w-full h-full "
                                    />
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>

                        {results.component.filter((d) => {
                          return (
                            extractTextFromHTML(d.description).includes(
                              results.keyword
                            ) ||
                            extractTextFromHTML(d.title).includes(results.keyword)
                          );
                        }).length > 0 && (
                            <h4 className="text-base font-semibold bg-blue5 p-3">
                              Components
                            </h4>
                          )}

                        <div className="grid grid-cols-2 place-items-center	place-content-evenly p-4 gap-5">
                          {results.component
                            .filter((d) => {
                              return (
                                extractTextFromHTML(d.description).includes(
                                  results.keyword
                                ) ||
                                extractTextFromHTML(d.title).includes(
                                  results.keyword
                                )
                              );
                            })
                            .map((item) => {
                              return (
                                <div
                                  key={`image-component-${item.id}`}
                                  className="relative w-full overflow-hidden border-2px rounded-lg mb-5 group hover:text-blue3 transition-color duration-500 ease-in-out"
                                >
                                  <div>
                                    <div className="flex justify-between items-center border-b-2 p-3 pb-2">
                                      <h4 className="font-semibold">
                                        {item.title}
                                      </h4>
                                    </div>
                                    <div className="flex justify-center items-center ">
                                      <div className="w-full h-full">
                                        <iframe
                                          srcDoc={`<html><head><style>${item.resource.css}
                          </style></head><body style="height: 100vh; display: flex;flex-direction: column; justify-content: center; align-items: center;overflow:hidden">${item.resource.html}<script>${item.resource.javascript}</script></body></html>`}
                                          className="w-full h-[250px] "
                                        ></iframe>
                                      </div>
                                    </div>
                                  </div>
                                  <Link
                                    onClick={() => {
                                      onClose();
                                      resetKeyword();
                                    }}
                                    href={`/showcomponents/${item.id}`}
                                    className="absolute inset-0 bg-opacity-50 opacity-0 transition-opacity"
                                  ></Link>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    )
                  }
                </>
              )}
            <div className="p-4 flex justify-center">
              <button
                className="p-3 text-white font-bold bg-blue3 w-full rounded-[8px] shadow-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
