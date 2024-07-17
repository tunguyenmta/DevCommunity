"use client";
import React, { useState, useEffect, HtmlHTMLAttributes } from "react";
import { Input } from "antd";
import { useAppContext } from "@/app/utils/contextProvider";
const { TextArea } = Input;
interface TitleProps {
  listCurrentTitle: string[];
  title: string;
  setTitle: (title: string) => void;
  handleSetIsValidTitle: (value: boolean) => void;
}
const TitleInput: React.FC<TitleProps> = ({
  title,
  setTitle,
  handleSetIsValidTitle,
  listCurrentTitle,
}) => {
  const {userToken} = useAppContext()
  const [isValidTitle, setIsValidTitle] = useState<boolean>(title == "" ? false : true);
  const [listTitle, setListTitle] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const fetchTitle = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/admin/examples/names`,
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
    const data:string[] = await res.json();
    if([...data.filter(item=>item != title), ...listCurrentTitle.filter(item=>item != title)].find(item=>item == title)){
      setIsValidTitle(false)
    }
    setListTitle([...data, ...listCurrentTitle.filter(item=>item != title)]);
  };
  useEffect(() => {
    fetchTitle();
  }, []);
  return (
    <>
      <div id="titlecomponent-input" onClick={() => setIsFocus(true)}>
        <h1 className="font-semibold py-4 text-[#292929]">
          Example title <span className="text-red1">*</span>
        </h1>
        <TextArea
          value={title}
          maxLength={150}
          onChange={(e) => {
            setTitle(e.target.value)
            if(listTitle.includes(e.target.value) || e.target.value === ""){
              setIsValidTitle(false)
              handleSetIsValidTitle(false)
            } else {
              setIsValidTitle(true)
              handleSetIsValidTitle(true)
            }
          }}
          className="custom-textarea"
          placeholder="Give your component a title"
          autoSize
          style={{ padding: "10px", fontSize: "16px"}}
        />
        {isFocus && !isValidTitle && (
          <p className="text-yellow-500 text-[18px] opacity-50 pt-4">
            {title.length == 0 ? "Please add title!" : "Already exist!"} 
          </p>
        )}
      </div>
    </>
  );
};

export default TitleInput;
