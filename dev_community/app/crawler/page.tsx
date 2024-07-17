'use client';
import React, { useEffect, useState } from 'react';
function extractHref(htmlString: string): string | null {
    // Use DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    // Query the document for the anchor element and retrieve the href attribute
    const href = doc.querySelector('a')?.getAttribute('href') || "";
    return href;
  }
  
const ScrapeComponent = () => {
  const [scrapedData, setScrapedData] = useState<string[]>([]); 
  const [contentData, setContentData] = useState<string[]>([])


  useEffect(() => {
    const fetchData = async () => {
        let tempData:string[] = [];
        for(let i = 1; i <= 1; i++) {
            const response = await fetch(`/api/crawler?page=${i}`, {
                headers: {
                    'Cache-Control': 'no-store'
                  },
                  cache: 'no-store'
            });
            const data = await response.json();
            tempData.push(data.data);
        }
        let tempDataString : string[] = []
        tempData.forEach(element => {
            element.split(',').forEach(e => {
                let url = extractHref(e);
                if(url) {
                    tempDataString.push(url);
                }
            })
        })
        setScrapedData(tempDataString);

    };

    fetchData().catch(console.error);
  }, []);
  useEffect(() => {
    if(scrapedData.length === 0) return;
    let temp :string[] = []
    scrapedData.forEach(async (url) => {
        const response = await fetch(`/api/crawlerContent?article=${url}`,  {
            headers: {
                'Cache-Control': 'no-store'
              },
              cache: 'no-store'
        });
        const data = await response.json();
        if(data){
            console.log(data.data)
            temp.push(data.data);
        }
        console.log(data.data)
  
    })
    setContentData(temp);

  }, [scrapedData]); 
  useEffect(()=>{
    console.log(contentData)
  }, [contentData, scrapedData])
  return (
    <div>
      <h1>Scraped Content</h1>
      <p>{scrapedData}</p>
      {contentData.length > 0 && contentData.map((data, index) => {
            return <p key={index} dangerouslySetInnerHTML={{__html: data}}></p>
      })}
    </div>
  );
};

export default ScrapeComponent;