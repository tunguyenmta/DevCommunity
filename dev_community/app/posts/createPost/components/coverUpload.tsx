/* eslint-disable jsx-a11y/alt-text */

// "use client";
// import React, { useEffect, useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Image, Upload } from 'antd';
// import type { GetProp, UploadFile, UploadProps } from 'antd';
// import './coverUpload.css';
// import { message } from 'antd';

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

// interface ImageObject {
//   path: string;
//   mediaType: string;
//   originalName: string;
// }

// interface Cover {
//   file: UploadFile[];
//   image?: ImageObject; // Optional property to include initial cover image
// }

// interface CoverUploadProps {
//   onCoverChange: (cover: Cover) => void;
//   initialCover?: ImageObject; // Optional initial cover image
// }

// const getBase64 = (file: FileType): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// const CoverUpload: React.FC<CoverUploadProps> = ({ onCoverChange, initialCover }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [attemptedUpload, setAttemptedUpload] = useState(false);

//   useEffect(() => {
//     if (initialCover && initialCover.path) {
//       setPreviewImage(`${initialCover.path}`);
//       setFileList([{ uid: '-1', name: initialCover.originalName, status: 'done', url: !initialCover.path.startsWith('http') ? `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${initialCover.path}` : initialCover.path }]);
//     } else {
//       return
//     }
//   }, [initialCover]);

//   const beforeUpload: UploadProps['beforeUpload'] = (file) => {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//       message.error('You can only upload JPG/PNG file!');
//     }
//     return isJpgOrPng;
//   };

//   const handleUploadClick = () => {
//     setAttemptedUpload(true);
//   };

//   const handlePreview = async (file: UploadFile) => {
//     console.log(file)
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as FileType);
//     }

//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//   };
//   useEffect(()=>{
//     console.log(previewImage)

//   }, [previewImage])

//   const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
//     console.log(fileList)
//     const validFileList = newFileList.filter(file => {
//       const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//       return isJpgOrPng && file.status !== 'error';
//     });

//     setFileList(validFileList);
//     if (validFileList.length > 0) {
//       const latestFile = validFileList[0];
//       console.log(latestFile)
//       const cover: Cover = {
//         file: [latestFile],
//       };
//       onCoverChange(cover);
//       const base64 = await getBase64(latestFile.originFileObj as FileType);
//       setPreviewImage(base64);
//     } else {
//       onCoverChange({ file: [] });
//       setPreviewImage('');
//     }
//   };

//   const uploadButton = (
//     <button className='flex items-center justify-center' type="button">
//       <PlusOutlined className='w-[24px] h-[24px] text-black'/>
//       <div className='text-[rgba(0,0,0,.45)] font-normal text-[16px] leading-[19px]'>Add cover post</div>
//     </button>
//   );

//   return (
//     <div className='cover-upload' onClick={handleUploadClick}>
//       <Upload
//         listType="picture-card"
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//         beforeUpload={beforeUpload}
//       >
//         {fileList.length >= 1 ? null : uploadButton}
//       </Upload>
//       {attemptedUpload && fileList.length === 0 && <p className='text-yellow-500 my-5'>Please upload an image!</p>}
//       {previewImage && (
//         <Image
//           wrapperStyle={{ display: 'none' }}
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(''),
//           }}
//           src={previewImage}
//         />
//       )}
//     </div>
//   );
// };

// export default CoverUpload;
"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, RcFile } from "antd/lib/upload/interface";
import "./coverUpload.css";

let listValidType = [".jpeg", ".jpe", ".gif", ".bmp", ".png", ".jpg", ".ico", ".jfif"]
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

  const [attemptedUpload, setAttemptedUpload] = useState(false);
  const handleUploadClick = () => {
    setAttemptedUpload(true);
  };
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
          name: "image",
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
    const isJpgOrPng =  listValidType.filter(d=> file.name.includes(d)).length > 0 
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG or GIF file!");
    }
    return isJpgOrPng;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && (listValidType.filter(d=> file.name.includes(d)).length > 0 )) {
      console.log('test')
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
    const updatedFileList = newFileList.map((file) => ({
      ...file,
      url: file.url ? normalizeUrl(file.url) : file.url,
    }));

    const validFileList = updatedFileList.filter(file => {
            const isJpgOrPng = listValidType.filter(d=> file.name.includes(d)).length > 0 ;
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
      <div>Add cover post</div>
    </div>
  );

  return (
    <div
      className="cover-upload"
      onClick={() => {
        handleUploadClick();
        setPreviewOpen(false);
      }}
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {attemptedUpload && fileList.length === 0 && (
        <p className="text-yellow-500 my-5">Add a captivating cover image</p>
      )}
      <Image
        preview={{
          visible: previewOpen,
          onVisibleChange: setPreviewOpen,
          src: previewImage,
        }}
      />
    </div>
  );
};

export default CoverUpload;
