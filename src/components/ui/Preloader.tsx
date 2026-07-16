"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
      setProgress(Math.floor(currentProgress));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-primary text-white"
        >
          <div className="font-serif text-[10vw] font-bold tracking-tighter mix-blend-difference">
            {progress}%
          </div>
          <div className="absolute bottom-10 text-sm tracking-widest uppercase opacity-50">
            Association of Azerbaijani British Professionals
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
