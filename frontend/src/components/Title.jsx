import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-4 items-center mb-3">
      <div className="flex gap-2">
        <p className="text-green-950 text-2xl md:text-3xl font-medium">{text1}</p>
        <p className="text-black text-2xl md:text-3xl font-medium">{text2}</p>
      </div>
      <p className="w-12 sm:w-16 h-[2px] sm:h-[2px] bg-green-950"></p>
    </div>
  );
};

export default Title;
