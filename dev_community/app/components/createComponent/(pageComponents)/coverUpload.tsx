"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, RcFile } from "antd/lib/upload/interface";
import "./coverUpload.css";

interface Cover {
  file: UploadFile[];
  image?: string; // This can be a URL or a base64 string
}

interface CoverUploadProps {
  onCoverChange: (cover: Cover) => void;
  initialCover?: string; // This should be a URL to the initial image
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CoverUpload: React.FC<CoverUploadProps> = ({
  onCoverChange,
  initialCover,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(initialCover || "");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const normalizeUrl = (url: string): string => {
    return url.startsWith(process.env.NEXT_PUBLIC_BASE_IMG_URL as string)
      ? url
      : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${url}`;
  };

  useEffect(() => {
    if (initialCover) {
      setFileList([
        {
          uid: "-1",
          name: "image.jpg",
          status: "done",
          url: normalizeUrl(initialCover),
        },
      ]);
    }
  }, [initialCover]);
  useEffect(() => {
    if (initialCover) {
      const normalizedCover = initialCover.startsWith(
        process.env.NEXT_PUBLIC_BASE_IMG_URL as string
      )
        ? initialCover
        : `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${initialCover}`;
      setFileList([
        { uid: "-1", name: "image.jpg", status: "done", url: normalizedCover },
      ]);
    }
  }, [initialCover]);

  const beforeUpload = (file: RcFile): boolean => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.preview || file.url || "");
    setPreviewOpen(true);
  };

  const handleChange = async ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    // Check each file's URL to ensure it's normalized and not duplicated
    const updatedFileList = newFileList.map((file) => ({
      ...file,
      url: file.url ? normalizeUrl(file.url) : file.url,
    }));

    const validFileList = updatedFileList.filter(file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            return isJpgOrPng && file.status !== 'error';
          });

    setFileList(validFileList);
    if (validFileList.length > 0) {
      const latestFile = validFileList[0];
      if (!latestFile.url && latestFile.originFileObj) {
        const base64 = await getBase64(latestFile.originFileObj as RcFile);
        setPreviewImage(base64);
        onCoverChange({ file: validFileList, image: base64 });
      }
    } else {
      onCoverChange({ file: [] });
      setPreviewImage("");
    }
  };
  const uploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div>Add cover component</div>
    </div>
  );

  return (
    <>
    <h1 className="font-semibold text-black text-base leading-5">Cover image</h1>
    <p className="text-disable pb-4 text-base font-normal leading-5">Image upload format supports JPEG, JPG, PNG</p>
      <div className="cover-upload" onClick={() => {
        setPreviewOpen(false)}}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: setPreviewOpen,
            src: previewImage,
          }}
        />
      </div>
    </>
  );
};

export default CoverUpload;
