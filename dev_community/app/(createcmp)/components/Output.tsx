import React, { useRef, useEffect, useState } from "react";
import { DOCUMENT_TEMPLATES } from "../constants";
import html2canvas from "html2canvas";

const Output: React.FC<Props> = ({ code, activeTab, isClicked, handleScreenShot }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [url, setUrl] = useState<string>("");

    const generateIframeContent = () => {
        const baseStyle = "<style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;}</style>";
        switch (activeTab) {
            case "HTML":
                return baseStyle + DOCUMENT_TEMPLATES.HTML(code);
            case "CSS":
                return baseStyle + DOCUMENT_TEMPLATES.CSS(code);
            case "JavaScript":
                return baseStyle + DOCUMENT_TEMPLATES.JavaScript(code);
            case "TypeScript":
              return baseStyle + DOCUMENT_TEMPLATES.JavaScript(code);
            case "Java":
              return baseStyle + DOCUMENT_TEMPLATES.JavaScript(code);
            case "Database":
              return baseStyle + DOCUMENT_TEMPLATES.JavaScript(code);
            default:
                return baseStyle + DOCUMENT_TEMPLATES.defaultContent();
        }
    };

    useEffect(() => {
        if (isClicked) {
            // takeScreenshot();
        }
    }, [isClicked]);
    const iframeContent = generateIframeContent();

    // const takeScreenshot = async () => {
    //   const iframe = iframeRef.current;
    //   if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document)
    //     return;

    //   const iframeDocument = iframe.contentWindow.document;
    //   iframeDocument.body.style.transform = "scale(2)";
    //   iframeDocument.body.style.transformOrigin = "top left";

    //   // Increase the size of the iframe to make the screenshot bigger
    //   const originalWidth = iframe.offsetWidth;
    //   const originalHeight = iframe.offsetHeight;
    //   iframe.style.width = `${originalWidth * 2}px`;
    //   iframe.style.height = `${originalHeight * 2}px`;

    //   const content = iframeDocument.documentElement;

    //   try {
    //     const response = await fetch("../../api/screenshot", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ content }),
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to take screenshot");
    //     }

    //     const blob = await response.blob();
    //     const reader = new FileReader();
    //     reader.readAsDataURL(blob);
    //     reader.onloadend = function () {
    //       const base64data = reader.result;
    //       handleScreenShot(String(base64data)); // This is the Base64 string
    //     };
    //   } catch (error) {
    //     console.error("Error taking screenshot:", error);
    //   }
    // };
    return (
        <div className="flex w-full justify-center items-center">
            <iframe
                id="output"
                ref={iframeRef}
                className="w-[100%] h-[100%] flex justify-center items-center"
                title="output"
                srcDoc={iframeContent}
            />
        </div>
    );
};

export default Output;
