//header navbar for admin
"use client";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import AdminSideBar from "./AdminSideBar";

const AdminHeader = () => {
    const {user} = useUser();
    const [openMobSidebar, setOpenMobSidebar] = useState<boolean>(false);

    //function to handle menu button click for mobile devices
    const handleMenuClick = ()=>{
      if(!openMobSidebar){
        setOpenMobSidebar(true);
      }
      else{
        setOpenMobSidebar(false);
      }
    }

    return (
        <div className="w-screen flex flex-col justify-start items-start">
              <div className="admin-header-container">
                  <div className="w-[300px] h-auto flex justify-start items-center lg:space-x-0 space-x-4">
                      <button
                      type="button"
                      onClick={handleMenuClick}
                      className="flex lg:hidden hover:cursor-pointer"
                      >
                        <Image
                          src="/assets/menu.svg"
                          alt="menu"
                          width={30}
                          height={30}
                        />
                      </button>
                      <Link 
                      href={user?"/admin":"/"}
                      className="admin-logo-container">
                          <Image 
                            src="/assets/logo.png"
                            alt="logo"
                            width={70}
                            height={30}
                            className="hidden lg:flex"
                          />
                            <Image 
                            src="/assets/logo.png"
                            alt="logo"
                            width={60}
                            height={10}
                            className="lg:hidden flex"
                            />
                      </Link>
                  </div>
                  <div className="admin-search-bar-container">
                        <SearchBar />
                  </div>
                  <div className="w-[200px] h-full flex justify-center items-center space-x-4">
                      <Link
                      href="/admin/all-admins"
                      className="w-[100px] h-full flex justify-center items-center p-2 font-semibold"
                      >
                          Admins
                      </Link>
                      <div className="w-[50px] h-full flex justify-end items-center space-x-4">        
                        <UserButton userProfileMode="navigation" userProfileUrl={"/admin/user-profile"}/>
                      </div>
                  </div>
              </div>
              {openMobSidebar ? (
                <AdminSideBar />
              ):null}
          </div>  
    )
}

export default AdminHeader;
