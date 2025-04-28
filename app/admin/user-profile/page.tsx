//user profile management page for "admin" 
"use client";
import ManageAccount from "@/components/ManageAccount";
import React from "react";

const AdminUserProfilePage = () => {
  return (
    <div className="w-screen h-full flex flex-col justify-center items-center">
      <ManageAccount />
    </div>
  )
}

export default AdminUserProfilePage;
