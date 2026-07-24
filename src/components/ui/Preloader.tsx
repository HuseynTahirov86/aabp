"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export function Preloader() {
  const t = useTranslations("Index");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("aabp_loaded")) {
      return;
    }
    setIsLoading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 20;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("aabp_loaded", "1");
        }, 400);
      }
      setProgress(Math.floor(current));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-primary text-white"
        >
          <div className="font-serif text-[10vw] font-bold tracking-tighter mix-blend-difference">
            {progress}%
          </div>
          <div className="absolute bottom-10 text-sm tracking-widest uppercase opacity-50">
            {t("title")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
