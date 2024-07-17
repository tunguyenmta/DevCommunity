/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../home/components/Header";
import Taglist from "../../home/components/Taglist";
import Editor from "./components/newEditor";
import RelatedPosts from "./components/relatedPosts";
import CoverUpload from "./components/coverUpload";
import AddingTag from "./components/addingTag";
import DatePickerPage from "./components/datePicker";
import TimePickerPage from "./components/timePicker";
import PermissionSelect from "./components/commentPermission";
import { LiaAngleUpSolid } from "react-icons/lia";
import { message, type UploadFile } from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
import Searchbar from "./components/searchBar";
import TimeLine from "./components/timeLine";
import Image from "next/image";
import createPostIcon from "../../../public/asstets/icons/Themes (13)/vuesax/linear/save-2.svg";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Save2 } from "iconsax-react";
// import {useAxiosSetup} from "@/app/utils/axiosInstance";
function getWordCount(text: string) {
    const textWithSpaces = text.replace(/<\/p><p>/g, " ");
    const plainText = textWithSpaces.replace(/<\/?[^>]+(>|$)/g, "").trim();
    if (!plainText) return 0;
    return plainText.split(/\s+/).length;
}

interface Example {
    id: number;
    title: string;
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
}

interface SearchResults {
    listExample: Example[];
}

interface TagProps {
    id: number;
    name: string;
}
interface Cover {
    file: UploadFile[];
}

interface coverPathProps {
    path: string;
    mediaType: string;
    originalName: string;
}

interface TreeNode {
    key: string;
    href: string;
    title: string;
    type: string;
    count?: number;
    children?: TreeNode[];
}

interface TimeLineProps {
    listHeading: TreeNode[];
}

interface PostCreateProps {
    title: string;
    content: string;
    cover: coverPathProps | null;
    hashTagList: string[];
    datePost: string | null;
    timePost: string | null;
    commentPermission: string;
    exampleIds: number[];
    tableContent: TimeLineProps["listHeading"];
    id?: number;
    draftId?: number;
}

function extractHeadings(htmlString: string): [TreeNode[], string] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const roots: TreeNode[] = [];
    const currentNodes: { [level: number]: TreeNode | undefined } = {};
    const headingCounter: { [key: string]: number } = {};

    const allElements = doc.body.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const tagName = element.tagName.toLowerCase();
        if (tagName.startsWith("h") && tagName.length === 2) {
            const level = parseInt(tagName[1]);
            if (level !== 1 && level !== 2) continue;
            const textContent = element.textContent?.trim();
            if (!textContent) continue;
            // Generate a base ID using the text content
            const baseId = `${tagName}-${textContent.replace(/\s+/g, "-").toLowerCase()}`;
            // Increment or initialize the counter for this base ID
            const count = (headingCounter[baseId] = (headingCounter[baseId] || 0) + 1);
            const id = `${baseId}-${count}`;
            element.id = id;
            const node: TreeNode = {
                key: id,
                count: count,
                title: element.textContent?.trim() || "",
                type: tagName,
                href: `#${id}`,
                children: [],
            };

            if (level === 1) {
                roots.push(node);
            } else {
                let parentNode = currentNodes[level - 1];
                if (parentNode) {
                    parentNode.children?.push(node);
                } else {
                    let parentLevel = level - 1;
                    while (parentLevel > 1 && !currentNodes[parentLevel]) {
                        parentLevel--;
                    }
                    parentNode = currentNodes[parentLevel];
                    if (parentNode) {
                        parentNode.children?.push(node);
                    } else {
                        roots.push(node);
                    }
                }
            }

            currentNodes[level] = node;
            for (let j = level + 1; j <= 2; j++) {
                currentNodes[j] = undefined;
            }
        }
    }

    const serializer = new XMLSerializer();
    const modifiedHtmlString = serializer.serializeToString(doc);

    return [roots, modifiedHtmlString];
}
function extractBodyText(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const body = doc.body;
    const textContent = body.innerHTML;
    return textContent;
}
const PostCreate = () => {
    // const axiosInstance = useAxiosSetup();
    const saveTimer = useRef<number | null>(null);
    const [initialContent, setInitialContent] = useState<string>("");
    const queryNotify = useSearchParams();
    const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
    const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);

    const [timeSinceLastSave, setTimeSinceLastSave] = useState<number>(0);

    useEffect(() => {
        // Set up an interval that fires every minute (60000 milliseconds)
        const interval = setInterval(() => {
            if (lastSaveTime) {
                const currentTime = Date.now();
                const timeDifference = currentTime - lastSaveTime;
                // Convert time difference from milliseconds to minutes
                const minutesSinceLastSave = Math.floor(timeDifference / 10000);
                setTimeSinceLastSave(minutesSinceLastSave);
            }
        }, 10000); // 60000 milliseconds = 1 minute

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [lastSaveTime]);

    const [post, setPost] = useState<PostCreateProps>({
        title: "",
        content: "",
        cover: null,
        hashTagList: [],
        datePost: null,
        timePost: null,
        commentPermission: "ANYONE",
        exampleIds: [],
        tableContent: [],
    });
    const { userToken, refreshToken } = useAppContext();
    const saveDraft = async (userToken: string) => {
        try {
            const draftIdValue = sessionStorage.getItem("draftId");
   

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts/draf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(draftIdValue ? { ...post, id: JSON.parse(draftIdValue).id } : post),
            });
            
            let data = await response.json();
            // let data = response.data;
            if (data) {
                sessionStorage.setItem("draftId", JSON.stringify({ id: data.id, timeSave: data.lastModifiedDate }));
                let timeData = new Date(data.lastModifiedDate).getTime();
                setLastSaveTime(timeData);
                setLastUpdateTime(Date.now());
                setTimeSinceLastSave(0);
            }
        } catch (error) {
            console.error("Error saving draft", error);
        }
    };

    useEffect(() => {
        if (extractBodyText(post.content) == "<p><br></p>" || extractBodyText(post.content) == "") {
            setIsValidContent(false);
        } else {
            setIsValidContent(true);
        }
    }, [post.content]);

    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const [wordCount, setWordCount] = useState<number>(0);
    const [tags, setTags] = useState<TagProps[]>([]);
    const [coverImage, setCoverImage] = useState<Cover>({ file: [] });
    const [showSearchDiv, setShowSearchDiv] = useState<boolean>(false);
    const [listExample, setListExample] = useState<Example[]>([] as Example[]);
    const [isCreating, setIsCreating] = useState(false);
    const [textGoal, setTextGoal] = useState<{ text: string; count: number }>({
        text: "",
        count: 0,
    });
    const [heading, setHeading] = useState<TimeLineProps["listHeading"]>([]);
    const [scheduleTime, setScheduleTime] = useState<string | null>(null);
    const [isValidContent, setIsValidContent] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastUpdateTime > 10000) {
                saveDraft(userToken);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lastUpdateTime, post, content]);

    const fetchTags = async (): Promise<TagProps[]> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
            headers: {
                "Cache-Control": "no-store",
            },
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch tags");
        }
        const data = await res.json();
        setTags(data);
        return data;
    };

    const fetchDraftData = async (id: string, userToken: string) => {
        // let res = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts/${id}`, {headers: {'Authorization': `Bearer ${userToken}`}})
        let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch draft data");
        }
        let data = await res.json();
        let tempData = {
            id: data.id,
            title: data.title,
            content: data.content,
            cover: data.cover,
            hashTagList: data.hashTagList.map((tag: { id: number; name: string }) => {
                return tag.name;
            }),
            datePost: data.scheduleDate,
            timePost: data.scheduleTime,
            commentPermission: data.commentPermission,
            exampleIds: data.examples != undefined && data.examples != null ? data.examples.map((example: Example) => example.id) : [],
            tableContent: data.tableContent,
        };

        console.log(tempData);
        setPost(tempData);
    };
    useEffect(() => {
        if (sessionStorage.getItem("draftId")) {
            const draftIdValue = sessionStorage.getItem("draftId");
            const draftID = draftIdValue ? JSON.parse(draftIdValue) : null;
            if (draftID.id) {
                // fetchDraftData(draftID.id);
                router.push(`/posts/${draftID.id}`);
            }
        }
    }, [post.draftId]);
    useEffect(() => {
        fetchTags();
        if (sessionStorage.getItem("draftId")) {
            if (sessionStorage.getItem("draftId")) {
                const draftIdValue = sessionStorage.getItem("draftId");
                const draftID = draftIdValue ? JSON.parse(draftIdValue) : null;
            }
        }
    }, []);

    const handleToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCoverChange = (cover: Cover) => {
        console.log(cover);
        handleSaveCover(cover);
        setCoverImage(cover);
        setLastUpdateTime(Date.now());
    };

    const handleTagsChange = (tags: string[]) => {
        setPost({
            ...post,
            hashTagList: tags,
        });
        setLastUpdateTime(Date.now());
    };

    const handleListRelatedExample = (listExample: Example[]) => {
        setListExample(listExample);
        setLastUpdateTime(Date.now());
    };

    const handleExampleID = (example: number[]) => {
        setPost({
            ...post,
            exampleIds: example,
        });
    };

    const handleCreatePost = async () => {
        if (coverImage.file) {
            try {
                let updatedPost;
                const draftID = sessionStorage.getItem("draftId");
                if (draftID !== null) {
                    updatedPost = {
                        ...post,
                        tableContent: heading,
                        content: extractHeadings(content)[1],
                        draftId: JSON.parse(draftID).id,
                    };
                } else {
                    updatedPost = {
                        ...post,
                        tableContent: heading,
                        content: extractHeadings(content)[1],
                        draftId: null,
                    };
                }

                setPost(updatedPost);
                // const postResponse = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {method: "POST", headers: {'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json'}, body: JSON.stringify(updatedPost)})
                const postResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify(updatedPost),
                });

                if (postResponse.ok) {
                    sessionStorage.removeItem("draftId");
                    setTimeout(() => {
                        const params = new URLSearchParams(queryNotify?.toString());
                        toast.success("Post created successfully", {
                            position: "top-center",
                            autoClose: 800,
                        });
                        params.set("notify", "created successfully");
                        router.push(`/posts?${params.toString()}`);
                    }, 0);
                } else {
                    setTimeout(() => {
                        setIsCreating(false);
                    }, 2000);
                    throw new Error("Failed to create post");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const updatedPost = {
                    ...post,
                    tableContent: heading,
                    content: extractHeadings(content)[1],
                };
                setPost(updatedPost);

                // const postResponse = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {method: "POST", headers: {'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json'}, body: JSON.stringify(updatedPost)})
                const postResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify(updatedPost),
                });

                if (postResponse.ok) {
                    setTimeout(() => {
                        router.push("/posts");
                    }, 0);
                } else {
                    throw new Error("Failed to create post");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSetDate = (date: string | null) => {
        setPost({
            ...post,
            datePost: date,
        });
        setLastUpdateTime(Date.now());
    };
    const handleSaveCover = async (cover: Cover) => {
        const formData = new FormData();
        if (cover.file.length == 0) return;
        console.log(cover.file[0]);
        if (cover.file[0] && cover.file[0].originFileObj) {
            console.log(cover.file[0].originFileObj);
            formData.append("files", cover.file[0].originFileObj);
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
        setPost({ ...post, cover: coverData[0] });
    };
    const handleSetTime = (time: string | null) => {
        setPost({
            ...post,
            timePost: time,
        });
        setLastUpdateTime(Date.now());
    };

    const handlePermission = (permission: string) => {
        setPost({
            ...post,
            commentPermission: permission,
        });
        setLastUpdateTime(Date.now());
    };

    const hanldeSetHeading = (content: string) => {
        const [headings, modifiedContent] = extractHeadings(content);
        setHeading(headings);
        setLastUpdateTime(Date.now());
    };

    const handleContent = (contentValue: string) => {
        const words = getWordCount(contentValue);
        setWordCount(words);
        setContent(contentValue);
        setPost((prevPost) => ({
            ...prevPost,
            content: contentValue,
        }));
    };

    const handleTitle = (title: string) => {
        setPost((prevPost) => ({
            ...prevPost,
            title: title,
        }));
        setLastUpdateTime(Date.now());
    };

    const handleSearchDiv = () => {
        setShowSearchDiv(!showSearchDiv);
    };

    const handleScrollToText = (text: string, count: number) => {
        setTextGoal({ text, count });
    };
    const [showDraftIdSpan, setShowDraftIdSpan] = useState(false);
    useEffect(() => {
        const draftIdValue = sessionStorage.getItem("draftId");
        if (draftIdValue) {
            setShowDraftIdSpan(true);
        }
    }, [lastSaveTime]);
    return (
        <>
            <div className="flex flex-col">
                <Header></Header>
                <Taglist tags={tags}></Taglist>
                <div className="px-[40px] pt-[52px] pb-[150px] bg-white flex gap-[24px] flex-1 min-h-screen relative">
                    {showSearchDiv && (
                        <div className="absolute p-5 rounded-[12px] min-h-screen top-[160px] left-[444px] bg-[rgba(0,0,0,.1)] z-50">
                            <Searchbar
                                listExampleID={post.exampleIds}
                                closeSearchDiv={handleSearchDiv}
                                setRelatedExample={handleExampleID}
                                setListExample={handleListRelatedExample}
                            ></Searchbar>
                        </div>
                    )}
                    <RelatedPosts listExample={listExample} showSearchDiv={handleSearchDiv}></RelatedPosts>

                    <div className="bg-white p-[24px] rounded-[12px] w-[1140px]">
                        <div id="post-content">
                            <Editor
                                initialContent={initialContent}
                                title={post.title}
                                content={post.content}
                                handleChangeContent={(value) => {
                                    handleContent(value);
                                    hanldeSetHeading(value);
                                }}
                                handleChangeTitle={handleTitle}
                                textGoal={textGoal}
                            ></Editor>
                        </div>
                        <div id="publish-settings" className="pt-[16px]">
                            <h2 className="text-[24px] font-semibold py-5">PUBLISH SETTING</h2>
                            <div>
                                <h3 className="text-[16px] font-semibold leading-[19px]">
                                    Cover image <span className="text-red1">*</span>
                                </h3>
                                <p className="pb-[16px] pt-[8px] text-[rgba(0,0,0,.45)] text-[16px]">Image upload format supports JPEG, JPG, PNG</p>
                                <CoverUpload initialCover={post.cover?.path} onCoverChange={handleCoverChange}></CoverUpload>
                            </div>
                            <div className="adding-tag pt-[16px]">
                                <h3 className="text-[16px] font-semibold leading-[19px]">
                                    Tags <span className="text-red1">*</span>
                                </h3>
                                <p className="pb-[16px] pt-[8px] text-[rgba(0,0,0,.45)] text-[16px]">Help readers find your posts more easily</p>
                                <AddingTag listTags={post.hashTagList} onTagsChange={handleTagsChange}></AddingTag>
                            </div>
                            <div className="schedule-post pt-[16px]">
                                <h3 className="text-[16px] font-semibold leading-[19px]">Schedule posting</h3>
                                <p className="pb-[16px] pt-[8px] text-[rgba(0,0,0,.45)] text-[16px]">
                                    Schedule your articles for when your audience is most active or for future posting times
                                </p>
                                <div className="scheduletime-pick flex items-center gap-[30px]">
                                    <DatePickerPage scheduleDate={post.datePost} getDate={handleSetDate}></DatePickerPage>
                                    <TimePickerPage scheduleTime={scheduleTime} getTime={handleSetTime} day={post.datePost}></TimePickerPage>
                                </div>
                            </div>
                            <div className="adding-tag pt-[16px]">
                                <h3 className="text-[16px] font-semibold leading-[19px]">Comment permissions</h3>
                                <p className="pb-[16px] pt-[8px] text-[rgba(0,0,0,.45)] text-[16px]">
                                    Help you manage comment content below your post{" "}
                                </p>
                                <PermissionSelect permissionValue={post.commentPermission} getPermission={handlePermission}></PermissionSelect>
                            </div>
                        </div>
                    </div>
                    {heading.length > 0 && (
                        <div id="timeline-tree" className="fixed overflow-y-scroll max-h-[600px] top-[180px] right-[50px] w-[220px]">
                            <TimeLine scrollToText={handleScrollToText} listHeading={heading}></TimeLine>
                        </div>
                    )}
                </div>
                <div className="border-[1px] px-[40px] w-full  flex fixed bottom-0 ">
                    <div className=" w-full bg-white ml-[440px]">
                        <div className="p-[24px] flex justify-between items-center">
                            <div className="flex items-center gap-[24px]">
                                <button
                                    onClick={handleToTop}
                                    className="flex items-center gap-12px p-[16px] rounded-[8px] hover:bg-blue2 hover:text-blue3 transition duration-500 "
                                >
                                    <span className="text-[16px] font-normal">Back to top</span>
                                    <LiaAngleUpSolid className="w-[24px] h-[24px]" />
                                </button>
                                <h4>Word count: {wordCount}</h4>
                            </div>
                            <div className="flex items-center gap-[24px]">
                                {showDraftIdSpan && (
                                    <span>
                                        {timeSinceLastSave == 0 && "Draft saved just now."}
                                        {timeSinceLastSave > 0 && timeSinceLastSave < 1 && "Draft saved just now."}
                                        {timeSinceLastSave >= 1 && timeSinceLastSave < 60 && `${timeSinceLastSave} minute(s) ago.`}
                                        {timeSinceLastSave >= 60 &&
                                            timeSinceLastSave < 24 * 60 &&
                                            `${Math.floor(timeSinceLastSave / 60)} hour(s) ago.`}
                                        {timeSinceLastSave >= 24 * 60 && `${Math.floor(timeSinceLastSave / (60 * 24))} day(s) ago.`}
                                    </span>
                                )}
                                <button
                                    className="px-[16px] py-[12px] text-[18px] font-semibold rounded-[8px] border-[2px] hover:border-blue3 bg-[#F4F4F4] hover:bg-white hover:text-blue3 transition duration-500 ease-in-out"
                                    onClick={() => {
                                        sessionStorage.clear();
                                        sessionStorage.removeItem("draftID");
                                        router.push("/posts");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={
                                        post.title === "" ||
                                        isValidContent === false ||
                                        post.hashTagList.length === 0 ||
                                        coverImage.file.length == 0 ||
                                        isCreating
                                    }
                                    onClick={() => {
                                        setIsCreating(true);
                                        handleCreatePost();
                                    }}
                                    className={`group px-[16px] py-[12px] text-[18px] font-semibold text-white flex gap-[12px] items-center rounded-[8px] transition duration-500 ease-in-out ${
                                        post.title === "" ||
                                        isValidContent === false ||
                                        post.hashTagList.length === 0 ||
                                        coverImage.file.length == 0 ||
                                        isCreating
                                            ? "bg-gray-400"
                                            : "bg-[#3C7FF5] hover:bg-blue2 hover:text-blue3"
                                    }`}
                                >
                                    <Save2
                                        size="28"
                                        className={`text-white 
                                         ${
                                             post.title === "" ||
                                             isValidContent === false ||
                                             post.hashTagList.length === 0 ||
                                             coverImage.file.length == 0 ||
                                             isCreating
                                                 ? ""
                                                 : "group-hover:text-blue3 transition-colors duration-500"
                                         }
                                        `}
                                    />
                                    <span>Save article</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCreate;
