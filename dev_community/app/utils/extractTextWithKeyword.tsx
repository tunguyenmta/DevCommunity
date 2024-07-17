import React from 'react';

interface ExtractTextProps {
  htmlContent: string;
  keyword: string;
}

const ExtractTextSnippetAndHighlight: React.FC<ExtractTextProps> = ({ htmlContent, keyword }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const textContent = doc.body.textContent || "";

  if (keyword.trim() === '') {
    return <span>{textContent.length > 100 ? textContent.slice(0,100)+ '...' : textContent}</span>;
  }
  const keywordIndex = textContent.toLowerCase().indexOf(keyword.toLowerCase());
  if (keywordIndex === -1) {
    return null;
  }

  // Calculate the snippet boundaries
  const start = Math.max(0, keywordIndex - 50);
  const end = Math.min(textContent.length, keywordIndex + 50 + keyword.length);

  // Extract the snippet
  const snippet = textContent.slice(start, end);

  // Split the snippet into parts by keyword
  const parts = snippet.split(new RegExp(`(${keyword})`, 'gi'));

  return (
    <span className='break-words'>
      {parts.map((part, index) => (
        // Check if the part is a keyword
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className='bg-yellow1 rounded-[4px] px-[2px]'>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      ))}
    </span>
  );
}

export default ExtractTextSnippetAndHighlight;
