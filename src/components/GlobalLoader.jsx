import React, { useEffect, useState } from "react";
import { loaderState } from "../utils/loaderState";
import { FaGem } from "react-icons/fa";

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return loaderState.subscribe((loading) => {
      setIsLoading(loading);
    });
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Rings */}
        <div className="absolute h-24 w-24 rounded-full border-4 border-[#ff8211]/20 animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute h-20 w-20 rounded-full border-4 border-[#ff8211]/40 border-t-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
        <div className="absolute h-16 w-16 rounded-full border-4 border-[#ff8211] border-l-transparent animate-spin"></div>
        
        {/* Center Logo */}
        <div className="z-10 bg-white p-2 rounded-full shadow-lg">
          <FaGem className="text-[#86ac55] text-2xl animate-pulse" />
        </div>
        
        {/* Text */}
        <div className="mt-16">
           <span className="font-bebas text-2xl text-white tracking-widest animate-pulse">
            LOADING...
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
