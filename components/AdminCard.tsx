//admin card component to display admin data (only accessed by admins)
"use client";
import { convertToDateTime } from "@/utils/functions";
import React from "react";

const AdminCard = ({admin}: {admin: Admin}) => {
  return admin && (
      <div className="w-full min-h-[200px] h-auto flex flex-col justify-start items-center p-4 shadow-2xl bg-gray-100 rounded-md space-y-3">       
        <div className="w-full h-auto flex flex-col justify-start items-start space-y-1 text-sm">
          <div className="w-full h-auto flex justify-start items-center space-x-15">
              <p className="w-1/5 lg:w-auto text-gray-500 flex">Admin Id:</p>
              <span className="flex flex-wrap">{admin.id}</span>
          </div>
          <div className="w-full h-auto flex justify-start items-center space-x-11">
              <p className="text-gray-500">Admin Name:</p>
              <span className="ml-1">{admin.name}</span>
          </div>
          <div className="w-full h-auto flex justify-start items-center space-x-5">
              <p className="text-gray-500">Admin email:</p>
              <span className="ml-1">{admin.email}</span>
          </div>
          <div className="w-full h-auto flex justify-start items-center space-x-9">
              <p className="w-1/3 lg:w-auto flex text-gray-500">Admin Contact Number:</p>
              <p className="flex justify-start items-start flex-wrap">{admin.contactNumber}</p>
          </div>
          <div className="w-full h-auto flex justify-start items-center space-x-2">
              <p className="text-gray-500">Admin Created At:</p>
              <span className="ml-1">{convertToDateTime(admin.createdAt)}</span>
          </div>

          </div>
       </div>
    )
}

export default AdminCard;
