// Import useEffect, useState, useRef from React
import React, { useState, useRef, useEffect } from "react";
// Import SearchResult component
import Image from "next/image";
import searchIcon from '../../../public/asstets/icons/Themes (13)/vuesax/linear/search-normal-1.svg'
import SearchResult from "./SearchResult";
import { IoClose } from "react-icons/io5";
import { SearchNormal1 } from "iconsax-react";

// Define interfaces for props and data structures
interface SearchBarProps {
  isInHeader: boolean;
}

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
  }
  description: string;
}

interface SearchResults {
  post: Post[];
  component: Component[];
  keyword: string;
}

// Searchbar component
const Searchbar: React.FC<SearchBarProps> = ({ isInHeader }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<SearchResults>({ post: [], component: [], keyword: "" });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = async (keyword: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/search/global?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data: SearchResults = await response.json();
      setResults({ ...data, keyword });
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = () => {
    if (inputRef.current) {
      const keyword = inputRef.current.value;
      if (keyword.length == 0) { // Check if the keyword is empty after trimming white spaces
        setShowResults(false); // Hide search results if keyword is empty
      } else {
        if (debounceTimer) clearTimeout(debounceTimer);
        const newTimer = setTimeout(() => handleSearch(keyword), 500); // 500ms debounce time
        setDebounceTimer(newTimer);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };
  const resetKeyword = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <div ref={resultsRef} className="flex flex-col justify-center relative">
      <div className='flex lg:ml-auto max-2xl:w-full'>
        <div
          className=' flex items-center 2xl:w-[667px] max-2xl:w-full h-[60px] '>
          <SearchNormal1 className="cursor-pointer text-gray-400 absolute left-3" />

          <input type='text'
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onFocus={(e) => {
              e.preventDefault()
            }}
            placeholder="Type keywords..."
            className='relative w-full text-xl bg-transparent outline  outline-transparent px-10 h-[60px] border border-borderGray1  rounded-md focus-within:outline-[#007bff] focus-within:bg-transparent'
            autoComplete="off"
          />
          <div className="absolute top-3 right-3">
            <IoClose size={30} className={`fill-blue-700 transition-all ease-in cursor-pointer rounded-md ${showResults ? 'rotate-90 opacity-100 bg-slate-200' : 'rotate-0 opacity-0 bg-slate-0'}`} onClick={handleCloseResults} />
          </div>
        </div>
      </div>
      {showResults && <SearchResult resetKeyword={resetKeyword} results={results} onClose={handleCloseResults} />}
    </div>
  );
};

export default Searchbar;