import React from "react";

interface TruncateProps {
  text: string;
  maxLength: number;
}

function truncateString(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.substring(0, maxLength) + "...";
    }
}


const Truncate: React.FC<TruncateProps> = ({ text, maxLength }) => {
  const truncatedText = truncateString(text, maxLength);

  return <>{truncatedText}</>;
};

export default Truncate;
