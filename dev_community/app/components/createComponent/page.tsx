"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/home/components/Header";
import Taglist from "@/app/home/components/Taglist";
import CategorySelect from "./(pageComponents)/selectedCategory";
import TitleInput from "./(pageComponents)/titleInput";
import Editor from "./(pageComponents)/descriptionEditor";
import WhenToUseEditor from "./(pageComponents)/whenToUseEditor";
import CoverUpload from "./(pageComponents)/coverUpload";
import type { UploadFile } from "antd";
import AddingTag from "./(pageComponents)/addTag";
import { useRouter } from "next/navigation";
import Image from "next/image";
import createPostIcon from "../../../public/asstets/icons/Themes (13)/vuesax/linear/save-2.svg";
import { BsFillSaveFill } from "react-icons/bs";
import { LiaAngleUpSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import ListExample from "./(exampleCreatePage)/listExample";
import { useAppContext } from "@/app/utils/contextProvider";
import Save from "../../../public/asstets/icons/save-2.svg";
import { Save2 } from 'iconsax-react';

interface Cover {
    file: UploadFile[];
}
function extractBodyText(htmlString: string) {
    // Step 1: Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Step 2: Access the <body> element
    const body = doc.body;

    // Step 3: Extract text content
    const textContent = body.textContent;

    return textContent;
}
interface ExampleProps {
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
}
interface ComponentProps {
    title: string;
    categoryId: number;
    description: string;
    whenToUse: string;
    hashTagList: string[];
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    } | null;
    examples: ExampleProps[];
}

interface TagProp {
    tags: { name: string; id: number }[];
}

const ComponentCreate = () => {
    const { userToken } = useAppContext();
    const [isCreating, setIsCreating] = useState(false);
    const [isValidateTitle, setIsValidateTitle] = useState<boolean>(false);
    const router = useRouter();
    const [coverImage, setCoverImage] = useState<Cover>({ file: [] });
    const [component, setComponent] = useState<ComponentProps>({
        title: "",
        categoryId: -1,
        description: "",
        whenToUse: "",
        hashTagList: [],
        cover: {
            path: "",
            mediaType: "",
            originalName: "",
        },
        examples: [] as ComponentProps["examples"],
    });
    const [tags, setTags] = useState<TagProp["tags"]>([] as { name: string; id: number }[]);
    const handleCoverChange = (cover: Cover) => {
        handleSaveCover(cover);
        setCoverImage(cover);
    };
    const handleSaveCover = async (cover: Cover) => {
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
        setComponent({ ...component, cover: coverData[0] });
    };
    const handleSetTitle = (title: string) => {
        setComponent({
            ...component,
            title: title,
        });
    };
    const handleTagsChange = (tags: string[]) => {
        setComponent({
            ...component,
            hashTagList: tags,
        });
    };
    const handleChangeDescription = (description: string) => {
        setComponent({ ...component, description: description });
    };
    const handleChangeWhenToUse = (whenToUse: string) => {
        setComponent({ ...component, whenToUse: whenToUse });
    };
    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
                headers: {
                    "Cache-Control": "no-store",
                },
                cache: "no-store",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }
            const data = await response.json();
            setTags(data);
            return data;
        };
        fetchTags();
    }, []);
    const handleToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCreateComponent = async () => {
        let updateComponent;
        if (component.categoryId == -1) {
            updateComponent = {
                ...component,
                categoryId: null,
            };
        } else {
            updateComponent = { ...component };
        }
        if (updateComponent.cover?.path == "") {
            updateComponent.cover = null;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/components`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userToken,
            },
            method: "POST",
            body: JSON.stringify(updateComponent),
        });
        if (!res.ok) {
            toast.error("Failed to create component");
            throw new Error("Failed to create component");
        }
        toast.success("Component created successfully");
        router.push("/components");
    };

    const handleAddExample = (example: ExampleProps[]) => {
        setComponent(() => ({
            ...component,
            examples: [...example],
        }));
    };

    const handleChangeCategory = (category: number) => {
        setComponent({
            ...component,
            categoryId: category,
        });
    };
    return (
        <>
            <Header></Header>
            <Taglist tags={tags} />
            <>
                <div className="relative"></div>
                <div className="bg-[#F4F4F4] min-h-screen px-[195px] pb-[50px]">
                    <h1 className="p-[24px] font-bold text-[25px] leading-[30px] text-[#292929]">Components Guideline</h1>
                    <div className="p-[24px] bg-white min-h-screen rounded-[12px] flex gap-5">
                        <div className="w-[70%]">
                            <CategorySelect category={component.categoryId} handleChangeCategory={handleChangeCategory}></CategorySelect>
                            <TitleInput
                                handleIsValidateTitle={(state: boolean) => setIsValidateTitle(state)}
                                title={component.title}
                                setTitle={handleSetTitle}
                            ></TitleInput>
                            <div className="max-w-[1000px]">
                                <Editor content={component.description} handleChangeContent={handleChangeDescription}></Editor>
                                <WhenToUseEditor content={component.whenToUse} handleChangeContent={handleChangeWhenToUse}></WhenToUseEditor>
                            </div>
                        </div>
                        <div className="w-[30%]">
                            <CoverUpload onCoverChange={handleCoverChange}></CoverUpload>
                            <AddingTag listTags={component.hashTagList} onTagsChange={handleTagsChange}></AddingTag>
                        </div>
                    </div>
                </div>

                <div className="border-[1px] w-full bg-white  flex fixed bottom-0 z-50 ">
                    <div className="max-w-[1650px] w-full px-[40px] mx-auto">
                        <div className="p-[24px] flex justify-between items-center">
                            <div className="flex items-center gap-[24px]">
                                <button
                                    onClick={handleToTop}
                                    className="flex items-center gap-12px p-[16px] rounded-[8px] hover:bg-blue2 hover:text-blue3 transition duration-500 "
                                >
                                    <span className="text-[16px] font-normal">Back to top</span>
                                    <LiaAngleUpSolid className="w-[24px] h-[24px]" />
                                </button>
                                <h4>Example count: {component.examples.length}</h4>
                            </div>
                            <div className="flex items-center gap-[24px]">
                                <button
                                    className="px-[16px] py-[12px] text-[18px] font-semibold rounded-[8px] border hover:border-blue3 border-[#DCDCDC] bg-[#F4F4F4] hover:bg-white hover:text-blue3 transition duration-500 ease-in-out"
                                    onClick={() => {
                                        router.push("/components");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={
                                        component.title === "" ||
                                        isValidateTitle === false ||
                                        extractBodyText(component.whenToUse) === "" ||
                                        component.hashTagList.length === 0 ||
                                        component.examples.length == 0 ||
                                        isCreating
                                    }
                                    onClick={() => {
                                        handleCreateComponent();
                                        setIsCreating(true);
                                    }}
                                    className={`px-[16px] py-[12px] text-[18px] font-semibold text-white flex gap-[12px] items-center rounded-[8px] transition duration-500 ease-in-out ${component.title === "" ||
                                        isValidateTitle === false ||
                                        extractBodyText(component.whenToUse) === "" ||
                                        component.hashTagList.length === 0 ||
                                        component.examples.length == 0 ||
                                        isCreating
                                        ? "bg-gray-400"
                                        : "bg-[#3C7FF5] border hover:border-blue-500 hover:bg-white hover:text-blue3"
                                        }`}
                                >
                                    <Save2 />
                                    <span >Save component</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <>
                <div className="px-[195px] bg-[#F4F4F4] overflow-hidden">
                    {/* <ExampleCreate></ExampleCreate> */}
                    <ListExample list={component.examples} handleAddExample={handleAddExample}></ListExample>
                </div>
            </>
        </>
    );
};

export default ComponentCreate;
