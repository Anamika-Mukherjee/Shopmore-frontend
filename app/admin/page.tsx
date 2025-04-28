//admin dashboard page
"use client";
import React, { useState } from "react";
import AdminDashboardCard from "@/components/AdminDashboardCard";
import { useUser } from "@clerk/nextjs";

const page = () => {
  const {user} = useUser();

  return user ? (
    <div className="admin-dashboard-page">
      <div className="admin-card-container">
        <AdminDashboardCard type="Products"  pageLink="products"/>
        <AdminDashboardCard type="Categories"  pageLink="categories"/>
        <AdminDashboardCard type="Orders"  pageLink="orders"/>
      </div>
      
    </div>
  ): null
}

export default page;
