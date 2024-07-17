"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import empty from "../../../../public/image/empty.png";
import "./exampleCreate.css";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import edit from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/edit.svg";
import copy from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/copy.svg";
import archive from "../../../../public/asstets/icons/Themes (13)/vuesax/linear/archive.svg";
import ExampleCreator from "./exampleCreator";
import { Modal } from "antd";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./listExample.css";
import { WalletAdd1 } from "iconsax-react";
interface ExampleProps {
  title: string;
  description: string;
  countDayPublished?: number;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  resource: {
    html: string;
    css: string;
    javascript: string;
    typescript: string;
    java: string;
    database: string;
  };
  sourceCode: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  video: string;
  tempId?: number;
}

interface ListExampleProps {
  list: ExampleProps[];
  handleAddExample: (examples: ExampleProps[]) => void;
}
interface ExampleTempProps {
  example: ExampleProps; // Changed from 'ExampleProps' to 'example'
  tempId: number;
}
const ListExample: React.FC<ListExampleProps> = ({
  list,
  handleAddExample,
}) => {
  const [textToArchive, setTextToArchive] = useState<string>("");
  const [listExampleTemp, setListExampleTemp] = useState<ExampleTempProps[]>(
    list.map((item, ind) => {
      return {
        example: item,
        tempId: ind + 1,
      };
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [listCurrentTitle, setListCurrentTitle] = useState<string[]>([]);
  const [listExample, setListExample] = useState<ExampleProps[]>(list);
  const [isExampleCreatorOpen, setIsExampleCreatorOpen] = useState(false);
  const toggleExampleCreator = () => {
    setIsExampleCreatorOpen(!isExampleCreatorOpen);
  };
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null); // This will store the `tempId` of the active menu

  const toggleMenu = (tempId: number) => {
    if (activeMenuId === tempId) {
      setActiveMenuId(null); // Close the menu if it's already open
    } else {
      setActiveMenuId(tempId); // Open the menu by setting its `tempId`
    }
  };

  const handleOpenModal = (example: ExampleProps, tempId?: number) => {
    // Implementation to open modal
    setOpen(true);
    toggleExampleCreator();
    setInitialExampleData({ ...example, tempId: tempId });
    setActiveMenuId(null); // Optionally close any open menus when opening a modal
  };

  const [initialExampleData, setInitialExampleData] = useState<ExampleProps>({
    title: "",
    description: "",
    cover: {
      path: "",
      mediaType: "",
      originalName: "",
    },
    resource: {
      html: "",
      css: "",
      javascript: "",
      typescript: "",
      java: "",
      database: "",
    },
    sourceCode: {
      path: "",
      mediaType: "",
      originalName: "",
    },
    video: "",
  });

  useEffect(() => {
    setListExampleTemp(
      list.map((item, ind) => {
        return {
          example: item,
          tempId: ind + 1,
        };
      })
    );
    setListCurrentTitle(list.map((item) => item.title));
  }, [listExample, list]);

  const handleDuplicateExample = (tempId: number) => {
    const exampleToDuplicate = listExampleTemp.find(
      (example) => example.tempId === tempId
    );
    if (exampleToDuplicate) {
      // Generate a new unique tempId
      const newTempId = getNextTempId();

      // Clone the example with a new tempId
      let duplicatedExample: ExampleTempProps = {
        ...exampleToDuplicate,
        tempId: newTempId,
      };

      // Ensure the name is unique by appending a suffix if necessary
      const baseName = duplicatedExample.example.title;
      let uniqueName = baseName;
      let counter = 1;

      // Check if the name already exists in the list
      while (listExample.find((example) => example.title === uniqueName)) {
        uniqueName = `${baseName} (${counter})`;
        counter++;
      }

      // Update the name of the duplicated example to ensure it's unique
      duplicatedExample = {
        ...duplicatedExample,
        example: {
          ...duplicatedExample.example,
          title: uniqueName,
        },
      };

      // Add the duplicated example to the list
      handleAddExample([...listExample, duplicatedExample.example]);
      setListExample([...listExample, duplicatedExample.example]);
    }
  };

  const handleArchiveExample = (tempId: number) => {
    const exampleToArchive = listExampleTemp.find(
      (example) => example.tempId === tempId
    );
    if (exampleToArchive) {
      const updatedList = listExampleTemp.filter(
        (example) => example.tempId !== tempId
      );
      setListExample(updatedList.map((item) => item.example));
      handleAddExample(updatedList.map((item) => item.example));
    }
  };

  const getNextTempId = () => {
    return (
      Math.max(
        0,
        ...listExampleTemp
          .map((example) => example.tempId)
          .filter((tempId) => tempId !== undefined)
      ) + 1
    );
  };

  const handleAddingExample = (example: ExampleProps) => {
    if (!example.tempId) {
      setListExample([...listExample, example]);
      handleAddExample([...listExample, example]);
    } else {
      const updatedList = listExampleTemp.map((item) => {
        if (item.tempId === example.tempId) {
          const { tempId, ...rest } = example;
          return rest; // tempId is omitted, effectively making it undefined
        }
        return item.example; // No change for items not being updated
      });
      setListExample(updatedList);
      handleAddExample(updatedList);
    }
    toggleExampleCreator();
  };

  return (
    <>
      <div className="flex justify-between pb-5">
        <h1 className="font-semibold text-[25px] leading-[30px]">Example</h1>
        {listExampleTemp.length > 0 && (
          <button
            onClick={() => {
              setInitialExampleData({
                title: "",
                description: "",
                cover: {
                  path: "",
                  mediaType: "",
                  originalName: "",
                },
                resource: {
                  html: "",
                  css: "",
                  javascript: "",
                  typescript: "",
                  java: "",
                  database: "",
                },
                sourceCode: {
                  path: "",
                  mediaType: "",
                  originalName: "",
                },
                video: "",
              });
              toggleExampleCreator();
            }}
            className="flex items-center px-4 py-2 rounded-[8px] text-blue3 gap-4 bg-white border border-blue-500 hover:bg-blue3 hover:text-white transition-all ease-in"
          >
            <WalletAdd1 /> Add example
          </button>
        )}
      </div>
      <div id="example-creator" className="bg-white rounded-[12px] relative">
        {isExampleCreatorOpen && (
          <ExampleCreator
            listCurrentTitle={listCurrentTitle}
            example={initialExampleData}
            handleAddExample={handleAddingExample}
            hanldeOpen={toggleExampleCreator}
            open={isExampleCreatorOpen}
          />
        )}
        {listExampleTemp.length == 0 ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <div>
              <Image src={empty} alt="empty"></Image>
              <div className="flex justify-center">
                <button
                  onClick={toggleExampleCreator}
                  className="rounded-[8px] bg-blue3 text-white font-semibold px-4 py-3"
                >
                  Create Example
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 p-5 min-h-[500px]">
            {listExampleTemp.map((item) => (
              <div
                key={item.tempId}
                className="w-[30%] bg-[#F7F9FB] rounded-[12px] max-h-[500px] relative"
              >
                <div className="p-4 w-full flex justify-center h-[400px]">
                  {/* <img
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${item.example.cover.path}`}
                    alt={item.example.title}
                    className="w-full h-full object-cover"
                  /> */}
                  <div className="flex justify-center items-center min-w-[400px]">
                    <div className="w-[90%] h-[100%]">
                      <iframe
                        srcDoc={`<html><head><style>${item.example.resource.css}
                          </style></head><body style="height: 90vh; display: flex; justify-content: center; align-items: center">${item.example.resource.html}<script>${item.example.resource.javascript}</script></body></html>`}
                        className="w-full h-full "
                      ></iframe>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="w-[50%]">
                    <h3 className="font-semibold">{item.example.title}</h3>
                  </div>
                  <button onClick={() => toggleMenu(item.tempId)}>
                    <PiDotsThreeOutlineLight />
                  </button>
                  {activeMenuId === item.tempId && (
                    <div className="border-[1px] shadow-searchBox p-2 min-w-[190px] min-h-[170px] absolute -bottom-[100px] -right-[220px] bg-white rounded-[8px] shadow-[0px 4px 8px 0px #00000040] z-50">
                      <div
                        className="flex items-center gap-5 p-3 cursor-pointer transition duration-500 ease-in-out"
                        onClick={() =>
                          handleOpenModal(item.example, item.tempId)
                        }
                      >
                        <Image src={edit} alt="edit example"></Image>
                        Edit example
                      </div>
                      <div
                        onClick={() => {
                          setActiveMenuId(null);
                          handleDuplicateExample(item.tempId);
                        }}
                        className="flex items-center gap-5 p-3 border-b-[1px] cursor-pointer transition duration-500 ease-in-out"
                      >
                        <Image src={copy} alt="duplicate example"></Image>
                        Duplicate
                      </div>
                      <div
                        onClick={() => {
                          showModal();
                        }}
                        className="flex items-center gap-5 p-3 cursor-pointer "
                      >
                        <Image src={archive} alt="archive example"></Image>
                        Archive
                      </div>
                      <Modal
                        className="archive-modal"
                        title="Archive example"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                      >
                        <p className="pb-5">
                          Archiving this example will immediately remove it from
                          your Dashboard.
                        </p>
                        <h2 className="font-semibold">I understand that:</h2>
                        <div className="flex items-center gap-2">
                          <AiOutlineCloseCircle />
                          <p>My example will be unpublished</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AiOutlineCloseCircle />
                          <p>
                            Everyone in the Workspace will lose access to this
                            example
                          </p>
                        </div>
                        <div>
                          <p className="pt-5">
                            Confirm by typing{" "}
                            <span className="text-blue3">archive</span> below.
                          </p>
                          <input
                            value={textToArchive}
                            onChange={(e) => setTextToArchive(e.target.value)}
                            placeholder="archive"
                            type="text"
                            className="border-[1px] border-[#DCDCDC] rounded-[8px] w-full py-2 px-4 mt-2"
                          />
                        </div>
                        <div className="flex justify-end gap-5 pt-4">
                          <button className="bg-[#F4F4F4] rounded-[8px] font-semibold px-4 border-[1px] py-2">
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleArchiveExample(item.tempId);
                              setIsModalOpen(false);
                              setActiveMenuId(null);
                            }}
                            disabled={textToArchive == "archive" ? false : true}
                            className={`font-semibold px-4 border-[1px] py-2 rounded-[8px] ${textToArchive != "archive"
                              ? "bg-[#DCDCDC] opacity-70"
                              : "bg-red1 text-white"
                              }`}
                          >
                            Archive Example
                          </button>
                        </div>
                      </Modal>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-[200px]"></div>
    </>
  );
};

export default ListExample;
