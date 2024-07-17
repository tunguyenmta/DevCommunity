"use client";
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
const { TextArea } = Input;
interface TitleProps {
  initialTitle?: string;
  title: string;
  setTitle: (title: string) => void;
  handleIsValidateTitle: (isValidateTitle: boolean) => void;
}
const TitleInput: React.FC<TitleProps> = ({ title, setTitle, initialTitle, handleIsValidateTitle }) => {
  const [listTitle, setListTitle] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isValidTitle, setIsValidTitle] = useState<boolean>(false);
  const { userToken } = useAppContext()
  const fetchTitle = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/components/names`,
      {
        headers: {
          "Cache-Control": "no-store",
          Authorization: "Bearer " + userToken,
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch title");
    }
    const data: string[] = await res.json();

    let invalidTitle
    if (initialTitle) {
      invalidTitle = [...data].filter((item) => item != initialTitle)

    } else {
      invalidTitle = data
    }

    setListTitle(invalidTitle);
  };

  useEffect(() => {
    fetchTitle();
  }, [])
  useEffect(() => {
    if (initialTitle) {
      fetchTitle();
      setTitle(initialTitle);
      setIsValidTitle(true);
      handleIsValidateTitle(true);
    }
  }, [initialTitle])

  return (
    <>
      <div id="titlecomponent-input" onClick={() => setIsFocus(true)}>
        <h1 className="font-semibold py-4 text-[#292929]">
          Component title <span className="text-red1">*</span>
        </h1>
        <TextArea
          style={{ padding: "10px", fontSize: "16px" }}
          value={title}
          maxLength={150}
          onChange={(e) => {
            setTitle(e.target.value);
            if (listTitle.includes(e.target.value) || e.target.value == "") {
              setIsValidTitle(false);
              handleIsValidateTitle(false);
            } else {
              setIsValidTitle(true);
              handleIsValidateTitle(true);
            }
          }}
          className="custom-textarea"
          placeholder="Give your component a title"
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        {isFocus && !isValidTitle && (
          <p className="text-yellow-500 text-[18px] opacity-50 pt-4">
            {title.length == 0 ? "Give your component a title" : "Title already exists"}
          </p>
        )}
      </div>
    </>
  );
};

export default TitleInput;
