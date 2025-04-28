//layout for admin pages
"use client";
import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AdminSideBar from "@/components/AdminSideBar";
import AdminHeader from "@/components/AdminHeader";

const Layout=({children}: Readonly<{children: React.ReactNode;}>)=>{
  const {getToken} = useAuth();
  
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [isUserToken, setIsUserToken] = useState<boolean>(false);

    //functions to protect admin routes from unauthorized users:
    //first check if user is authenticated
    useEffect(()=>{
          const fetchToken = async ()=>{
            //get user token from clerk
            const token = await getToken();
            if(token){
              setIsUserToken(true);
              //if token available call function to check user role
              checkUserRole();
            }
            else{
              //if token not available, i.e user not authenticated, redirect to home page
              setUnauthorized(true);
              router.push("/");
            }
          };
          fetchToken();
    }, [user]);

    //if user authenticated, check user role
    const checkUserRole = ()=>{
      if(isUserToken && isLoaded && user && user.publicMetadata.role){
        const role = user.publicMetadata.role;
  
        //if user is not an admin, redirect to user dashboard
        if (role !== "ADMIN") {
          setUnauthorized(true);
          router.push("/user"); 
        }
      }
    }
  
    //display loading message if user data is not loaded
    if (!isLoaded) {
      return <div>Loading user...</div>; 
    }
  
    //display unauthorized if user is not authorized to access admin routes
    if (unauthorized) {
      return <div>Unauthorized. Redirecting...</div>; 
    }

    return (
        <div className="w-screen min-h-screen h-auto flex flex-col justify-start items-center">
          <AdminHeader />
          <div className="w-screen h-auto flex justify-center items-start">
              <div className="w-auto h-auto hidden lg:flex justify-start items-start">
                <AdminSideBar />
              </div>
          {children}
          </div>
        </div>
      )
}

export default Layout;
