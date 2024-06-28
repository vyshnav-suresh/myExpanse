"use client";
import React, { useEffect } from "react";
import Header from "../header";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";

type props = {
  children: any;
};
const ProviderLayout = ({ children }: props) => {
  // const dispatch = useAppDispatch();

  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
};

export default ProviderLayout;
