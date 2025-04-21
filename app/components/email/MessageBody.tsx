import React from 'react';

interface MessageBodyProps {
  text: string;
}

export const MessageBody: React.FC<MessageBodyProps> = ({ text }) => {
  if (!text) return null;
  
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs and format each part
  const parts = text.split(urlPattern);
  
  return (
    <div className="prose prose-gray max-w-none">
      {parts.map((part, index) => {
        if (part.match(urlPattern)) {
          // If it's a URL, create a clickable link
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {part}
            </a>
          );
        }
        // If it's not a URL, return the text as is
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}; 