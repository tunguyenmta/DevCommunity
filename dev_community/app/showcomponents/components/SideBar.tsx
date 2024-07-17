import useSWR from 'swr';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveItem } from '@/app/utils/ActiveItemContext';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
});

const SideBar = () => {
    const { data: sections, error, isLoading } = useSWR<ShowComponentData | undefined>(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/components`, fetcher, {
        revalidateOnFocus: false
    });
    const { activeItem, setActiveItem } = useActiveItem();
    const pathname = usePathname();

    useEffect(() => {
        setActiveItem(pathname);
    }, [pathname, setActiveItem]);

    if (isLoading) {
        return (
            <div className="md:block hidden">
                <div className="w-full max-w-md mx-auto animate-pulse p-9">
                    <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                    <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-300"></p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-black">Error: {error.message}</div>;
    }

    return (
        <div className="max-w-[300px] md:block hidden">
            <nav className="border-r-[1px] w-[304px]">
                <ul>
                    <li className='list-none'>
                        <Link
                            href='/showcomponents'
                            onClick={() => setActiveItem('/showcomponents')}
                            className={`text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded pl-6 py-2.5 transition-all cursor-pointer ${activeItem === '/showcomponents' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            Components Overview
                        </Link>
                    </li>
                </ul>

                {sections?.folders.map((section) => (
                    section.totalComponent > 0 && (
                        <div key={section.id} className="mt-4">
                            <h6 className="text-[#BDBDBD] pl-6 text-sm font-bold">{section.name}</h6>
                            <div className='border-[1px] ml-6 mt-3 w-[250px]'></div>
                            <ul className="mt-2">
                                {section.components.map((item) => (
                                    <li key={item.id} className='list-none'>
                                        <Link
                                            href={`/showcomponents/${item.id}`}
                                            onClick={() => setActiveItem(`/showcomponents/${item.id}`)}
                                            className={`hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded pl-6 py-2.5 transition-all cursor-pointer ${activeItem === `/showcomponents/${item.id}` ? 'bg-blue-50 text-blue-600' : ''}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
                {(sections?.components ?? []).length > 0 && (
                    <div className="mt-4">
                        <h6 className="text-[#BDBDBD] pl-6 text-sm font-bold">Other</h6>
                        <div className='border-[1px] ml-10 mt-3 w-[230px]'></div>
                        <ul className="mt-2">
                            {sections?.components.map((section) => (
                                <li key={section.id} className='list-none'>
                                    <Link
                                        href={`/showcomponents/${section.id}`}
                                        onClick={() => setActiveItem(`/showcomponents/${section.id}`)}
                                        className={`hover:text-blue-600 text-[15px] block
                                             hover:bg-blue-50 rounded pl-6 py-2.5 transition-all cursor-pointer ${activeItem === `/showcomponents/${section.id}` ? 'bg-blue-50 text-blue-600' : ''}`}
                                        passHref
                                    >
                                        {section.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default SideBar;
