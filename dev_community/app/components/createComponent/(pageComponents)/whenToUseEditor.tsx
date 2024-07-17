/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Input } from "antd";
import "./descriptionEditor.css";

interface WhenToUseProps {
  content: string;
  handleChangeContent: (value: string) => void;
  textGoal?: { text: string; count: number };
  initialContent?: string;
}
interface QuillInstance {
  getText: () => string;
  getBounds: (index: number) => { top: number };
}

const { TextArea } = Input;

const WhenToUseEditor: React.FC<WhenToUseProps> = ({
  initialContent,
  content,
  handleChangeContent,
  textGoal,
}) => {
  const [hasFocusedEditor, setHasFocusedEditor] = useState(false);
  const handleChangeContentRef = useRef(handleChangeContent);

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          ["link", "image", "video", "formula"],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ header: [1, 2, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ["customInsertCode"], // Add custom button for code insertion
        ],
        handlers: {
          customInsertCode: () => {
            if (quill) {
              const code = prompt("Enter the code you want to embed:");
              if (code) {
                const range = quill.getSelection();
                if (range) {
                  quill.insertEmbed(range.index, "code-block", code);
                }
              }
            }
          },
        },
        containerClass: "custom-toolbar", // Add a custom class to the toolbar container
      },
      blotFormatter: {},
    },
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
      "formula",
      "list",
      "bullet",
      "check",
      "script",
      "indent",
      "direction",
      "header",
      "color",
      "background",
      "align",
    ],
    theme: "snow",
  });

  // useEffect(() => {
  //   if (quill) {
  //     quill.on("text-change", () => {
  //       const html = quill.root.innerHTML;
  //       handleChangeContent(html);
  //     });
  //   }
  // }, [quill]);
  useEffect(() => {
    handleChangeContentRef.current = handleChangeContent;
  }, [handleChangeContent]);
  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const html = quill.root.innerHTML;
        handleChangeContentRef.current(html); // Use ref's current value
      };
  
      quill.on("text-change", handleTextChange);
  
      // Cleanup function to remove the event listener
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, content]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const Quill = require("quill");
      const styleImage = require("@/app/utils/styleImage").default;
      Quill.register({ "formats/image": styleImage }, true);

      const BlotFormatter = require("quill-blot-formatter").default;
      Quill.register("modules/blotFormatter", BlotFormatter);
    }
  }, []);
  useEffect(() => {
    if (quill && initialContent) {
      // Safely setting HTML content inside the editor
      quill.root.innerHTML = initialContent;
    }
  }, [quill, initialContent]); // Depend on `quill` and `content` to update the editor correctly

   
  useEffect(() => {
    if (quill) {
      const handlePaste = async (event: ClipboardEvent) => {
        event.preventDefault();  // Prevent the default paste action for all content types
        const clipboardData = event.clipboardData;
        if (clipboardData) {
          const items = Array.from(clipboardData.items);
          items.forEach((item) => {
            if (item.type.startsWith('image')) {
              const file = item.getAsFile();
              if (file) {
                saveToServer(file); // Directly upload the file
              }
            } else if (item.type === 'text/plain') {
              item.getAsString((text: string) => {
                const range = quill.getSelection(true);
                if (range) {
                  quill.insertText(range.index, text, 'user');
                  setTimeout(() => {
                    quill.setSelection({ index: range.index + text.length, length: 0 });
                  }, 0);
                }
              });
            }
          });
        }
      };
      
      
      quill.root.addEventListener('paste', handlePaste);
  
      return () => {
        quill.root.removeEventListener('paste', handlePaste);
      };
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      quill.root.style.fontFamily = "Inter, sans-serif";
    }
  }, [quill]);

  const insertToEditor = (url: string) => {
    const range = quill?.getSelection();
    if (range && quill) {
      quill.insertEmbed(range.index, "image", url);
    }
  };

  const saveToServer = async (file: Blob) => {
    const body = new FormData();
    body.append("files", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/media/upload`, {
      method: "POST",
      body,
    });
    if (res.ok) {
      const data = await res.json();
      const imageUrl = `${process.env.NEXT_PUBLIC_BASE_IMG_URL}${data[0].path}`;
      insertToEditor(imageUrl);
    }
  };

  const selectLocalImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        saveToServer(file);
      }
    };
  };

  useEffect(() => {
    if (quill) {
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quill]);

  const handleFocusEditor = () => {
    setHasFocusedEditor(true);
  };

  const scrollToText = (text: string, occurrence: number = 1) => {
    if (quill) {
      const textContent = quill?.getText();
      let textIndex = -1;

      for (let i = 0; i < occurrence; i++) {
        textIndex = textContent?.indexOf(text, textIndex + 1);
        if (textIndex === -1) break;
      }

      if (textIndex !== -1) {
        const textPosition = quill.getBounds(textIndex);
        const editorContainer = document.querySelector(".ql-editor");
        if (editorContainer) {
          editorContainer.scrollTop = textPosition.top;
          window.scrollTo({
            top: textPosition.top,
            behavior: "smooth",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (textGoal) {
      scrollToText(textGoal.text, textGoal.count);
    }
  }, [textGoal]);
  return (
    <>
      {" "}
      <h1 className="font-semibold py-4">When To Use <span className="text-red1">*</span></h1>
      <div id="component-description">
        <div ref={quillRef} onFocus={handleFocusEditor} />
        {hasFocusedEditor &&
          (content.trim() === "" || content === "<p><br></p>") && (
            <p className="opacity-50 text-yellow-500 py-3 text-[18px]">
              Please write something!
            </p>
          )}
      </div>
    </>
  );
};

export default WhenToUseEditor;
