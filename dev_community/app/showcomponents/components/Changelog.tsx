import Image from 'next/image'
import CloseChangelog from '../../../public/asstets/icons/cancel-close.svg'
import LogoVector from '../../../public/asstets/icons/Vector.svg'
import { useEffect, useState } from 'react';

const Changelog = ({ show, handle, paramsId }: any) => {
    const [sections, setSections] = useState<DataObject[]>([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/changelogs?componentId=${paramsId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSections(data);

            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     if (show) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto';
    //     }

    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, [show]);



    return (
        <div onClick={handle} className={show ? "modal-overlay" : ""}>
            <div onClick={(e) => e.stopPropagation()}
                className={show ? "bg-white h-full w-full md:w-[50%] fixed top-0 right-0 ease-in duration-700 z-[100]" : "bg-white h-full w-[50%] fixed top-0 right-[-100%] ease-in duration-500 z-[100]"}>
                <div className="max-w-[1112px] h-full mx-auto px-4 mt-3">
                    <div className="flex items-center gap-2">
                        <span className="hover:bg-blue-50 rounded p-1.5 cursor-pointer" onClick={handle}>
                            <Image src={CloseChangelog} alt="Close Changelog" />
                        </span>
                        <h1 className="text-[18px] leading-[21px] font-semibold">Changelog</h1>
                    </div>
                    <div className="w-full h-[1px] bg-gray-300 my-6"></div>
                    <div className="overflow-y-auto h-[calc(100vh-100px)] pb-5 custom-scrollbar">
                        {sections.map((entry, index) => (
                            <div key={index} className="mb-4 dot-header-container">
                                {entry.examples.length > 0 && (
                                    <div className="flex items-center gap-2 my-2">
                                        <span className="dot bg-white"></span>
                                        <h1 className="text-[px] leading-[21px] font-semibold">{entry?.code}</h1>
                                        <span className='mb-[0.5px]'><Image src={LogoVector} alt='LogoVector' /></span>
                                    </div>
                                )}
                                {index < sections.length - 1 && (
                                    <div className="line-changelog"></div>
                                )}
                                {entry.examples.length > 0 && (
                                    <ul className="ml-8">
                                        {entry.examples.map((item, itemIndex) => (
                                            <li key={itemIndex} className='list-none'>
                                                <div className="my-4 flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full border-[1px] border-gray-500"></span>
                                                    <p className="hover:text-blue-600 block transition-all cursor-pointer max-w-[700px]">{item.commit}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Changelog;