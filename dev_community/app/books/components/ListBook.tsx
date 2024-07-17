/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    Dropdown,
    Button,
    Select,
    Pagination,
    DatePicker,
    Modal,
    Upload,
    message,
} from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
import type { TableColumnsType, TableProps } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { TbDotsVertical } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { LuPlusSquare } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./listBook.css";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type TableRowSelection<T> = TableProps<T>["rowSelection"];

const { RangePicker } = DatePicker;

interface DataTypeComponents {
    key: React.Key;
    createdDate: string;
    title: string;
    link: string;
    cover: {
        path: string;
        mediaType: string;
        originalName: string;
    };
}

const fetchBooks = async (userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/books`, {
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

const deleteBooks = async (ids: string[], userToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/books`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(ids),
    });
    if (!res.ok) {
        throw new Error("Failed to delete books");
    }
};

const ListBook = () => {
    const {userToken} = useAppContext();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataTypeComponents[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("All");
    const [customDateRange, setCustomDateRange] = useState<
        [dayjs.Dayjs, dayjs.Dayjs] | null
    >(null);
    const [isModalCreateBook, setIsModalCreateBook] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentBookId, setCurrentBookId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [title, setTitle] = useState("");
    const [linkBook, setLinkBook] = useState("");
    const [titleError, setTitleError] = useState<string | null>(null);
    const [linkBookError, setLinkBookError] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const columns: TableColumnsType<DataTypeComponents> = [
        {
            title: "Date created",
            dataIndex: "createdDate",
            width: 100,
        },
        {
            title: "Title",
            dataIndex: "title",
            width: 300,
        },
        {
            title: "Link",
            dataIndex: "link",
            width: 200,
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "delete",
                                label: <span>Delete</span>,
                                icon: <AiOutlineDelete className="size-6" />,
                                onClick: () => handleDelete(selectedRowKeys),
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button
                        icon={<TbDotsVertical />}
                        className="action-button"
                    />
                </Dropdown>
            ),
            dataIndex: "action",
            width: 100,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "update",
                                label: <span>Update</span>,
                                icon: <CiEdit className="size-6" />,
                                onClick: () => handleUpdate(record),
                            },
                            {
                                key: "delete",
                                label: <span>Delete</span>,
                                icon: <AiOutlineDelete className="size-6" />,
                                onClick: () => handleDelete([record.key]),
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button
                        icon={<TbDotsVertical />}
                        className="action-button"
                    />
                </Dropdown>
            ),
        },
    ];

    const truncateText = (text: string, maxLength: number) => {
        if (text.trim().length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    const loadData = async () => {
        try {
            const result = await fetchBooks(userToken);
            const fetchedData = result.map((item: any, index: number) => ({ 
                    key: item.id,
                    title: truncateText(item.title, 50),
                    createdDate: dayjs(item.createdDate).format(
                        "HH:mm - DD/MM/YYYY"
                    ),
                    link: truncateText(item.href, 50),
                    cover: item.cover[0],
                })
            );
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLinkClick = () => {
        setLoading(true);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataTypeComponents> = {
        selectedRowKeys,
        onChange: onSelectChange,
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

    const handleCustomDateChange = (
        dates: [dayjs.Dayjs, dayjs.Dayjs] | null
    ) => {
        setCustomDateRange(dates);
        setDateFilter("Custom");
    };

    const filterByDate = (item: DataTypeComponents) => {
        const itemDate = dayjs(item.createdDate, "HH:mm - DD/MM/YYYY");
        if (dateFilter === "Today") {
            return itemDate.isSame(dayjs(), "day");
        } else if (dateFilter === "Last Week") {
            return (
                itemDate.isSameOrAfter(
                    dayjs().subtract(1, "weeks").startOf("week")
                ) &&
                itemDate.isSameOrBefore(
                    dayjs().subtract(1, "weeks").endOf("week")
                )
            );
        } else if (dateFilter === "Last Month") {
            return (
                itemDate.isSameOrAfter(
                    dayjs().subtract(1, "months").startOf("month")
                ) &&
                itemDate.isSameOrBefore(
                    dayjs().subtract(1, "months").endOf("month")
                )
            );
        } else if (dateFilter === "Custom" && customDateRange) {
            return (
                itemDate.isSameOrAfter(customDateRange[0]) &&
                itemDate.isSameOrBefore(customDateRange[1])
            );
        }
        return true;
    };

    const filteredData = data.filter(
        (item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) &&
            filterByDate(item)
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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

    const showModal = () => {
        setIsUpdate(false);
        setIsModalCreateBook(true);
    };

    const handleUpdate = (record: DataTypeComponents) => {
        setTitle(record.title);
        setLinkBook(record.link);
        setFileList([
            {
                uid: "-1",
                name: "cover.jpg",
                status: "done",
                url: process.env.NEXT_PUBLIC_BASE_IMG_URL + record.cover.path,
            },
        ]);
        setCurrentBookId(record.key.toString());
        setIsUpdate(true);
        setIsModalCreateBook(true);
    };

    const handleOk = async () => {
        let isValid = true;

        if (!title) {
            setTitleError("Title is required");
            isValid = false;
        } else {
            setTitleError(null);
        }

        if (!linkBook) {
            setLinkBookError("Link book is required");
            isValid = false;
        } else {
            setLinkBookError(null);
        }

        if (fileList.length === 0) {
            setFileError("Cover image is required");
            isValid = false;
        } else {
            setFileError(null);
        }

        if (!isValid) {
            return;
        }

        try {
            let coverData = null;

            if (fileList.length > 0) {
                const coverFormData = new FormData();
                if (fileList[0].originFileObj) {
                    coverFormData.append(
                        "files",
                        fileList[0].originFileObj as Blob
                    );
    
                    const coverResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`,
                        {
                            method: "POST",
                            body: coverFormData,
                        }
                    );
    
                    if (!coverResponse.ok) {
                        throw new Error("Failed to upload cover image");
                    }
                    coverData = await coverResponse.json();
                } else {
                    if (isUpdate) {
                        const existingData = data.find((item) => item.key === currentBookId);
                        if (existingData) {
                            coverData = existingData.cover;
                        }
                    }
                }
            } 

            const bookData = {
                ...(isUpdate && { id: currentBookId }),
                title: title,
                href: linkBook,
                cover: coverData,
            };

            const response = await fetch(
                isUpdate
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/books/${currentBookId}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/books`,
                {
                    method: isUpdate ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify(bookData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save book");
            }

            message.success("Save Book & White paper success!");
            setFileList([]);
            setIsModalCreateBook(false);
            loadData();
            setTitle("");
            setLinkBook("");
        } catch (error) {
            message.error("Upload failed!");
            console.error("Error creating book: ", error);
        }
    };

    const handleCancel = () => {
        setIsModalCreateBook(false);
    };

    const handleDelete = async (ids: React.Key[]) => {
        try {
            await deleteBooks(ids as string[], userToken);
            message.success("Delete success!");
            loadData();
            setSelectedRowKeys([]);
        } catch (error) {
            message.error("Delete failed!");
            console.error("Error deleting books: ", error);
        }
    };

    const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
    };

    const beforeUpload = (file: UploadFile) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewImage(file.url || file.preview || "");
        setPreviewVisible(true);
        setPreviewTitle(
            file.name ||
                file.url?.substring(file.url.lastIndexOf("/") + 1) ||
                ""
        );
    };

    const handleCancelPreview = () => setPreviewVisible(false);

    const uploadProps: UploadProps = {
        name: "file",
        beforeUpload: beforeUpload,
        onChange: handleUploadChange,
        onPreview: handlePreview,
        multiple: false,
        accept: ".jpeg,.jpg,.png",
        listType: "picture-card",
        fileList,
    };

    const getBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <div className="loader">Loading...</div>
                </div>
            )}
            <div className="relative">
                <div className="rounded-r-md border-t border-r border-b flex p-[20px_16px] self-stretch items-center justify-end">
                    <div className="flex gap-4 self-stretch">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                className="p-3 pr-10 w-[600px] min-w-[400px] rounded-[5px] border border-gray-300 focus:border-blue3 focus:outline-none"
                                placeholder="Search for books..."
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
                                    d="M23.1504 21.1775L16.1942 14.2212C17.2736 12.8257 17.8576 11.1194 17.8576 9.32478C17.8576 7.17656 17.0192 5.16228 15.5031 3.64353C13.987 2.12478 11.9674 1.28906 9.82185 1.28906C7.67631 1.28906 5.65667 2.12746 4.1406 3.64353C2.62185 5.1596 1.78613 7.17656 1.78613 9.32478C1.78613 11.4703 2.62453 13.49 4.1406 15.006C5.65667 16.5248 7.67363 17.3605 9.82185 17.3605C11.6165 17.3605 13.3201 16.7766 14.7156 15.6998L21.6718 22.6533C21.6922 22.6738 21.7165 22.6899 21.7431 22.701C21.7698 22.712 21.7983 22.7177 21.8272 22.7177C21.8561 22.7177 21.8846 22.712 21.9113 22.701C21.9379 22.6899 21.9622 22.6738 21.9826 22.6533L23.1504 21.4882C23.1708 21.4678 23.187 21.4436 23.1981 21.4169C23.2091 21.3902 23.2148 21.3617 23.2148 21.3328C23.2148 21.304 23.2091 21.2754 23.1981 21.2487C23.187 21.2221 23.1708 21.1979 23.1504 21.1775ZM14.0647 13.5676C12.929 14.7007 11.4236 15.3248 9.82185 15.3248C8.22006 15.3248 6.7147 14.7007 5.57899 13.5676C4.44595 12.4319 3.82185 10.9266 3.82185 9.32478C3.82185 7.72299 4.44595 6.21496 5.57899 5.08192C6.7147 3.94888 8.22006 3.32478 9.82185 3.32478C11.4236 3.32478 12.9317 3.94621 14.0647 5.08192C15.1977 6.21763 15.8218 7.72299 15.8218 9.32478C15.8218 10.9266 15.1977 12.4346 14.0647 13.5676Z"
                                    fill="#515151"
                                />
                            </svg>
                        </div>
                        <div className="list-select flex items-center mr-10">
                            <Select
                                defaultValue="All"
                                style={{ width: 195, height: 50 }}
                                onChange={handleDateFilterChange}
                            >
                                <Select.Option value="All">All</Select.Option>
                                <Select.Option value="Today">
                                    Today
                                </Select.Option>
                                <Select.Option value="Last Week">
                                    Last Week
                                </Select.Option>
                                <Select.Option value="Last Month">
                                    Last Month
                                </Select.Option>
                                <Select.Option value="Custom">
                                    Custom Date Range
                                </Select.Option>
                            </Select>
                        </div>
                        {dateFilter === "Custom" && (
                            <div className="flex items-center">
                                <RangePicker
                                    style={{ height: 50 }}
                                    onChange={(dates, dateStrings) =>
                                        handleCustomDateChange(
                                            dates as
                                                | [dayjs.Dayjs, dayjs.Dayjs]
                                                | null
                                        )
                                    }
                                />
                            </div>
                        )}
                        <button
                            className="text-nowrap font-semibold justify-end px-[16px] py-[11px] text-[18px] text-white flex gap-[12px] items-center rounded-[8px] bg-blue3 border border-transparent hover:bg-white hover:text-blue3 hover:border-blue3 transition duration-500 ease-in-out"
                            onClick={showModal}
                        >
                            <LuPlusSquare className="w-[24px] h-[24px]" />
                            <span>Book & White paper</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* List post */}
            <div className="p-[20px_16px]" id={paginatedData.length == 0 ? 'table-books' : ''}>
            
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                />
                <div
                    className="flex justify-between items-center mt-6"
                    id="record"
                >
                    <div className="flex items-center list-select">
                        <span className="mr-2">Display: </span>
                        <Select
                            defaultValue={pageSize}
                            style={{ width: 120 }}
                            onChange={handlePageSizeChange}
                        >
                            <Select.Option value={10}>10 results</Select.Option>
                            <Select.Option value={15}>15 results</Select.Option>
                            <Select.Option value={20}>20 results</Select.Option>
                        </Select>
                    </div>
                    <Pagination {...paginationConfig} />
                </div>
            </div>
            <Modal
                width={1000}
                title={
                    <span className="font-bold text-2xl leading-7 text-black1">
                        Book & White paper
                    </span>
                }
                open={isModalCreateBook}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <button
                        key="back"
                        className="font-semibold text-base leading-5 text-black1 bg-gray4 px-[12px] py-[10px] rounded-lg mr-4 border border-borderGray1 hover:bg-white hover:text-blue3 hover:border-blue3 transition ease-in-out duration-500"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>,
                    <button
                        key="submit"
                        className="text-white bg-blue3 border border-blue3 px-[15px] py-[10px] rounded-lg font-semibold text-base leading-5 hover:bg-white hover:text-blue3 transition ease-in-out duration-500"
                        onClick={handleOk}
                    >
                        Save book
                    </button>,
                ]}
            >
                <div className="flex justify-between items-start mt-8">
                    <div className="text-black1 font-medium text-base leading-5 w-full">
                        <p className="mb-2">
                            Title <span className="text-red1">*</span>
                        </p>
                        <input
                            type="text"
                            className="p-3 pr-10 w-[465px] h-[50px] rounded-lg border border-gray-300 mt-1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Please enter title of transaction here"
                        />
                        {titleError && (
                            <p className="text-red-500 text-sm">{titleError}</p>
                        )}
                        <p className="mb-2 mt-4">
                            Link book <span className="text-red1">*</span>
                        </p>
                        <input
                            type="text"
                            className="p-3 pr-10 w-[465px] h-[50px] rounded-lg border border-gray-300"
                            value={linkBook}
                            onChange={(e) => setLinkBook(e.target.value)}
                            placeholder="Please enter link of transaction here"
                        />
                        {linkBookError && (
                            <p className="text-red-500 text-sm">
                                {linkBookError}
                            </p>
                        )}
                    </div>
                    <div
                        id="uploadFile"
                        className="text-black1 font-medium text-base leading-5 w-full"
                    >
                        <p className="mb-2">
                            Cover image <span className="text-red1">*</span>
                        </p>
                        <p className="font-normal text-base text-disable leading-5 mb-2">
                            Image upload format supports JPEG, JPG, PNG
                        </p>
                        <div className="flex items-center justify-center w-full h-full mb-4">
                            <Upload {...uploadProps}>
                                {fileList.length >= 1 ? null : (
                                    <div className="flex items-center justify-between">
                                        <LuPlus className="size-6 mr-1" />
                                        <div
                                            className="font-normal text-base leading-5 text-disable"
                                            style={{ marginTop: 8 }}
                                        >
                                            Upload or drag cover image
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </div>
                        {fileError && (
                            <p className="text-red-500 text-sm">{fileError}</p>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelPreview}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
};

export default ListBook;
