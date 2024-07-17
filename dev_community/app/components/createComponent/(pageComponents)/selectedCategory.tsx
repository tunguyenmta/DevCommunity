"use client";
import React, { useState, useEffect } from "react";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Modal } from "antd";
import { Input } from "antd";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/utils/contextProvider";
import { FiCheck } from "react-icons/fi";
import "./selectedCategory.css";
import { TbTriangleInvertedFilled } from "react-icons/tb";

const { TextArea } = Input;

interface categoryProps {
  name: string;
  id: number;
}

interface dropdownProps {
  initialCategory?: { id: number; name: string };
  category: number;
  handleChangeCategory: (category: number) => void;
}

const CategorySelect: React.FC<dropdownProps> = ({
  initialCategory,
  category,
  handleChangeCategory,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [listCategory, setListCategory] = useState<categoryProps[]>(
    []
  );
  const [newCategory, setNewCategory] = useState<string>("" as string);
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    id: number;
  }>({ name: "All files", id: -1 });
  const [isValidCategory, setIsValidCategory] = useState<boolean>(newCategory != "" ? true : false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { userToken } = useAppContext()
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      handleChangeCategory(initialCategory.id);
    }
  }, []);

  useEffect(() => {
    const currentCategory = listCategory.find((c) => c.id === category);
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    } else {
      setSelectedCategory({ name: "All files", id: -1 });
    }
  }, [category, listCategory]);
  const fetchCategory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories`,
      {
        headers: {
          "Cache-Control": "no-store",
          Authorization: "Bearer " + userToken,
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      console.log(response.status);
      throw new Error("Failed to fetch category");
    }
    const data = await response.json();
    setListCategory(data);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const items: MenuProps["items"] = listCategory.map((item) => {
    return {
      key: item.id,
      label: (
        <div className="flex justify-between items-center">
          {item.name}
          {selectedCategory.id === item.id && (
            <FiCheck className="text-blue3" />
          )}
        </div>
      ),
      onClick: () => {
        handleChangeCategory(item.id);
      },
    };
  });
  items.unshift({
    key: "new",
    label: "New Category...",
    onClick: () => {
      setOpen(!open);
    },
  });
  items.unshift({
    key: "-1",
    label: (
      <>
        <div className="flex justify-between items-center">
          {"All files"}
          {selectedCategory.id === -1 && <FiCheck className="text-blue3" />}
        </div>
      </>
    ),
    onClick: () => {
      handleChangeCategory(-1);
    },
  });
  return (
    <>
      <div id="category-select">
        <h1 className="font-semibold pb-4 text-[#292929]">Category</h1>

        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              <span className="text-blue3">
                {selectedCategory?.id == -1
                  ? "All files"
                  : selectedCategory?.name}
              </span>
              <TbTriangleInvertedFilled className="w-[12px] h-[12px]" />
            </Space>
          </a>
        </Dropdown>

        <Modal
          title="New Category"
          centered
          open={open}
          okButtonProps={{ disabled: !isValidCategory }}
          okText="Create Category"
          onOk={() => {
            const createCategory = async () => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/component-categories`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                  },
                  method: "POST",
                  body: JSON.stringify({ name: newCategory }),
                }
              );
              if (!res.ok) {
                throw new Error("Failed to create category");
              }
              const data = await res.json();
              setNewCategory("");
              setListCategory([...listCategory, data]);
              handleChangeCategory(data.id);
              setOpen(false);
              toast.success("Category created successfully", { autoClose: 1000, position: "top-center" });
            };
            createCategory().catch((error) => {
              toast.error("Failed to create category", { autoClose: 1000, position: "top-center" });
            });
          }}
          onCancel={() => {
            setIsValidCategory(false);
            setNewCategory("");
            setOpen(false);
          }}
          width={1000}
        >
          <TextArea
            style={{padding: "10px"}}
            maxLength={100}
            value={newCategory}
            placeholder="New Category..."
            onChange={(e) => {
              setNewCategory(e.target.value);
              if (
                listCategory.find((c) => c.name === e.target.value) ||
                e.target.value === ""
              ) {
                setIsValidCategory(false);
              } else {
                setIsValidCategory(true);
              }
            }}
            
          />
          {!isValidCategory && <p className="py-3 text-yellow-500 font-semibold opacity-70">{newCategory.length == 0 ? "Please give category a name" : "Already exist!"}</p>}
        </Modal>
      </div>
    </>
  );
};

export default CategorySelect;
