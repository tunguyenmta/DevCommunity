"use client";
import React from "react";
import { Input } from "antd";
const { TextArea } = Input;
interface TitleProps {
  url: string;
  setUrl: (title: string) => void;
}
const VideoInput: React.FC<TitleProps> = ({ url, setUrl }) => {
  return (
    <>
      <div id="titlecomponent-input">
        <h1 className="font-semibold py-4 text-[#292929]">Tutorial video</h1>
        <TextArea
        maxLength={150}
        style={{padding: "10px", fontSize: "16px"}}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="custom-textarea"
          placeholder="eg. https://www.youtube.com/watch?v=WAxxf"
          autoSize
        />

      </div>
    </>
  );
};

export default VideoInput;
