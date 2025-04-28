//page where user is redirected after sign in to check user role before redirecting to dashboard
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
    const {user} = useUser();
    const router = useRouter();

    useEffect(()=>{
       if(user && user.id && user.publicMetadata.role){
        const role = user.publicMetadata.role;
        //if user is signed in and role is admin, redirect to admin dashboard, else redirect to user dashboard
        if(role === "ADMIN"){
          router.push("/admin");
        }
        else{
            router.push("/user");
        }
       }
    }, [user]);

    return (
        <div>
          Redirecting to dashboard...
        </div>
    )
}

export default page
