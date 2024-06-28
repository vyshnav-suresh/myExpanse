"use client";

import Image from "next/image";
import { useState } from "react";
import PDFTextExtractor from "../components/pdfhei";
import Mainlayout from "../components/layout/layout";

export default function Home() {
  return (
    <div className="w-full min-h-[300px] h-full flex flex-col justify-center items-center ">
      <PDFTextExtractor />
    </div>
  );
}
// <div className="container justify-center gap-5  flex items-center  mx-auto mt-10 w-screen h-screen bg-gradient-to-b from-blue-800 to-yellow-600 bg-[url('/test.jpg">
{
  /* <button className="h-40 w-40 bg-sky-400/20  drop-shadow-lg flex justify-center items-center rounded-3xl">
        <div>
          <p>Hello</p>
          <Image src="/check.png" height={50} width={50} alt="i" />
        </div>
      </button>
      <div className="h-40 w-40 bg-white/20 border-[.5px] border-[#1cb15a] drop-shadow-lg flex justify-center items-center rounded-3xl">
        <Image src="/check.png" height={50} width={50} alt="i" />
      </div> */
}
// </div>
