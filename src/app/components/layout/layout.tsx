"use client";
import React, { useEffect } from "react";
import Header from "../header";
import { useAppSelector } from "@/lib/hook/useStatesHook";

type props = {
  children: any;
};
const Mainlayout = ({ children }: props) => {
  const { theme } = useAppSelector((state) => state.settings);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  return (
    <div className="w-screen min-h-screen h-auto dark:bg-slate-900 dark:text-white">
      <Header />
      <div className="px-10">{children}</div>
    </div>
  );
};

export default Mainlayout;
