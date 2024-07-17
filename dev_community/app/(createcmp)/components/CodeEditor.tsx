'use client'
import React, { useEffect, useState } from 'react';
import { Editor } from "@monaco-editor/react";
import Output from './Output';
import HTML from '../../../public/asstets/icons/html.svg';
import CSS from '../../../public/asstets/icons/css.svg';
import Javascripts from '../../../public/asstets/icons/javascript.svg';
import TypeScripts from "../../../public/asstets/icons/typescript.svg";
import Java from '../../../public/asstets/icons/java.svg';
import Database from '../../../public/asstets/icons/database.svg';
import Image from 'next/image';

interface CodeProps {
    initialCode?: {
        html: string;
        css: string;
        javascript: string;
        typescript: string;
        java: string;
        database: string;
    };
    html: string;
    css: string;
    javascript: string;
    typescript: string;
    java: string;
    database: string;
    handleChange: (html: string, css: string, javascript: string, typescript: string, java: string, database: string) => void;
    isClicked: boolean;
    handleScreenShot: (url: string) => void;
}

const TabData = [
    { label: 'HTML', icon: <Image width={40} src={HTML} alt='HTML' /> },
    { label: 'CSS', icon: <Image width={40} src={CSS} alt='CSS' /> },
    { label: 'JavaScript', icon: <Image width={40} src={Javascripts} alt='JavaScript' /> },
    { label: 'TypeScript', icon: <Image width={40} height={40} src={TypeScripts} alt='TypeScript' /> },
    { label: 'Java', icon: <Image width={40} src={Java} alt='Java' /> },
    { label: 'Database', icon: <Image width={40} src={Database} alt='Database' /> },
];

type TabLabel = 'HTML' | 'CSS' | 'JavaScript' | 'TypeScript' | 'Java' | 'Database';

const CodeEditor: React.FC<CodeProps> = ({ initialCode, html, css, javascript, typescript, java, database, handleChange, handleScreenShot, isClicked }) => {
    const [activeTab, setActiveTab] = useState<TabLabel>('HTML');

    useEffect(() => {
        if (initialCode) {
            handleChange(initialCode.html, initialCode.css, initialCode.javascript, initialCode.typescript, initialCode.java, initialCode.database);
        }
    }, [initialCode]);

    const handleTabClick = (label: TabLabel) => {
        setActiveTab(label);
    };

    const handleEditorChange = (value: string | undefined) => {
        const updatedCode = {
            html: activeTab === 'HTML' ? value || "" : html,
            css: activeTab === 'CSS' ? value || "" : css,
            javascript: activeTab === 'JavaScript' ? value || "" : javascript,
            typescript: activeTab === 'TypeScript' ? value || "" : typescript,
            java: activeTab === 'Java' ? value || "" : java,
            database: activeTab === 'Database' ? value || "" : database,
        };
        handleChange(updatedCode.html, updatedCode.css, updatedCode.javascript, updatedCode.typescript, updatedCode.java, updatedCode.database);
    };

    const getCurrentCode = () => {
        switch (activeTab) {
            case 'HTML': return html;
            case 'CSS': return css;
            case 'JavaScript': return javascript;
            case 'TypeScript': return typescript;
            case 'Java': return java;
            case 'Database': return database;
            default: return '';
        }
    };

    return (
        <div className='flex gap-2 w-full h-[60vh]'>
            <Output code={{ html, css, javascript, typescript, java, database }} activeTab={activeTab} isClicked={isClicked} handleScreenShot={handleScreenShot} />
            <div className="bg-white w-full max-w-5xl mx-auto">
                <ul className="flex">
                    {TabData.map((tab) => (
                        <li
                            key={tab.label}
                            onClick={() => handleTabClick(tab.label as TabLabel)}
                            className={`flex flex-col items-center justify-center w-full text-sm py-3 px-6 cursor-pointer list-none ${activeTab === tab.label ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        >
                            <div className='flex items-center gap-1'>
                                {tab.icon}
                                <span className={`font-semibold text-lg leading-6 text-black ${activeTab === tab.label ? 'text-blue-500' : ""}`}>{tab.label}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="px-6 py-5 h-full">
                    <Editor
                        key={activeTab}
                        options={{ minimap: { enabled: false } }}
                        height="52vh"
                        language={activeTab.toLowerCase()}
                        value={getCurrentCode()}
                        onChange={(value) => handleEditorChange(value || "")}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
