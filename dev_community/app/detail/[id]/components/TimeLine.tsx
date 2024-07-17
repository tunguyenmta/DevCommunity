import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./TimeLine.css";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";

interface TableContent {
    key: string;
    title: string;
    type: string;
    href: string;
    children: TableContent[];
}

interface TableContentProps {
    tableContents: TableContent[];
    contentRef: React.RefObject<HTMLDivElement>;
}

const TimeLine: React.FC<TableContentProps> = ({ tableContents, contentRef }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showcmp, setShowshowcmp] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [scrollTimeLine, setScrollTimeLine] = useState<boolean>(true);

    const scrollToElement = (href: string) => {
        const iframe = document.getElementById("content-iframe") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            const element = iframe.contentWindow.document.getElementById(href);

            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });

                const handleScroll = () => {
                    window.scrollBy({
                        top: 500,
                        behavior: "smooth",
                    });

                    iframe.contentWindow?.removeEventListener("scroll", handleScroll);
                };

                iframe.contentWindow.addEventListener("scroll", handleScroll, { once: true });
            }
        }
    };


    const handleToggleExpand = (key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            setScrollTimeLine(scrollTop === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleScrollHide = () => {
            const commentElement = document.getElementById('commnent');
            if (commentElement) {
                const commentPosition = commentElement.getBoundingClientRect().top;
                if (commentPosition <= 0) {
                    setShowshowcmp(false);
                } else {
                    setShowshowcmp(true);
                }
            }
        };

        window.addEventListener('scroll', handleScrollHide);

        return () => {
            window.removeEventListener('scroll', handleScrollHide);
        };
    }, []);


    const renderTableContents = (contents: TableContent[]) => {
        return contents.map((entry, index) => (
            <div key={index} className="pb-1 custom-scrollbar ">
                <div className="dot-header-container">
                    <div className="flex items-center gap-2 ">
                        <span className={`dot ${activeId === `#${entry.key}` ? 'bg-blue3' : 'bg-white'}`}></span>
                        <Link
                            href={`#${entry.key}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(`#${entry.key}`);
                                scrollToElement(entry.key);
                                handleToggleExpand(entry.key);
                            }}
                            className={`hover:text-blue-600 text-[15px] block py-2.5 cursor-pointer ${activeId === `#${entry.key}` && expanded[entry.key] ? 'text-blue-600 font-medium' : ''}`}
                        >
                            {entry.title.length > 28 ? `${entry.title.slice(0, 28)}...` : entry.title}
                        </Link>
                        {entry.children.length > 0 && (
                            <div className={`ml-4 ${activeId === `#${entry.key}` && expanded[entry.key] ? 'text-blue-600 font-medium' : ''}`}>
                                {expanded[entry.key] ? <TfiAngleUp /> : <TfiAngleDown />}
                            </div>
                        )}
                    </div>
                    {expanded[entry.key] && (
                        <ul className="ml-10 delay-200 duration-300 ease-in-out">
                            {entry.children.map((example, index) => (
                                <li key={index} className='list-none'>
                                    <Link
                                        href={`#${example.key}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToElement(example.key);
                                        }}
                                        className={`hover:text-blue-600 text-[15px] block py-2.5 cursor-pointer ${activeId === `#${example.key}` ? 'text-blue-600 font-bold' : ''}`}
                                    >
                                        {example.title.length > 22 ? `${example.title.slice(0, 22)}...` : example.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    {index < contents.length - 1 && (
                        <div className="line-timeline"></div>
                    )}

                </div>
            </div>
        ));
    };

    return (
        <>
            {showcmp && (
                <div id="timeLine" className={`mt-2 fixed ${scrollTimeLine ? "top-200px" : "top-[100px]"}`}>
                    <div className="overflow-y-auto h-[calc(100vh-300px)] w-full max-w-[278px] pb-5 custom-scrollbar">
                        {renderTableContents(tableContents)}
                    </div>
                </div>
            )}
        </>
    );
};

export default TimeLine;
