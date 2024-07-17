"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../home/components/Header";
import Taglist from "../../home/components/Taglist";
import Editor from "../createPost/components/newEditor";
import RelatedPosts from "../createPost/components/relatedPosts";
import CoverUpload from "../createPost/components/coverUpload";
import AddingTag from "../createPost/components/addingTag";
import DatePickerPage from "../createPost/components/datePicker";
import TimePickerPage from "../createPost/components/timePicker";
import PermissionSelect from "../createPost/components/commentPermission";
import { LiaAngleUpSolid } from "react-icons/lia";
import { IoRocketOutline } from "react-icons/io5";
import { type UploadFile } from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
import Searchbar from "../createPost/components/searchBar";
import TimeLine from "../createPost/components/timeLine";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

    cover: coverPathProps;
    hashTagList: string[];

    datePost: string | null;

    timePost: string | null;

    commentPermission: string;
    exampleIds: number[];
    tableContent: TimeLineProps["listHeading"];
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
    // Step 1: Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Step 2: Access the <body> element
    const body = doc.body;

    // Step 3: Extract text content
    const textContent = body.innerHTML;

    return textContent;
}
const fetchPostDetail = async (id: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts/${id}`, {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch content");
    }
    let data = await res.json();
    return data;
};

const PostEdit = ({ params }: { params: { postID: string } }) => {
    const { userToken } = useAppContext();
    const queryNotify = useSearchParams();
    const [initializeContent, setInitializeContent] = useState<string>("");
    const [post, setPost] = useState<PostCreateProps>({
        title: "",
        content: "",
        cover: { path: "", mediaType: "", originalName: "" },
        hashTagList: [],
        datePost: null,
        timePost: null,
        commentPermission: "ANYONE",
        exampleIds: [],
        tableContent: [] as TimeLineProps["listHeading"],
    });

    useEffect(() => {
        const loadData = async () => {
            const postContent = await fetchPostDetail(params.postID, userToken);
            let tempData = {
                id: postContent.id,
                title: postContent.title,
                content: postContent.content,
                cover: postContent.cover,
                hashTagList: postContent.hashTagList.map((tag: { id: number; name: string }) => {
                    return tag.name;
                }),
                datePost: postContent.scheduleDate,
                timePost: postContent.scheduleTime,
                commentPermission: postContent.commentPermission,
                exampleIds:
                    postContent.examples != undefined && postContent.examples != null
                        ? postContent.examples.map((example: Example) => example.id)
                        : [],
                tableContent: postContent.tableContent,
            };

            setInitializeContent(postContent.content);
            setScheduleTime(postContent.scheduleTime);
            if (postContent.cover) {
                setCoverImage({
                    file: [
                        {
                            uid: "-1",
                            name: postContent.cover.originalName,
                            status: "done",
                            url: `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${postContent.cover.path}`,
                        },
                    ],
                });
            }

            setListExample(postContent.examples);
            setPost(tempData); // Now setPost uses the updated tempData
        };
        fetchTags();
        loadData();
    }, []);

    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const [wordCount, setWordCount] = useState<number>(0);
    const [tags, setTags] = useState<TagProps[]>([]);
    const [coverImage, setCoverImage] = useState<Cover>({ file: [] });
    const [showSearchDiv, setShowSearchDiv] = useState<boolean>(false);
    const [listExample, setListExample] = useState<Example[]>([] as Example[]);
    const [isCreating, setIsCreating] = useState(false);
    const [textGoal, setTextGoal] = useState<{ text: string; count: number }>({ text: "", count: 0 });
    const [scheduleTime, setScheduleTime] = useState<string | null>(null);
    const [heading, setHeading] = useState<TimeLineProps["listHeading"]>([]);
    const [isValidContent, setIsValidContent] = useState<boolean>(true);
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

    useEffect(() => {}, [post]);
    const handleToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCoverChange = (cover: Cover) => {
        setCoverImage(cover);
    };

    const handleTagsChange = (tags: string[]) => {
        setPost({
            ...post,
            hashTagList: tags,
        });
    };
    const handleListRelatedExample = (listExample: Example[]) => {
        setListExample(listExample);
    };
    const handleExampleID = (example: number[]) => {
        setPost({
            ...post,
            exampleIds: example,
        });
    };

    const handleEditPost = async () => {
        let coverData = null;
        const uploadCoverImage = async () => {
            const formData = new FormData();
            if (coverImage.file && coverImage.file[0].originFileObj) {
                formData.append("files", coverImage.file[0].originFileObj as Blob);
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload cover image");
            }

            const data = await response.json();
            if (!data || data === "") {
                throw new Error("Invalid cover data");
            }

            return data[0];
        };

        const createOrEditPost = async (postData: PostCreateProps, userToken: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts/${params.postID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error("Failed to edit post");
            }

            setTimeout(() => {
                const params = new URLSearchParams(queryNotify?.toString());
                params.set("notify", "Edited successfully");
                router.push(`/posts?${params.toString()}`);
            }, 0);
        };

        try {
            if (coverImage.file && coverImage.file[0].originFileObj) {
                coverData = await uploadCoverImage();
            } else {
                coverData = {
                    path: post.cover.path,
                    mediaType: "IMAGE",
                    originalName: post.cover.originalName,
                };
            }

            const updatedPost = {
                ...post,
                cover: coverData,
                tableContent: heading,
                content: extractHeadings(content)[1],
            };
            await createOrEditPost(updatedPost, userToken);
        } catch (error: any) {
            setIsCreating(false);
        }
    };
    const handleSetDate = (date: string | null) => {
        setPost({
            ...post,
            datePost: date,
        });
    };
    const handleSetTime = (time: string | null) => {
        setPost({
            ...post,
            timePost: time,
        });
    };

    const handlePermission = (permission: string) => {
        setPost({
            ...post,
            commentPermission: permission,
        });
    };

    const hanldeSetHeading = (content: string) => {
        const [headings, modifiedContent] = extractHeadings(content);

        setHeading(headings);
    };
    const handleContent = (contentValue: string) => {
        const words = getWordCount(contentValue);
        setWordCount(words);
        setContent(contentValue);
        if (contentValue == "<p><br></p>" || contentValue == "") {
            setIsValidContent(false);
        } else {
            setIsValidContent(true);
        }
        setPost((prevPost) => ({
            ...prevPost,
            content: contentValue,
        }));

        setWordCount(words);
    };
    const handleTitle = (title: string) => {
        setPost((prevPost) => ({
            ...prevPost,
            title: title,
        }));
    };
    const handleSearchDiv = () => {
        setShowSearchDiv(!showSearchDiv);
    };
    const handleScrollToText = (text: string, count: number) => {
        setTextGoal({ text, count });
    };

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
                                initialContent={initializeContent}
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
                            <div>
                                <h3 className="text-xl font-semibold leading-6 text-black1">
                                    Add cover <span className="text-red1">*</span>
                                </h3>
                                <p className="pb-[16px] pt-[8px] text-disable text-xl leading-6">Image upload format supports JPEG, JPG, PNG</p>
                                <CoverUpload initialCover={post.cover ? post.cover.path : ""} onCoverChange={handleCoverChange}></CoverUpload>
                            </div>
                            <div className="adding-tag pt-[16px]">
                                <h3 className="text-xl font-semibold leading-6 text-black1">
                                    Tags <span className="text-red1">*</span>
                                </h3>
                                <p className="pb-[16px] pt-[8px] text-disable text-xl leading-6">Help readers find your posts more easily</p>
                                <AddingTag listTags={post.hashTagList} onTagsChange={handleTagsChange}></AddingTag>
                            </div>
                            <div className="schedule-post pt-[16px]">
                                <h3 className="text-xl font-semibold leading-6 text-black1">Schedule posting</h3>
                                <p className="pb-[16px] pt-[8px] text-disable text-xl leading-6">
                                    Schedule your posts for when your audience is most active or for future posting times
                                </p>
                                <div className="scheduletime-pick flex items-center gap-[30px]">
                                    <DatePickerPage scheduleDate={post.datePost} getDate={handleSetDate}></DatePickerPage>
                                    <TimePickerPage scheduleTime={scheduleTime} getTime={handleSetTime} day={post.datePost}></TimePickerPage>
                                </div>
                            </div>
                            <div className="adding-tag pt-[16px]">
                                <h3 className="text-xl font-semibold leading-6 text-black1">Comment permissions</h3>
                                <p className="pb-[16px] pt-[8px] text-disable text-xl leading-6">Help you manage comment content below your post </p>
                                <PermissionSelect permissionValue={post.commentPermission} getPermission={handlePermission}></PermissionSelect>
                            </div>
                        </div>
                    </div>
                    {heading.length > 0 && (
                        <div id="timeline-tree" className="fixed top-[180px] right-[50px] max-h-[650px] w-[220px] overflow-y-scroll">
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
                                <Link
                                    href="/posts"
                                    className="px-[16px] py-[12px] text-[18px] font-semibold rounded-[8px] border-[2px] hover:border-blue3 bg-[#F4F4F4] hover:bg-white hover:text-blue3 transition duration-500 ease-in-out"
                                >
                                    Cancel
                                </Link>
                                <button
                                    disabled={
                                        post?.title === "" ||
                                        isValidContent === false ||
                                        post?.hashTagList.length === 0 ||
                                        coverImage.file?.length == 0 ||
                                        isCreating
                                    }
                                    onClick={() => {
                                        setIsCreating(true);
                                        handleEditPost();
                                    }}
                                    className={`px-[16px] py-[12px] text-[18px] font-semibold text-white flex gap-[12px] items-center rounded-[8px] transition duration-500 ease-in-out ${
                                        post.title === "" ||
                                        isValidContent === false ||
                                        post.hashTagList.length === 0 ||
                                        coverImage.file?.length == 0 ||
                                        isCreating
                                            ? "bg-gray-400"
                                            : "bg-[#3C7FF5] hover:bg-blue2 hover:text-blue3"
                                    }`}
                                >
                                    <IoRocketOutline className="w-[24px] h-[24px]" />
                                    <span>Edit Post</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostEdit;
