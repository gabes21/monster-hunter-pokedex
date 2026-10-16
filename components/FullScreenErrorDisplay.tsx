import React from "react";

const FullScreenErrorDisplay = ({ text }: { text: string }) => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <h1>{text}</h1>
    </div>
  );
};

export default FullScreenErrorDisplay;
