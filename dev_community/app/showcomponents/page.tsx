"use client";
import useSWR from 'swr';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import Loading from './components/loading';
import { useActiveItem } from '../utils/ActiveItemContext';
import { SearchNormal1 } from 'iconsax-react';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
});

const Page = () => {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/components`, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ShowComponentData | null>(null);
    const [noResults, setNoResults] = useState<boolean>(false);
    const { setActiveItem } = useActiveItem();

    const debouncedSearch = debounce((term: string, data: ShowComponentData) => {
        const filteredFolders = data.folders
            .map(folder => ({
                ...folder,
                components: folder.components.filter(component =>
                    component.title.toLowerCase().includes(term)
                )
            }))
            .filter(folder => folder.components.length > 0);

        const filteredComponents = data.components.filter(component =>
            component.title.toLowerCase().includes(term)
        );

        const results = { folders: filteredFolders, components: filteredComponents };
        setSearchResults(results);
        setNoResults(filteredFolders.length === 0 && filteredComponents.length === 0);
    }, 300);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        if (data) {
            debouncedSearch(term, data);
        }
    };

    const displayData = useMemo(() => searchResults || data, [searchResults, data]);

    const renderComponent = (component: Component) => {
        return (
            <div key={component.id} className="relative cursor-pointer hover:scale-[1.02] transition-all">
                <div className="relative aspect-w-16 aspect-h-8 h-[300px] lg:h-[300px] shadow-md rounded-lg">
                    <div className="w-full h-full overflow-hidden grid place-content-center">
                        <iframe
                            srcDoc={`
                          <html>
                          <head>
                          <style>
                           * {
                                box-sizing: border-box;
                            }
                          ${component.resource.css.replace(/<\/style>/g, '<\\/style>')}}
                         
                          </style>
                          </head>
                          <body style="height: 100vh; display: flex; justify-content: center; align-items: center;overflow: hidden;">
                          ${component.resource.html.replace(/<\/script>/g, '<\\/script>')}
                          <script>${component.resource.javascript.replace(/<\/script>/g, '<\\/script>')}
                          </body></html>`}
                            className="w-[400px] min-h-screen md:w-max"
                        ></iframe>
                    </div>
                    <Link href={`/showcomponents/${component.id}`} className="absolute inset-0 bg-opacity-50 opacity-0 transition-opacity" onClick={() => setActiveItem(`/showcomponents/${component.id}`)}></Link>
                </div>
                <div className="p-4">
                    <Link href={`/showcomponents/${component.id}`} onClick={() => setActiveItem(`/showcomponents/${component.id}`)}>
                        <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600">{component.title}</h3>
                    </Link>
                </div>
            </div>
        );
    };

    const renderFolder = (folder: Folder) => (
        <div key={folder.id}>
            {folder.components.length > 0 && (
                <div className='mt-[56px]'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-[25px] leading-[30px] font-bold'>{folder.name}</h1>
                        <span className='bg-[#FF274C] px-2.5 py-1.2 rounded-lg text-white'>{folder.totalComponent}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-6">
                        {folder.components.map(renderComponent)}
                    </div>
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Loading />
        </div>
    }

    if (error) {
        return <div className="text-black text-center flex items-center">Error: {error.message}</div>;
    }

    return (
        <div className='w-full h-full max-w-[1300px] mx-auto px-8'>
            <h1 className='text-[25px] md:text-[46px] font-bold mb-6'>Component Overview</h1>
            <div className="flex px-4 py-3 rounded-md border-[1px] border-gray-300 overflow-hidden mx-auto">
                <input
                    type="text"
                    placeholder="Search Something..."
                    className="w-full outline-none bg-transparent text-gray-600 text-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <SearchNormal1 color="#5F5F5F" />
            </div>
            {noResults ? (
                <div className="text-center text-gray-600 mt-10">No results found</div>
            ) : (
                <>
                    {displayData?.folders.map(renderFolder)}
                    {displayData?.components.length > 0 && (
                        <div className='mt-[56px]'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-[25px] leading-[30px] font-bold'>Other</h1>
                                <span className='bg-[#FF274C] px-2.5 py-1.2 rounded-lg text-white'>
                                    {displayData?.components.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-6">
                                {displayData?.components.map(renderComponent)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Page;
