import { LoaderCircle } from "lucide-react";
import React from "react";

const LoadingComponent = ({ text }: { text: string }) => {
  return (
    <div className="h-screen w-full flex justify-center items-center gap-2 bg-black/50">
      <LoaderCircle className="animate-spin" />
      <h1>{text}</h1>
    </div>
  );
};

export default LoadingComponent;
