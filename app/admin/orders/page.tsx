//page to show orders to admin
"use client";
import AllOrders from "@/components/AllOrders";
import React, { useState } from "react";

const AdminOrdersPage = () => {
    
    return (
      <div className="w-full min-h-[670px] h-auto flex flex-col justify-start items-center space-y-10 px-8 pt-20">
          <h2 className="text-2xl font-bold tracking-wider">Orders</h2>
            <div className="w-full min-h-[500px] h-auto flex lg:flex-row flex-col lg:justify-center justify-start items-center lg:items-start lg:flex-wrap lg:pl-10">
                <AllOrders />
            </div>        
      </div>
    )
}

export default AdminOrdersPage;
