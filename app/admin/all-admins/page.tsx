//page to show admin list in admin dashboard
"use client";
import AddAdminModal from "@/components/AddAdminModal";
import AllAdmins from "@/components/AllAdmins";
import React, { useState } from "react";

const AllAdminsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  
  return (
    <div className="w-screen min-h-[670px] flex flex-col justify-start items-center p-8 space-y-6 px-8 pt-20">
      <div className="w-full h-[40px] flex justify-end items-center p-4">
        <button
         type="button"
         onClick={()=>setOpenModal(true)}
         className="w-[150px] h-[40px] flex justify-evenly items-center bg-black text-white rounded-md hover:bg-gray-800 hover:cursor-pointer"
         >
            <span>&#43;</span>
            <p>Add Admin</p>
        </button>
        </div>
        <div className="w-full min-h-[500px] h-auto flex lg:flex-row flex-col lg:justify-center justify-start items-center lg:items-start lg:flex-wrap lg:pl-10">
                <AllAdmins />
        </div>
        <div className="w-full lg:w-auto h-auto flex justify-center items-center absolute top-[50px] left-[0px] lg:top-[200px] lg:left-[600px]">
        {openModal && (
        <AddAdminModal open={openModal} onOpenChange={setOpenModal}/>
      )}
      </div> 
    </div>
  )
}

export default AllAdminsPage;
