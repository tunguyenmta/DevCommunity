"use client";
import React, { useState, useRef, useEffect } from "react";
import SearchResult from "./searchResult";
import { useAppContext } from "@/app/utils/contextProvider";
import Image from "next/image";
import searchIcon from '../../../../public/asstets/icons/Themes (13)/vuesax/linear/search-normal-1.svg'

interface Example {
  id: number;
  title: string;
  resource: {
    html: string
    css: string
    javascript: string
  }
}

interface SearchResults {
  example: Example[];
  keyword: string;
}

interface SearchBarRelatedProps {
  setRelatedExample: (exampleIds: number[]) => void;
  closeSearchDiv: () => void;
  listExampleID: number[];
  setListExample: (listExample: Example[]) => void;
}

const Searchbar: React.FC<SearchBarRelatedProps> = ({
  setRelatedExample,
  closeSearchDiv,
  listExampleID,
  setListExample,
}) => {
  const {userToken} = useAppContext()
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<SearchResults>({
    example: [],
    keyword: "",
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = async (keyword: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/examples?keyword=${keyword}`,
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
      setResults({ example: data, keyword });
      setShowResults(data.length > 0); // Show results only if there are examples
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleInputChange = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const keyword = inputRef.current?.value || "";
    const timeoutId = setTimeout(() => {
      // Check if keyword is not empty (including spaces)
      if (keyword.length > 0) {
        handleSearch(keyword);
        setShowResults(true); // Show results if keyword length is greater than 0
      } else {
        setShowResults(false); // Close search results if keyword length equals 0
      }
    }, 250);
    setTypingTimeout(timeoutId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        closeSearchDiv();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowResults(false);
        closeSearchDiv();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearchDiv]);

  const handleCloseResults = () => {
    setShowResults(false);
    closeSearchDiv();
  };

  return (
    <div ref={resultsRef} className="flex justify-center relative">
      <div className="relative flex items-center">
        <Image src={searchIcon} alt="search" className="w-[24px] h-[24px] absolute left-[30px]"/>
        <input
          type="text"
          className="border border-borderGray1 rounded-12px w-667px h-68px pl-20"
          placeholder="Search something..."
          ref={inputRef}
          onKeyDown={handleInputChange}
          onChange={handleInputChange}
        />
      </div>
      {showResults && results.example.length > 0 && (
        <SearchResult
          setListExample={setListExample}
          listExample={listExampleID}
          setRelatedExample={setRelatedExample}
          results={results}
          onClose={handleCloseResults}
        />
      )}
    </div>
  );
};

export default Searchbar;
