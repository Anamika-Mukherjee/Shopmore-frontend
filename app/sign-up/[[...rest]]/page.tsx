//sign up page
"use client";
import React from "react";
import {
    SignUp,
  } from "@clerk/nextjs";
  import {  useUser } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="w-screeen h-[670px] flex justify-center items-center p-8">
     <SignUp signInUrl="/sign-in" forceRedirectUrl="/onboarding"/>
    </div>
  )
}

export default page;