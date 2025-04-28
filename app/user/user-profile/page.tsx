//user profile management page for "user" 
"use client";
import ManageAccount from "@/components/ManageAccount";
import React from "react";

const page = () => {
  return (
    <div className="w-full lg:w-4/5 h-full flex flex-col justify-center items-center">
      <ManageAccount />
    </div>
  )
}

export default page;
