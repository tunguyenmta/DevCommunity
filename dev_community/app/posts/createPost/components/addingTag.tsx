/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Flex, Input, Tag, theme, Tooltip } from "antd";

const tagInputStyle: React.CSSProperties = {
  width: 120,
  height: 46,
  marginInlineEnd: 8,
  verticalAlign: "top",
  fontSize: 16,
};

interface AddingTagProps {
  listTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const AddingTag: React.FC<AddingTagProps> = ({ onTagsChange, listTags }) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  useEffect(() => {
    if (listTags.length === 0) return;
    setTags(listTags);
  }, [listTags]);
  useEffect(() => {
    onTagsChange(tags);
  }, [tags]); // Ensure onTagsChange is called whenever tags change

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const handleFocus = () => {
    setIsFocus(true);
  };

  return (
    <div onFocus={handleFocus}>
      <Flex gap="px 0" wrap>
        {tags &&
          tags.map<React.ReactNode>((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable
                style={{
                  userSelect: "none",
                  padding: "12px 16px",
                  fontSize: 16,
                  background: "#FAFAFA",
                  fontWeight: 400,
                }}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      setEditInputIndex(index);
                      setEditInputValue(tag);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return  tagElem;
          })}
        {inputVisible ? (
          <Input
            maxLength={30}
            ref={inputRef}
            type="text"
            size="small"
            style={tagInputStyle}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : tags.length < 4 ? (
          <Tag
            style={{
              padding: "12px 16px",
              fontSize: 16,
              boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.02)",
              background: "white",
              border: "1px dashed #d9d9d9",
            }}
            icon={<PlusOutlined />}
            onClick={showInput}
          >
            New Tag
          </Tag>
        ) : null
        // <Tag
        //   style={{
        //     padding: "12px 16px",
        //     fontSize: 16,
        //     boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.02)",
        //     background: "#f5f5f5",
        //     cursor: "not-allowed",
        //   }}
        // >
        //   Max Tags Reached
        // </Tag>
        }
      </Flex>
      {isFocus && listTags.length === 0 && (
        <p className="text-yellow-500 my-5">Add a captivating tag</p>
      )}
    </div>
  );
};

export default AddingTag;
