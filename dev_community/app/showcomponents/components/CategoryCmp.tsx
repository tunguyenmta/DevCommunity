import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';

interface Example {
    id: number;
    title: string;
}

const CategoryCmp = ({ examples }: { examples: Example[] }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [showcmp, setShowshowcmp] = useState<boolean>(true);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const href = e.currentTarget.href;
        const targetId = href.replace(/.*\#/, "");
        const elem = document.getElementById(targetId);
        const headerOffset = 300;
        const elementPosition = elem?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    };

    const handleClick = () => {
        setShow((prev) => !prev);
    };

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

    const [scrollCategory, setScrollCategory] = useState<boolean>(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            setScrollCategory(scrollTop === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {showcmp && (
                <div className={`max-w-[278px] 2xl:w-[278px] fixed end-0 z-[10] lg:block hidden transition-all ease-in ${!scrollCategory ? 'top-[110px]' : ''}`}>
                    <nav className="mx-auto px-4 relative">
                        <div className="line-connector"></div>
                        <div className="mb-4 dot-header-container">
                            <div className='flex items-center gap-3'>
                                <span className={`dot ${activeId === 'whentouse' ? 'bg-blue3' : 'bg-white'}`}></span>
                                <Link
                                    href='#whentouse'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveId('whentouse');
                                        handleScroll(e);
                                    }}
                                    className={`hover:text-blue-600 block cursor-pointer ${activeId === 'whentouse' ? 'text-blue-600 font-bold' : ''}`}
                                >
                                    When To Use
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4 dot-header-container">
                            <div className='flex items-center gap-3'>
                                <span className={`dot ${activeId === 'examples' && show ? 'bg-blue3' : 'bg-white'}`}></span>
                                <Link
                                    href='#examples'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveId('examples');
                                        handleScroll(e);
                                        handleClick();
                                    }}
                                    className={`hover:text-blue-600 block  cursor-pointer ${activeId === 'examples' && show ? 'text-blue-600 font-bold' : ''}`}
                                >
                                    Examples
                                </Link>
                                <div onClick={handleClick} className={`ml-14 cursor-pointer ${activeId === 'examples' && show ? 'text-blue-600 font-bold' : ''}`}>
                                    {show ? <TfiAngleUp /> : <TfiAngleDown />}
                                </div>
                            </div>

                            {show && (
                                <ul className={`ml-10 delay-200 duration-300 ease-in-out ${show ? 'delay-200 max-h-[1000px] opacity-100' : 'delay-200 max-h-0 overflow-hidden opacity-0'}`}>
                                    {examples.map(example => (
                                        <li key={example.id} className='list-none'>
                                            <Link
                                                href={`#example-${example.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveId(`example-${example.id}`);
                                                    handleScroll(e);
                                                }}
                                                className={`hover:text-blue-600 block py-2.5  cursor-pointer ${activeId === `example-${example.id}` ? 'text-blue-600 font-bold' : ''}`}
                                            >
                                                {example.title.length > 22 ? `${example.title.slice(0, 22)}...` : example.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                        <div className="mb-4 dot-header-container">
                            <div className='flex items-center gap-3'>
                                <span className={`dot ${activeId === 'commnent' ? 'bg-blue3' : 'bg-white'}`}></span>
                                <Link
                                    href='#commnent'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveId('commnent');
                                        handleScroll(e);
                                    }}
                                    className={`hover:text-blue-600 block  cursor-pointer ${activeId === 'commnent' ? 'text-blue-600 font-bold' : ''}`}
                                >
                                    Commnent
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default CategoryCmp;
