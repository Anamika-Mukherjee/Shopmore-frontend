//layout for user pages
"use client";
import React, { useEffect } from "react";
import Header from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CategoryFilterHeader from "@/components/CategoryFilterHeader";

const Layout=({children}: Readonly<{children: React.ReactNode;}>)=>{
  const { user, isLoaded } = useUser();
    const router = useRouter();
  
    useEffect(() => {
      if (isLoaded && !user) {
        router.push("/"); 
      }
    }, [isLoaded, user, router]);
  
    if (!isLoaded) {
      return <div>Loading user...</div>; 
    }
    if(!user){
      return <div>Not signed in. Redirecting...</div>; 
    }
  
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-start items-center">
          <Header />
          <CategoryFilterHeader />
          {children}        
        </div>
      )
}

export default Layout;
