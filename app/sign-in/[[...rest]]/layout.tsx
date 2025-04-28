//layout for sign in page
"use client";
import React from "react";
import Header from "@/components/Header";

const Layout=({children}: Readonly<{children: React.ReactNode;}>)=>{  
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-start items-center">
          <Header />
          {children}        
        </div>
      )
}
  


export default Layout;