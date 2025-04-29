//user dashboard page
"use client";
import UserProductList from '@/components/UserProductList'
import React from 'react'

const UserPage = () => {
  return (
    <div className="home-container">
      <UserProductList />
    </div>
  )
}

export default UserPage;
