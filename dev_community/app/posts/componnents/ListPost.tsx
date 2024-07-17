/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Table, Dropdown, Button, Select, Pagination, DatePicker } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { TbDotsVertical } from "react-icons/tb";
import { toast } from "react-toastify";
import Link from "next/link";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Image from "next/image";
import iconFolder2 from "../../../public/asstets/icons/Themes (13)/vuesax/linear/folder-2.svg";
import iconFolderCloud from "../../../public/asstets/icons/Themes (13)/vuesax/linear/folder-cloud.svg";
import iconEdit from "../../../public/asstets/icons/Themes (13)/vuesax/linear/edit-2.svg";
import iconDelete from "../../../public/asstets/icons/Themes (13)/vuesax/linear/trash.svg";
import "./customTable.css";
import { useAppContext } from "@/app/utils/contextProvider";
import { AddSquare } from "iconsax-react";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type TableRowSelection<T> = TableProps<T>["rowSelection"];

const { RangePicker } = DatePicker;

// Get list Post
const fetchPosts = async (userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {
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

const deletePosts = async (ids: React.Key[], userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/posts`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
    });
    if (!res.ok) {
        throw new Error("Failed to delete posts");
    }
};
interface DataTypeComponents {
    key: React.Key;
    title: string;
    description: string;
    tag: string;
    dateCreated: string;
    view: string;
    status: string;
}

function extractTextFromHTML(htmlContent: string) {
    // Remove HTML tags and CSS
    const withoutTags = htmlContent.replace(/<[^>]+>/g, "");

    // Remove CSS
    const withoutCSS = withoutTags.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

    // Remove JavaScript
    const withoutJS = withoutCSS.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

    // Remove comments
    const withoutComments = withoutJS.replace(/<!--[\s\S]*?-->/g, "");

    // Trim excess whitespace
    const trimmed = withoutComments.trim();
    let dot: number[] = [];
    trimmed.split("").forEach((item, index) => {
        if (item === ".") dot.push(index);
    });
    // Return the extracted text
    if (trimmed.slice(0, dot[2]).length > 200) {
        return trimmed.slice(0, 200) + "...";
    } else {
        return trimmed.slice(0, dot[2]);
    }
}

const ListComponent = () => {
    const { userToken } = useAppContext();
    const notifyQueryURL = useSearchParams();
    const router = useRouter();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataTypeComponents[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("All");
    const [customDateRange, setCustomDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [draftFilter, setDraftFilter] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<string>("all");

    const handleDelete = async (keys: React.Key[]) => {
        try {
            const combinedIds = Array.from(new Set([...keys]));
            await deletePosts(combinedIds, userToken);
            toast.success("Deleted Successfully!", {
                position: "top-center",
                autoClose: 500,
            });

            const updatedPosts = await fetchPosts(userToken);
            const fetchedData = updatedPosts.map((item: any) => ({
                key: item.id,
                title: truncateText(item.title, 80),
                description: extractTextFromHTML(item.content),
                tag: item.hashTagList.map((tag: any) => tag.name).join(", "),
                dateCreated: new Date(item.createdDate).toLocaleDateString(),
                view: `${item.totalView == null ? "0" : item.totalView} view`,
                status: item.status,
            }));
            setData(fetchedData);
        } catch (error) {
            toast.error("Failed to delete posts", {
                position: "top-center",
                autoClose: 300,
            });
        }
    };

    const handleUpdate = (key: React.Key) => {
        handleLinkClick();
        router.push(`/posts/${key}`);
    };

    const handleDraftFilterClick = () => {
        setDraftFilter(true);
        setActiveButton("draft");
    };

    const handleAllFileClick = () => {
        setDraftFilter(false);
        setActiveButton("all");
    };

    const menuItems = (record: DataTypeComponents) => [
        {
            key: "update",
            label: (
                <div
                    onClick={(e) => {
                        handleUpdate(record.key);
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Image src={iconEdit} alt="" className="mr-2"></Image>
                    Edit
                </div>
            ),
        },
        {
            key: "delete",
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete([record.key]);
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Image src={iconDelete} alt="" className="mr-2"></Image>
                    Delete
                </div>
            ),
        },
    ];

    const columns: TableColumnsType<DataTypeComponents> = [
        {
            title: "Title",
            dataIndex: "title",
            width: 200,
        },
        {
            title: "Description",
            dataIndex: "description",
            width: 300,
            render: (text, record) => (
                <div>
                    {record.status === "DRAF" && <span className="text-red-500">DRAFT </span>}
                    {truncateText(text, 50)}
                </div>
            ),
        },
        {
            title: "Tag",
            dataIndex: "tag",
            width: 150,
        },
        {
            title: "Date Created",
            dataIndex: "dateCreated",
            width: 150,
        },
        {
            title: "View",
            dataIndex: "view",
            width: 100,
        },
        {
            title: (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "delete",
                                label: (
                                    <div
                                        onClick={(e) => {
                                            handleDelete(selectedRowKeys);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image src={iconDelete} alt="" className="mr-2"></Image>
                                        Delete
                                    </div>
                                ),
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button icon={<TbDotsVertical />} className="action-button" />
                </Dropdown>
            ),
            dataIndex: "action",
            width: 100,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: menuItems(record),
                    }}
                    trigger={["click"]}
                >
                    <Button
                        onClick={(e) => {
                            e.stopPropagation(); // Stop the event from propagating to the row click
                        }}
                        icon={<TbDotsVertical />}
                        className="action-button"
                    />
                </Dropdown>
            ),
        },
    ];

    const locale = {
        emptyText: <div className="flex justify-center items-center h-64">No Data</div>,
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.trim().length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchPosts(userToken);
                const fetchedData = result.map((item: any, index: number) => ({
                    key: item.id,
                    title: truncateText(item.title, 80),
                    description: extractTextFromHTML(item.content),
                    tag: item.hashTagList.map((tag: any) => tag.name).join(", "),
                    dateCreated: new Date(item.createdDate).toLocaleDateString(),
                    view: `${item.totalView == null ? "0" : item.totalView} view`,
                    status: item.status,
                }));
                setData(fetchedData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        if (notifyQueryURL ? notifyQueryURL.get("notify") === "created successfully" : "") {
            router.push("/posts");
        } else if (notifyQueryURL ? notifyQueryURL.get("notify") === "Edited successfully" : "") {
            router.push("/posts");
        }
        fetchData();
    }, []);

    const handleLinkClick = () => {
        sessionStorage.removeItem("draftId");
        setLoading(true);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataTypeComponents> = {
        selectedRowKeys,
        onChange: onSelectChange,
        renderCell: (checked, record, index, originNode) => <div onClick={(e) => e.stopPropagation()}>{originNode}</div>,
    };

    const handlePageSizeChange = (value: number) => {
        setPageSize(value);
        setCurrentPage(1);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        setCustomDateRange(null);
    };

    const handleCustomDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
        setCustomDateRange(dates);
        setDateFilter("Custom");
    };

    const filterByDate = (item: DataTypeComponents) => {
        const itemDate = dayjs(item.dateCreated);
        if (dateFilter === "Today") {
            return itemDate.isSame(dayjs(), "day");
        } else if (dateFilter === "Last Week") {
            return (
                itemDate.isSameOrAfter(dayjs().subtract(1, "weeks").startOf("week")) &&
                itemDate.isSameOrBefore(dayjs().subtract(1, "weeks").endOf("week"))
            );
        } else if (dateFilter === "Last Month") {
            return (
                itemDate.isSameOrAfter(dayjs().subtract(1, "months").startOf("month")) &&
                itemDate.isSameOrBefore(dayjs().subtract(1, "months").endOf("month"))
            );
        } else if (dateFilter === "Custom" && customDateRange) {
            return itemDate.isSameOrAfter(customDateRange[0]) && itemDate.isSameOrBefore(customDateRange[1]);
        }
        return true;
    };

    const filteredData = data.filter(
        (item) =>
            (item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchText.toLowerCase()) ||
                item.tag.toLowerCase().includes(searchText.toLowerCase())) &&
            filterByDate(item) &&
            (!draftFilter || item.status === "DRAF")
    );

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: filteredData.length,
        showSizeChanger: false,
        onChange: handlePaginationChange,
        itemRender: (current: any, type: any, originalElement: any) => {
            if (type === "prev") {
                return <Button>Previous</Button>;
            }
            if (type === "next") {
                return <Button>Next</Button>;
            }
            return originalElement;
        },
    };

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <div className="loader">Loading...</div>
                </div>
            )}
            <div className="relative">
                <div className="rounded-r-md border-t border-r border-b flex p-[20px_16px] justify-between items-start self-stretch">
                    <div className="flex items-start gap-4" id="iconFolderPost">
                        <button
                            onClick={handleAllFileClick}
                            className={`flex text-18px font-medium p-[12px_16px] justify-center items-center gap-3 rounded-md border ${
                                activeButton === "all"
                                    ? "bg-white text-blue3 border-blue3"
                                    : "border-gray-300 bg-white hover:bg-white hover:text-blue3 hover:border-blue3"
                            } ease-in-out transition duration-500`}
                        >
                            <Image src={iconFolder2} alt="" className={activeButton == "all" ? "icon-blue" : ""}></Image> All files
                        </button>
                        <button
                            onClick={handleDraftFilterClick}
                            className={`flex text-18px font-medium p-[12px_16px] justify-center items-center gap-3 rounded-md border  ${
                                activeButton === "draft"
                                    ? "bg-white text-blue3 border-blue3"
                                    : "border-gray-300 bg-white hover:bg-white hover:text-blue3 hover:border-blue3"
                            } ease-in-out transition duration-500`}
                        >
                            <Image src={iconFolderCloud} alt="" className={activeButton == "draft" ? "icon-blue" : ""}></Image> Save as a draft
                        </button>
                    </div>
                    <div className="flex justify-end items-start gap-10">
                        <div className="flex justify-end items-start gap-4 self-stretch">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    className="p-3 pr-10 w-[400px] min-w-[400px] rounded-lg border border-gray-300 focus:border-blue3 focus:outline-none"
                                    placeholder="Search for article..."
                                    value={searchText}
                                    onChange={handleSearch}
                                />

                                <svg
                                    className="absolute right-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 25 24"
                                    fill="none"
                                >
                                    <path
                                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                        stroke="#5F5F5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M22 22L20 20" stroke="#5F5F5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="list-select flex items-center">
                                <Select defaultValue="All" style={{ width: 195, height: 50 }} onChange={handleDateFilterChange}>
                                    <Select.Option value="All">All</Select.Option>
                                    <Select.Option value="Today">Today</Select.Option>
                                    <Select.Option value="Last Week">Last Week</Select.Option>
                                    <Select.Option value="Last Month">Last Month</Select.Option>
                                    <Select.Option value="Custom">Custom Date Range</Select.Option>
                                </Select>
                            </div>
                            {dateFilter === "Custom" && (
                                <div className="flex items-center">
                                    <RangePicker
                                        style={{ height: 50 }}
                                        onChange={(dates, dateStrings) => handleCustomDateChange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href="/posts/createPost"
                                    passHref
                                    onClick={handleLinkClick}
                                    className="font-semibold text-lg leading-5 px-[16px] py-[11px] text-[18px] text-white flex gap-[12px] items-center rounded-[8px] bg-blue3 border border-transparent hover:bg-white hover:text-blue3 hover:border-blue3 transition duration-500 ease-in-out hover:text-blue3"
                                >
                                    <AddSquare size="28" color="currentColor" />
                                    <span>New article</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* List post */}
            <div className="p-[20px_16px]" id={paginatedData.length == 0 ? "table-article" : ""}>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    rowClassName="cursor-pointer"
                    onRow={(record) => ({
                        onClick: (e) => {
                            const target = e.target as HTMLElement;
                            const isCheckbox = target.closest(".ant-table-selection-column");
                            if (!isCheckbox) {
                                handleUpdate(record.key);
                            }
                        },
                    })}
                />
                <div className="flex justify-between items-center mt-6 table-article" id="record">
                    <div className="flex items-center list-select">
                        <span className="mr-2">Display: </span>
                        <Select defaultValue={pageSize} style={{ width: 120 }} onChange={handlePageSizeChange}>
                            <Select.Option value={10}>10 results</Select.Option>
                            <Select.Option value={15}>15 results</Select.Option>
                            <Select.Option value={20}>20 results</Select.Option>
                        </Select>
                    </div>
                    <Pagination {...paginationConfig} />
                </div>
            </div>
        </div>
    );
};

export default ListComponent;
