import React, { useState, useEffect, memo } from 'react';
import { Editor } from "@monaco-editor/react";
import Output from './Output';

import { SlArrowUp } from "react-icons/sl";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Modal from 'react-modal';

import HTML from '../../../public/asstets/icons/html.svg';
import CSS from '../../../public/asstets/icons/css.svg';
import Javascripts from '../../../public/asstets/icons/javascript.svg';
import TypeScripts from '../../../public/asstets/icons/typescript.svg';
import Java from '../../../public/asstets/icons/java.svg';
import Database from '../../../public/asstets/icons/database.svg';
import Edit from '../../../public/asstets/icons/edit.svg';
import Copy from '../../../public/asstets/icons/Copy.svg';
import Download from '../../../public/asstets/icons/download.svg';
import TickCircle from '../../../public/asstets/icons/tick-circle.svg';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import debounce from 'lodash.debounce';
import { DocumentDownload, VideoPlay } from 'iconsax-react';



const TabData = [
    { label: 'HTML', icon: <Image width={20} src={HTML} alt='HTML' /> },
    { label: 'CSS', icon: <Image width={20} src={CSS} alt='CSS' /> },
    { label: 'JavaScript', icon: <Image width={20} src={Javascripts} alt='Javascripts' /> },
    { label: 'TypeScripts', icon: <Image width={20} src={TypeScripts} alt='Javascripts' /> },
    { label: 'Java', icon: <Image width={20} src={Java} alt='Java' /> },
    { label: 'Database', icon: <Image width={20} src={Database} alt='Database' /> },
];

const Tab = memo(({ label, icon, activeTab, onClick }: { label: TabLabel, icon: React.ReactNode, activeTab: TabLabel, onClick: (label: TabLabel) => void }) => (
    <li
        key={label}
        onClick={() => onClick(label)}
        className={`text-sm py-1 md:py-3 px-2 cursor-pointer list-none ${activeTab === label ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
    >
        <div className='flex justify-center items-center gap-1'>
            {icon}
            <span className='text-[16px] font-semibold'>{label}</span>
        </div>
    </li>
));

Tab.displayName = 'Tab';


const CodeEditor = () => {
    const [data, setData] = useState<ShowComponentDetail | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabLabel>('HTML');
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showCode, setShowCode] = useState<{ [key: number]: boolean }>({});
    const [code, setCode] = useState<{ [key: number]: CodeSnippets }>({});
    const [userId, setUserId] = useState<string | "">("");

    const params = useParams();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/components/${params?.id}`,
                    {
                        headers: {
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                            Expires: "0",
                            ipClient: userId,

                        },
                        cache: "no-store",
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const results = await response.json();
                setData(results);
                const initialCode: { [key: number]: CodeSnippets } = {};
                results.examples.forEach((example: any) => {
                    initialCode[example.id] = example.resource;
                });
                setCode(initialCode);
                const getUserId = async () => {
                    const fp = await FingerprintJS.load();
                    const result = await fp.get();
                    setUserId(result.visitorId);
                };

                if (!userId) {
                    getUserId();
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    if (loading) return <div className="text-black">Loading...</div>;
    if (error) return <div className="text-black">Error: {error}</div>;

    const handleTabClick = (label: TabLabel) => {
        setActiveTab(label);
    };

    const handleViewCodeClick = (exampleId: number) => {
        setShowCode((prevShowCode) => ({
            ...prevShowCode,
            [exampleId]: !prevShowCode[exampleId],
        }));
    };


    // Debounced onChange handler
    const handleCodeChange = debounce((value, exampleId, tab) => {
        setCode((prev) => ({
            ...prev,
            [exampleId]: {
                ...prev[exampleId],
                [tab.toLowerCase()]: value || ""
            }
        }));
    }, 1000);


    const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const CopyButton = memo(({ exampleId }: { exampleId: number }) => (
        <CopyToClipboard text={code[exampleId][activeTab.toLowerCase() as keyof CodeSnippets]} onCopy={handleCopy}>
            <span className='cursor-pointer'>
                {isCopied ? <Image src={TickCircle} alt='TickCircle' className='w-5 md:w-[24px]' /> : <Image src={Copy} alt='Copy' className='w-5 md:w-[24px]' />}
            </span>
        </CopyToClipboard>
    ));
    CopyButton.displayName = 'CopyButton';
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getEmbedUrl = (url: string) => {
        if (!isValidUrl(url)) return "";
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    };

    return (
        <div>
            {data?.examples.map((example) => (
                <div id={`example-${example.id}`} key={example.id} className='border-[2px] border-gray-200 my-5 rounded-lg'>
                    <div className=" rounded-md px-3 md:px-10 my-8">
                        <div className="my-10 flex justify-between items-center">
                            <div>
                                <h1 className="text-[25px] font-bold">{example.title}</h1>
                                <p
                                    dangerouslySetInnerHTML={{ __html: example?.description || "" }}
                                ></p>
                            </div>
                            <div>
                                {example.video && (<span onClick={openModal} className='cursor-pointer'><VideoPlay color='#292D32' /> </span>)}
                            </div>
                        </div>
                        <Output code={code[example.id]} activeTab={'HTML'} />
                        <div className='flex justify-between items-center my-4'>
                            <button className='text-blue3 border-b-2 border-blue3 my-3' onClick={() => handleViewCodeClick(example.id)}>
                                View code
                            </button>
                            <div>
                                {
                                    example.sourceCode.path && (
                                        <a href={process.env.NEXT_PUBLIC_BASE_IMG_URL + example.sourceCode.path} download={process.env.NEXT_PUBLIC_BASE_IMG_URL + example.sourceCode.originalName}>
                                            {/* <Image src={Download} width={35} height={35} alt='Logo share' className='rounded p-1.5 cursor-pointer' /> */}
                                            <DocumentDownload color='#292D32' />
                                        </a>

                                    )
                                }

                            </div>
                        </div>
                    </div>
                    {showCode[example.id] && (
                        <div>
                            <div className='border-[1px] my-3 mx-10'></div>
                            <div className="bg-white">
                                <ul className="flex-wrap flex justify-center gap-8 max-w-full mx-auto py-4">
                                    {TabData.map((tab) => (
                                        <Tab key={tab.label} label={tab.label as TabLabel} icon={tab.icon} activeTab={activeTab} onClick={handleTabClick} />
                                    ))}
                                </ul>
                                <div className="w-full relative ">

                                    <div className='flex items-center gap-2 md:gap-5 absolute z-10 top-0 md:top-2 right-4 md:right-10 text-gray-500'>
                                        <Image src={Edit} alt='Edit' className='cursor-pointer w-5 md:w-[24px]' />

                                        <CopyButton exampleId={example.id} />
                                    </div>
                                    <Editor
                                        className='min-h-[50vh]'
                                        options={{
                                            minimap: { enabled: false },
                                            lineHeight: 28,
                                            renderWhitespace: 'none',
                                            overviewRulerBorder: false,
                                            cursorStyle: 'line',
                                            selectionHighlight: false,
                                            renderLineHighlight: 'none',
                                            lineNumbers: 'off',
                                            tabSize: 8,
                                            // renderIndentGuides: false
                                        }}
                                        language={activeTab.toLowerCase()}
                                        value={code[example.id][activeTab.toLowerCase() as keyof CodeSnippets]}
                                        onChange={(value) => handleCodeChange(value, example.id, activeTab)}
                                    />

                                </div>
                                <div className='flex items-center justify-center gap-2 text-center cursor-pointer my-8' onClick={() => handleViewCodeClick(example.id)}>
                                    <span className='text-gray-500 font-medium'><SlArrowUp /></span>
                                    <p className='text-gray-500 font-semibold'>Hide</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="YouTube Video"
                        className="modal"
                        overlayClassName="modal-overlay"
                        shouldCloseOnOverlayClick={true}
                        ariaHideApp={false}
                    >
                        <div className="flex justify-center items-center w-full h-full">
                            <iframe
                                width="1000"
                                height="615"
                                src={example.video ? getEmbedUrl(example.video) : ""}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Modal>
                </div>
            ))}

        </div>
    );
};
export default CodeEditor;
