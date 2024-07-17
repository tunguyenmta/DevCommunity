import React, { useEffect, useState, useRef } from 'react';
import { DOCUMENT_TEMPLATES } from '../constants';

const Output: React.FC<PropsCmp> = ({ code, activeTab }) => {
    const [iframeHeight, setIframeHeight] = useState<string>('350px');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const calculateIframeHeight = (height: number): string => {
            if (height > 350) {
                return '600px';
            } else if (height > 500) {
                return '700px';
            } else {
                return '350px';
            }
        };

        const handleIframeMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'iframeHeight') {
                const newHeight = event.data.height;
                const calculatedHeight = calculateIframeHeight(newHeight);
                setIframeHeight(calculatedHeight);
            }
        };

        window.addEventListener('message', handleIframeMessage);
        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    }, []);

    useEffect(() => {
        const content = DOCUMENT_TEMPLATES[activeTab] ? DOCUMENT_TEMPLATES[activeTab](code) : DOCUMENT_TEMPLATES.defaultContent();
        const iframe = iframeRef.current;

        if (iframe) {
            const document = iframe.contentDocument || iframe.contentWindow?.document;
            if (document) {
                document.open();
                document.write(`
                
                            <style>
                                body { margin: 0; }
                                .content {
                                    position: relative;
                                    width: 100%;
                                    height: 100vh;
                                    overflow: hidden;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    padding: 25px 0;
                                }
                            </style>
                            <script>
                                function postHeight() {
                                    const height = document.querySelector('.content')?.scrollHeight || 0;
                                    window.parent.postMessage({ type: 'iframeHeight', height }, '*');
                                }
                                window.onload = postHeight;
                                window.onresize = postHeight;
                            </script>
                        <body>
                            <div class="content">
                                ${content}
                            </div>
                        </body>
                `);
                document.close();
            }
        }
    }, [code, activeTab]);

    return (
        <div className='w-full'>
            <iframe
                ref={iframeRef}
                title="output"
                style={{ border: 'none', width: '100%', height: iframeHeight }}
            />
        </div>
    );
};

export default Output;
