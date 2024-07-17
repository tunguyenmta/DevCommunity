/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Select, Dropdown, Modal, Input, Pagination, message } from "antd";
import Link from "next/link";
import { useAppContext } from "@/app/utils/contextProvider";
import { FiFolderPlus } from "react-icons/fi";
import { PiDotsThreeOutline, PiDotsThreeOutlineVertical } from "react-icons/pi";
import { parseISO, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import "./listComponent.css";
import Image from "next/image";
import foundOpen from "../../../public/asstets/icons/Themes (13)/vuesax/linear/folder-open.svg";
import edit from "../../../public/asstets/icons/Themes (13)/vuesax/linear/edit-2.svg";
import archive from "../../../public/asstets/icons/Themes (13)/vuesax/linear/archive.svg";
import close from "../../../public/asstets/icons/Themes (13)/vuesax/linear/close-circle.svg";
import { FolderAdd, SearchNormal1 } from "iconsax-react";
import { AddSquare } from "iconsax-react";

const fetchCategoryNames = async (userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch components");
    }
    return res.json();
};

const fetchCreateCategory = async (nameCategory: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories`, {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameCategory }),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to create category");
    }
    return res.json();
};

const fetchEditCategory = async (categoryId: string, newName: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories/${categoryId}`, {
        method: "PUT",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: categoryId,
            name: newName,
        }),
    });
    if (!res.ok) {
        throw new Error("Failed to edit category");
    }
};

const fetchDeleteCategory = async (categoryId: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories/${categoryId}`, {
        method: "DELETE",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to delete category");
    }
};

const fetchComponents = async (userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/components`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch components");
    }
    return res.json();
};

const fetchDeleteComponent = async (idComponent: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/components/${idComponent}`, {
        method: "DELETE",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to delete component");
    }
};

const fetchComponentsByCategory = async (categoryId: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories/${categoryId}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch components by category");
    }
    return res.json();
};

const fetchMoveComponent = async (idComponent: string, categoryId: string | null, categoryName: string, userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/components/move/${idComponent}`, {
        method: "PUT",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: idComponent,
            category: {
                id: categoryId,
                name: categoryName,
            },
        }),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to move component");
    }
};

interface Folder {
    id: string;
    name: string;
    totalComponent: number;
    covers: {
        path: string;
        mediaType: string;
        originalName: string;
    }[];
    resources: {
        html: string;
        css: string;
        javascript: string;
    };
    components: Component[];
}

interface Component {
    id: string;
    title: string;
    totalView: number;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
    createdDate: string;
}

interface ComponentResponse {
    folders: Folder[];
    components: Component[];
}

const ListComponent = () => {
    const { userToken } = useAppContext();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
    const [isModalCreateCategory, setIsModalCreateCategory] = useState(false);
    const [isModalDeleteCategory, setIsModalDeleteCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [archiveInput, setArchiveInput] = useState("");
    const [showError, setShowError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [actionType, setActionType] = useState<"create" | "edit">("create");
    const [componentToDelete, setComponentToDelete] = useState<string | null>(null);
    const [componentToMove, setComponentToMove] = useState<string | null>(null);
    const [existingCategories, setExistingCategories] = useState<Folder[]>([]);
    const [selectedFolderData, setSelectedFolderData] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLinkClick = () => {
        setLoading(true);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = parseISO(dateString);
        const minutesDifference = differenceInMinutes(new Date(), date);
        const hoursDifference = differenceInHours(new Date(), date);
        const daysDifference = differenceInDays(new Date(), date);

        if (minutesDifference < 60) {
            return `About ${minutesDifference} minute${minutesDifference !== 1 ? "s" : ""} ago`;
        } else if (hoursDifference < 24) {
            return `About ${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
        } else {
            return `Published ${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
        }
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleFolderClick = async (folderId: string) => {
        try {
            const data = await fetchComponentsByCategory(folderId, userToken);
            setSelectedFolderData(data);
        } catch (error) {
            console.error("Error fetching components by category:", error);
        }
    };

    const fetchAndSetComponents = async () => {
        try {
            const [componentData, categoryNames] = await Promise.all([fetchComponents(userToken), fetchCategoryNames(userToken)]);
            const componentResponse = componentData as ComponentResponse;
            setFolders(componentResponse.folders);
            setComponents(componentResponse.components);
            setExistingCategories(
                categoryNames.map((category: { id: number; name: string }) => ({
                    id: category.id.toString(),
                    name: category.name,
                    totalComponent: 0,
                    covers: [],
                    components: [],
                }))
            );
        } catch (error) {
            console.error("Error fetching components or categories:", error);
        }
    };

    useEffect(() => {
        fetchAndSetComponents();
    }, []);

    const truncateText = (text: string, maxlength: number) => {
        if (text.length > maxlength) {
            return text.slice(0, maxlength) + "...";
        }
        return text;
    };

    const showModal = (componentId: string) => {
        setComponentToMove(componentId);
        setIsModalVisible(true);
    };

    const showArchiveModal = (componentId: string) => {
        setComponentToDelete(componentId);
        setIsArchiveModalVisible(true);
    };

    const showModalCreateCategory = (action: "create" | "edit") => {
        setActionType(action);
        setIsModalCreateCategory(true);
    };

    const showModalDeleteCategory = () => {
        setIsModalDeleteCategory(true);
    };

    const handleOkVisible = async () => {
        const newCategoryLower = newCategory.trim().toLowerCase();
        const lowerCaseCategories = existingCategories.map((category) => category.name.toLowerCase());

        if (selectedCategory === "New category" && newCategoryLower === "") {
            setCategoryError("Please give category a name");
        } else if (lowerCaseCategories.includes(newCategoryLower)) {
            setCategoryError("Already exist");
        } else {
            try {
                let categoryId = null;
                let categoryName = newCategory;
                if (selectedCategory !== "New category") {
                    const selectedFolder = existingCategories.find((folder) => folder.name === selectedCategory);
                    if (selectedFolder) {
                        categoryId = selectedFolder.id;
                        categoryName = selectedFolder.name;
                    }
                }

                if (componentToMove) {
                    await fetchMoveComponent(componentToMove, categoryId, categoryName, userToken);
                    toast.success("Component moved successfull!", {
                        autoClose: 3000,
                        position: "top-center"
                    });
                    fetchAndSetComponents();
                }
                setIsModalVisible(false);
                setCategoryError("");
            } catch (error) {
                toast.error("Failed to move component");
            }
        }
    };

    const handleOkArchive = async () => {
        if (archiveInput === "archive" && (componentToDelete || selectedFolderData)) {
            try {
                if (componentToDelete) {
                    await fetchDeleteComponent(componentToDelete, userToken);
                    setComponents((prevComponents) => prevComponents.filter((component) => component.id !== componentToDelete));
                }
                if (selectedFolderData) {
                    const updatedFolderData = await fetchComponentsByCategory(selectedFolderData.id, userToken);
                    setSelectedFolderData(updatedFolderData);
                }
                setComponentToDelete(null);
                setIsArchiveModalVisible(false);
                setArchiveInput("");
                toast.success("Component deleted successfully!", {
                    autoClose: 3000,
                    position: "top-center"
                });
            } catch (error) {
                toast.error("Failed to delete component");
            }
        }
    };

    const handleOkCreateCategory = async () => {
        const newCategoryLower = newCategory.trim().toLowerCase();
        const lowerCaseCategories = existingCategories.map((category) => category.name.toLowerCase());

        if (newCategory.trim() === "") {
            setShowError("Please give category a name");
        } else if (lowerCaseCategories.includes(newCategoryLower)) {
            setShowError("Already exist");
        } else {
            try {
                if (actionType === "create") {
                    await fetchCreateCategory(newCategory, userToken);
                } else if (selectedFolderData) {
                    await fetchEditCategory(selectedFolderData.id, newCategory, userToken);
                    const updatedFolderData = await fetchComponentsByCategory(selectedFolderData.id, userToken);
                    setSelectedFolderData(updatedFolderData);
                }
                await fetchAndSetComponents();
                setIsModalCreateCategory(false);
                setNewCategory("");
                setShowError("");
                toast.success(`Category ${actionType === "create" ? "created" : "edited"} successfully`, {
                    autoClose: 3000,
                    position: "top-center"
                });
            } catch (error) {
                toast.error(`Can't ${actionType === "create" ? "create" : "edit"} category`);
            }
        }
    };

    const handleOkDeleteCategory = async () => {
        if (selectedFolderData) {
            try {
                await fetchDeleteCategory(selectedFolderData.id, userToken);
                toast.success("Category deleted successfully!", {
                    autoClose: 1000,
                    position: "top-center"
                });
                setIsModalDeleteCategory(false);
                setSelectedFolderData(null);
                fetchAndSetComponents();
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsArchiveModalVisible(false);
        setIsModalCreateCategory(false);
        setIsModalDeleteCategory(false);
        setShowError("");
        setCategoryError("");
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCategoryError("");
    };

    const handleFilterChange = (value: string) => {
        setFilterOption(value);
        setSelectedFolderData(null);
        setCurrentPage(1);
    };

    const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const filteredComponents = components.filter((component) => component.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const combinedItems = [
        ...(filterOption === "All" || filterOption === "Folders" ? filteredFolders : []),
        ...(filterOption === "All" || filterOption === "Components" ? filteredComponents : []),
    ];
    
    const currentItems = (items: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div>
            <div className="relative">
                <div className="w-full rounded-r-md border-t border-r border-b flex py-[16px] justify-between items-start self-stretch">
                    <div className="w-full flex items-start">
                        <div className="w-full flex items-start gap-4 px-6 self-stretch">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    className="p-3 pr-10 w-[740px] min-w-[740px] rounded-lg border border-gray-300 focus:border-blue3 focus:outline-none"
                                    placeholder="Search for components..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                />
                                <SearchNormal1 size="25" color="#5F5F5F" className="absolute right-3" />

                            </div>
                            <div className="list-select flex items-center mr-10">
                                <Select defaultValue="All" style={{ width: 250, height: 50 }} onChange={handleFilterChange}>
                                    <Select.Option value="All">All files</Select.Option>
                                    <Select.Option value="Folders">Folders</Select.Option>
                                    <Select.Option value="Components">Components</Select.Option>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => showModalCreateCategory("create")}
                                    className="text-nowrap px-[16px] py-[11px] text-[18px] text-blue3 font-semibold flex gap-[12px] items-center rounded-[8px] bg-white border  hover:bg-blue3 hover:text-white hover:border-blue3 transition duration-500 ease-in-out"
                                >
                                    <FolderAdd size="28" color="currentColor"/>
                                    <span>Create category</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    onClick={handleLinkClick}
                                    href="/components/createComponent"
                                    passHref
                                    className="text-nowrap px-[16px] py-[11px] text-[18px] hover:text-blue3  font-semibold text-white flex gap-[12px] items-center rounded-[8px] bg-blue3 border border-transparent hover:bg-white hover:border-blue3 transition duration-500 ease-in-out"
                                >
                                    <AddSquare size="28" color="currentColor" />
                                    <span>New component</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-[20px_16px]">
                {selectedFolderData ? (
                    <div>
                        <h2 className="text-base font-normal text-black1 leading-5 mb-2 flex items-center">
                            <a href={`/components`} onClick={handleLinkClick}>
                                All files
                            </a>{" "}
                            <span className="mx-2">{">"}</span> {selectedFolderData.name}
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "editCategory",
                                            label: (
                                                <div className="dropdown-item pb-1 flex items-center" onClick={() => showModalCreateCategory("edit")}>
                                                    <Image src={edit} alt="Edit" width={20} height={20} />
                                                    <span className="ml-2">Edit</span>
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "deleteCategory",
                                            label: (
                                                <div className="dropdown-item pb-1 flex items-center" onClick={() => showModalDeleteCategory()}>
                                                    <Image src={archive} alt="Delete" width={20} height={20} />
                                                    <span className="ml-2">Delete</span>
                                                </div>
                                            ),
                                        },
                                    ],
                                }}
                                trigger={["click"]}
                            >
                                <div onClick={(e) => e.preventDefault()} className="ml-2">
                                    <PiDotsThreeOutlineVertical className="cursor-pointer size-6 text-black1" />
                                </div>
                            </Dropdown>
                        </h2>
                        <div className="ml-4 grid grid-cols-4 gap-4">
                            {selectedFolderData.components.length > 0 &&
                                selectedFolderData.components.map((component, index) => {
                                    return (
                                        <div key={component.id} className="flex flex-col">
                                            <Link href={`/components/${component.id}`} onClick={handleLinkClick}>
                                                <div className="w-[360px] h-[300px] overflow-hidden bg-[#F7F9FB] p-6 rounded-xl flex justify-center items-center">
                                                    <div className="w-[95%] h-[100%] pointer-events-none">
                                                        <iframe
                                                            srcDoc={`
                                                                <html>
                                                                <head>
                                                                <style>${component.resource.css}
                                                                body, html{
                                                                height: 100%;
                                                                width: 100%;}
                                                        </style>
                                                        </head>
                                                        <body style="height: 100vh; display: flex; justify-content: center; align-items: center; overflow: hidden">
                                                        ${component.resource.html}<script>${component.resource.javascript}
                                                        </script></body></html>`}
                                                            className="w-full h-full "
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="flex justify-between items-center mt-2">
                                                <div>
                                                    <p className="font-semibold text-base leading-5">{truncateText(component.title, 20)}</p>
                                                    <p className="font-normal text-base leading-5 text-gray1 mt-2">
                                                        {formatTimeAgo(component.createdDate)}
                                                    </p>
                                                </div>
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            {
                                                                key: Math.floor(Math.random() * 1000000),
                                                                label: "Move to folder",
                                                                icon: <Image src={foundOpen} alt="Move to folder" width={20} height={20} />,
                                                                onClick: () => showModal(component.id),
                                                            },
                                                            {
                                                                key: Math.floor(Math.random() * 1000000),
                                                                label: (
                                                                    <Link onClick={handleLinkClick} href={`/components/${component.id}`}>
                                                                        <div className="border-b border-gray-300 pb-1 flex items-center">
                                                                            <Image src={edit} alt="Edit" width={20} height={20} />
                                                                            <span className="ml-2">Edit</span>
                                                                        </div>
                                                                    </Link>
                                                                ),
                                                            },
                                                            {
                                                                key: Math.floor(Math.random() * 1000000),
                                                                label: "Archive",
                                                                icon: <Image src={archive} alt="Archive" width={20} height={20} />,
                                                                onClick: () => showArchiveModal(component.id),
                                                            },
                                                        ],
                                                    }}
                                                    trigger={["click"]}
                                                >
                                                    <PiDotsThreeOutline className="cursor-pointer size-6 text-black1" />
                                                </Dropdown>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className={`grid grid-cols-4 gap-4 ${combinedItems.length <= 0 ? "h-[700px]" : ""}`}>
                            {currentItems(combinedItems).map((item) => {
                                return "title" in item ? (
                                    <div key={Math.floor(Math.random() * 1000000)} className="flex flex-col">
                                        <Link href={`/components/${item.id}`} onClick={handleLinkClick}>
                                            <div className="w-[360px] h-[300px] overflow-hidden bg-[#F7F9FB] p-6 rounded-xl flex justify-center items-center">
                                                <div className="w-full h-full bg-transparent">
                                                    <div className="w-[95%] h-[100%] pointer-events-none">
                                                        <iframe
                                                            srcDoc={`<html><head><style>${item.resource.css}
                          </style></head><body style="height: 100vh; display: flex; justify-content: center; align-items: center;overflow:hidden">${item.resource.html}<script>${item.resource.javascript}</script></body></html>`}
                                                            className="w-full h-full "
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex justify-between items-center mt-2">
                                            <div>
                                                <p className="font-semibold text-base leading-5">{truncateText(item.title, 40)}</p>
                                                <p className="font-normal text-base leading-5 text-gray1 mt-2">{formatTimeAgo(item.createdDate)}</p>
                                            </div>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        {
                                                            key: Math.floor(Math.random() * 1000000),
                                                            label: "Move to folder",
                                                            icon: <Image src={foundOpen} alt="Move to folder" width={20} height={20} />,
                                                            onClick: () => showModal(item.id),
                                                        },
                                                        {
                                                            key: Math.floor(Math.random() * 1000000),
                                                            label: (
                                                                <Link href={`/components/${item.id}`}>
                                                                    <div className="border-b border-gray-300 pb-1 flex items-center">
                                                                        <Image src={edit} alt="Edit" width={20} height={20} />
                                                                        <span className="ml-2">Edit</span>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        },
                                                        {
                                                            key: Math.floor(Math.random() * 1000000),
                                                            label: "Archive",
                                                            icon: <Image src={archive} alt="Archive" width={20} height={20} />,
                                                            onClick: () => showArchiveModal(item.id),
                                                        },
                                                    ],
                                                }}
                                                trigger={["click"]}
                                            >
                                                <PiDotsThreeOutline className="cursor-pointer size-6 text-black1" />
                                            </Dropdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={Math.floor(Math.random() * 1000000)}
                                        className="flex flex-col items-start cursor-pointer"
                                        onClick={() => handleFolderClick(item.id)}
                                    >
                                        <div className="flex flex-col items-start">
                                            <div
                                                className={`grid ${item.resources.length > 1 ? "grid-cols-2" : ""
                                                    } gap-2 w-[360px] h-[300px] bg-[#F7F9FB] p-6 rounded-xl`}
                                            >
                                                {item.resources.map(
                                                    (
                                                        resource: {
                                                            html: string;
                                                            css: string;
                                                            javascript: string;
                                                            typescript: string;
                                                            java: string;
                                                            database: string;
                                                        },
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={Math.floor(Math.random() * 1000000)}
                                                            className="flex justify-center items-center w-full h-full overflow-hidden"
                                                        >
                                                            <div className="w-full h-full bg-transparent">
                                                                <div className="w-[95%] h-[100%] pointer-events-none">
                                                                    <iframe
                                                                        srcDoc={`<html><head><style>${resource.css}
                                body, html{
                                height: 100%;
                                width: 100%;    
                                }
                          </style></head><body style="height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">${resource.html}<script>${resource.javascript}</script></body></html>`}
                                                                        className="w-full h-full "
                                                                    ></iframe>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-semibold text-base leading-5 mt-2">{truncateText(item.name, 20)}</p>
                                        <p className="font-normal text-base leading-5 text-gray1 mt-2">{item.totalComponent} files component</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center mt-6" id="record">
                            <div className="flex items-center list-select">
                                <span className="mr-2">Display: </span>
                                <Select defaultValue={8} style={{ width: 120 }} onChange={handleItemsPerPageChange}>
                                    <Select.Option value={8}>2 rows</Select.Option>
                                    <Select.Option value={16}>4 rows</Select.Option>
                                    <Select.Option value={24}>6 rows</Select.Option>
                                </Select>
                            </div>
                            <Pagination
                                current={currentPage}
                                pageSize={itemsPerPage}
                                total={combinedItems.length}
                                onChange={(page) => {
                                    setCurrentPage(page);
                                    setSelectedFolderData(null);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div id="modalCategory">
                <Modal
                    centered
                    title={<span className="text-xl leading-6 font-bold text-black1">Move to category</span>}
                    open={isModalVisible}
                    onOk={handleOkVisible}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="cancel"
                            onClick={handleCancel}
                            className="font-semibold text-base leading-5 text-black1 bg-gray4 px-[12px] py-[10px] rounded-lg mr-4 border border-borderGray1 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        >
                            Cancel
                        </button>,
                        <button
                            key="create"
                            onClick={handleOkVisible}
                            className="text-white bg-blue3 border border-blue3 px-[15px] py-[10px] rounded-lg font-semibold text-base leading-5 hover:bg-white hover:text-blue3 transition ease-in-out duration-500"
                        >
                            Move file
                        </button>,
                    ]}
                >
                    <div className="mb-2 font-semibold text-base leading-5 mt-4">Category</div>
                    <Select
                        className="w-full"
                        style={{
                            height: "48px",
                            marginBottom: "8px",
                            maxHeight: "144px",
                            overflowY: "auto",
                        }}
                        onChange={handleCategoryChange}
                        defaultValue="All files"
                    >
                        <Select.Option value="All files">All files</Select.Option>
                        <Select.Option value="New category">New category...</Select.Option>
                        {existingCategories.slice(0, 6).map((category) => (
                            <Select.Option key={category.id} value={category.name}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                    {selectedCategory == "New category" && (
                        <div className="mt-4">
                            <div className="font-semibold text-base leading-5">
                                Category name <span className="text-red1">*</span>
                            </div>
                            <input
                                placeholder="New category"
                                className={`border w-full rounded-lg px-4 font-normal text-base h-12 mt-2 mb-2 gap-2 ${categoryError == "Please give category a name" ? "border-[#f4cb5d]" : categoryError == "Already exist" ? "border-[#FF274C]" : undefined}`}
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <span
                                className={`text-base font-normal leading-5 ${categoryError === "Please give category a name"
                                    ? "text-yellow1"
                                    : categoryError === "Already exist"
                                        ? "text-red1"
                                        : ""
                                    }`}
                            >
                                {categoryError}
                            </span>
                        </div>
                    )}
                </Modal>
            </div>

            <div id="modalArchive">
                <Modal
                    width={600}
                    centered
                    title={<span className="text-xl leading-6 font-bold text-black1">Archive component</span>}
                    open={isArchiveModalVisible}
                    onOk={handleOkArchive}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="cancel"
                            onClick={handleCancel}
                            className="font-semibold text-base leading-5 text-black1 bg-gray4 px-[12px] py-[10px] rounded-lg mr-4 border border-borderGray1 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        >
                            Cancel
                        </button>,
                        <button
                            key="create"
                            onClick={handleOkArchive}
                            className={`text-white bg-blue3 border border-blue3 px-[15px] py-[10px] rounded-lg font-semibold text-base leading-5 transition ease-in-out duration-500 ${archiveInput !== "archive"
                                ? "opacity-50 cursor-not-allowed bg-borderGray1 text-disable border-none"
                                : "hover:bg-white hover:text-blue3 hover:border-blue3"
                                }`}
                            disabled={archiveInput !== "archive"}
                        >
                            Archive component
                        </button>,
                    ]}
                >
                    <div className="mb-6 font-normal text-base leading-5 text-gray1 mt-8">
                        Archiving this component will immediately remove it from your Dashboard.
                    </div>
                    <p className="font-semibold text-base leading-5 text-black1">I understand that:</p>
                    <div className="flex items-center mt-4">
                        <Image src={close} alt="" className="size-6 mr-2"></Image>{" "}
                        <span className="font-normal text-base leading-5 text-gray1">My component will be unpublished</span>
                    </div>
                    <div className="flex items-center mt-2">
                        <Image src={close} alt="" className="size-6 mr-2"></Image>{" "}
                        <span className="font-normal text-base leading-5 text-gray1 text-nowrap">
                            Everyone in the Workspace will lose access to this component
                        </span>
                    </div>
                    <div className="mt-8 text-base font-normal leading-5">
                        Confirm by typing <span className="text-blue3">archive</span> below.
                        <Input
                            placeholder="archive"
                            value={archiveInput}
                            style={{
                                height: "48px",
                                marginTop: "8px",
                                marginBottom: "8px",
                                gap: "10px",
                            }}
                            onChange={(e) => setArchiveInput(e.target.value)}
                        />
                    </div>
                </Modal>
            </div>

            <div id="modalCreateCategory">
                <Modal
                    centered
                    title={<span className="text-xl leading-6 font-bold text-black1">Create category</span>}
                    open={isModalCreateCategory}
                    onOk={handleOkCreateCategory}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="cancel"
                            onClick={handleCancel}
                            className="font-semibold text-base leading-5 text-black1 bg-gray4 px-[12px] py-[10px] rounded-lg mr-4 border border-borderGray1 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        >
                            Cancel
                        </button>,
                        <button
                            key="create"
                            onClick={handleOkCreateCategory}
                            className="text-white bg-blue3 border border-blue3 px-[15px] py-[10px] rounded-lg font-semibold text-base leading-5 hover:bg-white hover:text-blue3 transition ease-in-out duration-500"
                        >
                            Create category
                        </button>,
                    ]}
                >
                    <div className="mb-2 font-semibold text-base leading-5 mt-4">
                        Category name <span className="text-red1">*</span>
                    </div>
                    <input
                        placeholder="New category"
                        className={`border w-full rounded-lg px-4 font-normal text-base h-12 mt-2 mb-2 gap-2 ${showError == "Please give category a name" ? "border-[#f4cb5d]" : showError == "Already exist" ? "border-[#FF274C]" : undefined}`}
                        value={newCategory}
                        onChange={(e) => {
                            setNewCategory(e.target.value);
                            setShowError("");
                        }}
                    />
                    {showError && (
                        <span
                            className={`${showError == "Please give category a name" ? "text-yellow1" : showError == "Already exist" ? "text-red1" : ""
                                } text-base font-normal leading-5`}
                        >
                            {showError}
                        </span>
                    )}
                </Modal>
            </div>

            <div id="modalDeleteCategory">
                <Modal
                    width={800}
                    centered
                    title={<span className="text-xl leading-6 font-bold text-black1">Delete category</span>}
                    open={isModalDeleteCategory}
                    onOk={handleOkDeleteCategory}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="cancel"
                            onClick={handleCancel}
                            className="font-semibold text-base leading-5 text-black1 bg-gray4 px-[12px] py-[10px] rounded-lg mr-4 border border-borderGray1 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        >
                            Cancel
                        </button>,
                        <button
                            key="create"
                            onClick={handleOkDeleteCategory}
                            className="text-white bg-red1 border px-[15px] py-[10px] rounded-lg font-semibold text-base leading-5 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        >
                            Delete category
                        </button>,
                    ]}
                >
                    <div className="mb-2 font-normal text-base leading-5 mt-4">
                        Are you sure you want to delete this category? Upon deletion, the contents of this category will be moved to all component.
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ListComponent;
