"use client";
import React, { useState, useEffect } from "react";
import { Upload, message, Button } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { GrDocumentZip } from "react-icons/gr";

import type {
  UploadProps,
  RcFile,
  UploadFile,
} from "antd/lib/upload/interface";
import "./sourceUpload.css";

interface Cover {
  file: UploadFile[];
}

interface CoverUploadProps {
  initialCover?: {path: string, originalName: string, mediaType: string};
  onCoverChange: (cover: Cover) => void;
}

const CoverUpload: React.FC<CoverUploadProps> = ({ initialCover, onCoverChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const normalizeUrl = (url: string): string => {
    return url.startsWith(process.env.NEXT_PUBLIC_BASE_IMG_URL as string)
      ? url
      : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${url}`;
  };
 
  useEffect(() => {
    if (initialCover && initialCover.path) {
      const normalizedCover = initialCover.path.startsWith(process.env.NEXT_PUBLIC_BASE_IMG_URL as string)
        ? initialCover.path
        : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${initialCover.path}`;
      setFileList([
        { uid: "-1", name: `${initialCover.originalName}.zip`, status: "done", url: normalizedCover },
      ]);
      setUploadDisabled(true); // Disable upload when initialCover is set
    } else {
      setUploadDisabled(false); // Enable upload if there is no initialCover
    }
  }, [initialCover]);
  
  const beforeUpload = (file: RcFile): boolean => {
    const isZip = file.type === "application/zip" || file.name.toLocaleLowerCase().endsWith('.zip') || file.name.toLocaleLowerCase().endsWith('.7z') || file.name.toLocaleLowerCase().endsWith('.rar');
    if (!isZip || file.size/(1024*1024) > 10) {
      message.error("File must be a .zip file and less than 10MB!");
      return false;
    }
    return true;
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
     // Keep only the last file if multiple files are selected
  if (newFileList.length > 1) {
    newFileList = [newFileList[newFileList.length - 1]];
  }

  // Filter out invalid files based on the beforeUpload criteria
  let validFiles = newFileList.filter(file => beforeUpload(file as RcFile));

  // Update state only with valid files
  setFileList(validFiles);
  setUploadDisabled(validFiles.length > 0);
  onCoverChange({ file: validFiles });
  };

  const handleRemove = () => {
    setFileList([]);
    setUploadDisabled(false);
    onCoverChange({ file: [] });
  };

  return (
    <>
      <h1 className="font-semibold text-black text-base leading-5">Upload ZIP File</h1>
      <p className="text-disable pb-4 text-base font-normal leading-5">Supported file types: .bzip, .rar, .zip</p>
      <Upload.Dragger
        name="file"
        multiple={false}
        fileList={fileList}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
        accept=".zip"
        disabled={uploadDisabled}
        style={{ padding: "20px", width: "400px" }}
      >
        {fileList.length > 0 ? (
          <div className="uploaded-file-info">
            <h2>Uploaded File:</h2>
            <p className="flex justify-center">
              <GrDocumentZip  className="text-[30px]"/>
            </p>
            <p>{fileList[0].name}</p>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              Remove File
            </Button>
          </div>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibit from uploading
              company data or other band files
            </p>
          </>
        )}
      </Upload.Dragger>
    </>
  );
};

export default CoverUpload;
