//sidebar component for admin dashboard
"use client";
import React from "react";
import { adminSidebarMenu } from "@/utils/constants";
import Link from "next/link";

const AdminSideBar = () => {
  return (
    <div className="admin-sidebar">
      <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center space-y-4 px-2 py-4">
        <ul className="w-full min-h-[615px] h-auto flex flex-col justify-start items-center space-y-6 overflow-y-hidden py-8">
          {
            adminSidebarMenu.map((item, index)=>(
            <li 
             key={index}
             className="w-full h-[50px] flex justify-start items-center text-lg font-semibold tracking-wide p-4 rounded-md text-white hover:cursor-pointer hover:bg-(--brand-secondary-light) hover:text-white"
             >
              <Link
               href={item.url}>
              {item.label}
              </Link>
            </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default AdminSideBar;
