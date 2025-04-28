//sign in page
"use client";
import React from "react";
import {SignIn} from "@clerk/nextjs";

const page = () => {
  return (
    <div className="w-screeen h-[670px] flex justify-center items-center p-8">
        <SignIn signUpUrl="/sign-up" forceRedirectUrl="/redirectToDashboard"/>
    </div>
  )
}

export default page;