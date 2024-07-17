import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import TitleInput from "./titleInputExample";
import VideoInput from "./videoInput";
import Editor from "../(pageComponents)/descriptionEditor";
import CodeEditor from "@/app/(createcmp)/components/CodeEditor";
import CoverUpload from "../(pageComponents)/coverUpload";
import FileUpload from "./sourceUpload";
import Image from "next/image";
import type { UploadFile } from "antd";
import createPostIcon from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/save-2.svg";
import { LiaAngleUpSolid } from "react-icons/lia";

interface Cover {
    file: UploadFile[];
}

interface ExampleProps {
    id?: number;
    title: string;
    description: string;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    resource: {
        html: string;
        css: string;
        javascript: string;
        typescript: string;
        java: string;
        database: string;
    };
    sourceCode: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    video: string;
    tempId?: number;
    commit?: string;
}

interface ExampleCreatorProps {
    listCurrentTitle: string[];
    example: ExampleProps;
    handleAddExample: (example: ExampleProps) => void;
    hanldeOpen: (open: boolean) => void;
    open: boolean;
}

const ExampleCreator: React.FC<ExampleCreatorProps> = ({ example: initialExample, handleAddExample, hanldeOpen, open, listCurrentTitle }) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const [commitFocus, setCommitFocus] = useState<boolean>(false);
    const [example, setExample] = useState<ExampleProps>(initialExample);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [coverImage, setCoverImage] = useState<Cover>({ file: [] });
    const [initialCover, setInitialCover] = useState<string>("");
    const [initialContent, setInitialContent] = useState<string>("");
    const [isValidTitle, setIsValidTitle] = useState<boolean>(initialExample.title === "" ? false : true);
    const [initialResource, setInitialResource] = useState<{
        html: string;
        css: string;
        javascript: string;
        typescript: string;
        java: string;
        database: string;
    }>({} as { html: string; css: string; javascript: string; typescript: string; java: string; database: string });
    useEffect(() => {
        setExample(initialExample);
        if (initialExample.cover) {
            setInitialCover(initialExample.cover.path);
        }
        if (initialExample.resource) {
            setInitialResource(initialExample.resource);
        }
        setInitialContent(example.description); // This synchronizes the local state with the props whenever the initialExample changes.
    }, [initialExample]);

    const handleSetIsValidTitle = (value: boolean) => {
        setIsValidTitle(value);
    };
    const handleToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSetTitle = (title: string) => {
        setExample((prev) => ({ ...prev, title }));
    };

    const handleChangeDescription = (description: string) => {
        setExample((prev) => ({ ...prev, description }));
    };

    const handleChangeCommit = (commit: string) => {
        setExample((prev) => ({ ...prev, commit }));
    };

    const handleChangeResource = (html: string, css: string, javascript: string, typescript: string, java: string, database: string) => {
        setExample((prev) => ({
            ...prev,
            resource: { html, css, javascript, typescript, java, database },
        }));
    };

    const handleCoverChange = (cover: Cover) => {
        handleSaveCover(cover);
        setCoverImage(cover);
    };

    const handleSaveCover = async (cover: Cover) => {
        const formData = new FormData();
        if (cover.file.length == 0) {
            setExample({ ...example, cover: { path: initialCover, mediaType: "image", originalName: "" } });
            return;
        }
        if (cover.file[0] && cover.file[0].originFileObj) {
            formData.append("files", cover.file[0].originFileObj as Blob);
        } else {
            return;
        }

        const coverResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
            method: "POST",
            body: formData,
        });

        if (!coverResponse.ok) {
            throw new Error("Failed to upload cover image");
        }

        const coverData = await coverResponse.json();
        if (coverData == undefined || coverData == "") {
            throw new Error("Invalid cover data");
        }
        setExample({ ...example, cover: coverData[0] });
    };
    const handleFileChange = async (cover: Cover) => {
        const coverData = await handleSaveSource(cover);
        if (coverData) {
            setExample((prev) => ({ ...prev, sourceCode: coverData }));
        }
    };

    const handleSaveSource = async (cover: Cover) => {
        const formData = new FormData();
        if (cover.file.length == 0) return;
        if (cover.file[0] && cover.file[0].originFileObj) {
            formData.append("files", cover.file[0].originFileObj as Blob);
        } else {
            return;
        }

        const coverResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
            method: "POST",
            body: formData,
        });

        if (!coverResponse.ok) {
            throw new Error("Failed to upload cover image");
        }

        const coverData = await coverResponse.json();
        if (coverData == undefined || coverData == "") {
            throw new Error("Invalid cover data");
        }
        // setCoverImage(coverData[0]);
        return coverData[0];
    };
    const handleSaveExample = () => {
        // if(example.cover.path ==""){
        //   setIsClicked(true)
        // } else{
        handleAddExample(example);
        // setIsCreating(false);
        hanldeOpen(false);
        // }
    };

    useEffect(() => {}, [isClicked]);
    const handleScreenShot = async (url: string) => {
        const [contentType, base64Data] = url.split(";base64,");
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blobData = new Blob([byteArray], { type: contentType });

        // Convert Blob to File
        const fileName = "screenshot.png"; // Example file name, change as needed
        const fileData = new File([blobData], fileName, { type: contentType });

        const formData = new FormData();
        formData.append("files", fileData); // Append the File instead of the Blob

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setExample((prev) => ({ ...prev, cover: data[0] }));
            if (data) {
                handleAddExample({ ...example, cover: data[0] });
                setIsCreating(false);
                setIsClicked(false);
                // handleOpen(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Modal
        title={<span className="font-bold text-2xl leading-[30px] text-black1">Example Guidelines</span>}
            centered
            open={open}
            onOk={handleSaveExample}
            onCancel={() => hanldeOpen(false)}
            width={1500}
            style={{ marginBottom: "200px", marginTop: "100px" }}
            footer={null}
        >
            <CodeEditor
                isClicked={isClicked}
                handleScreenShot={handleScreenShot}
                initialCode={initialResource}
                html={example.resource.html}
                css={example.resource.css}
                javascript={example.resource.javascript}
                typescript={example.resource.typescript}
                java={example.resource.java}
                database={example.resource.database}
                handleChange={handleChangeResource}
            />
            <div className="flex gap-20">
                <div className="w-[65%]">
                    <TitleInput
                        handleSetIsValidTitle={handleSetIsValidTitle}
                        listCurrentTitle={listCurrentTitle}
                        title={example.title}
                        setTitle={handleSetTitle}
                    />
                    <VideoInput url={example.video} setUrl={(url) => setExample((prev) => ({ ...prev, video: url }))} />
                    <Editor initialContent={initialContent} content={example.description} handleChangeContent={handleChangeDescription} />
                </div>
                <div className="w-[35%]">
                    <CoverUpload initialCover={initialCover} onCoverChange={handleCoverChange} />
                    <FileUpload initialCover={example.sourceCode} onCoverChange={handleFileChange} />
                </div>
            </div>
            <div className="py-3" onFocus={() => setCommitFocus(true)}>
                <h2 className="font-semibold pb-3">
                    Commit messages <span className="text-red1">*</span>
                </h2>
                <p className="pb-3">
                    To ensure efficient and transparent tracking and management of changes in our project, we request that you write detailed commit
                    messages for every new component creation.
                </p>
                <input
                    placeholder="Briefly describe the change of new feature..."
                    className="w-full px-4 py-2 rounded-[6px] border border-gray-300"
                    type="text"
                    value={example.commit}
                    onChange={(e) => handleChangeCommit(e.target.value)}
                    onFocus={() => setCommitFocus(true)}
                />
                {commitFocus && (example.commit === "" || example.commit == undefined) && (
                    <span className="text-yellow-500">This field is required</span>
                )}
            </div>
            <div className="border-[1px] w-full flex fixed left-0 bottom-0 z-50">
                <div className="w-full bg-white px-[40px]">
                    <div className="p-[24px] flex justify-between items-center">
                        <button
                            onClick={handleToTop}
                            className="flex items-center gap-12px p-[16px] rounded-[8px] hover:bg-blue2 hover:text-blue3 transition duration-500"
                        >
                            <LiaAngleUpSolid className="w-[24px] h-[24px]" />
                            <span className="text-[16px] font-normal">Back to top</span>
                        </button>
                        <div className="flex gap-5">
                            <button
                                onClick={() => hanldeOpen(false)}
                                className="font-semibold text-[18px] px-4 py-2 border-[1px] border-[#DCDCDC] rounded-[8px] bg-[#F4F4F4]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveExample}
                                disabled={isCreating || example.title === "" || example.commit === "" || example.commit == undefined}
                                className={`px-[16px] py-[12px] text-[18px] font-semibold text-white flex gap-[12px] items-center rounded-[8px] transition duration-500 ease-in-out ${
                                    isCreating || example.title === "" || example.commit === "" || example.commit == undefined
                                        ? "bg-gray-400"
                                        : "bg-[#3C7FF5] hover:bg-blue2 hover:text-blue3"
                                }`}
                            >
                                <Image src={createPostIcon} alt="Save example" width="24" height="24" />
                                <span>Save example</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ExampleCreator;
