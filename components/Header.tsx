//header component for navbar
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCartContext } from "@/contexts/cartContext";

const Header = () => {
    const {user} = useUser();
    const {cartDetails} = useCartContext();

    return (
        <div className="header-container">
        <Link 
         href={user?(user?.publicMetadata.role === "ADMIN"?"/admin":"/user"):"/"}
         className="logo-container">
            <Image 
             src="/assets/logo.png"
             alt="logo"
             width={70}
             height={30}
             className="hidden lg:flex"
             />
            <Image 
             src="/assets/logo.png"
             alt="logo"
             width={60}
             height={10}
             className="lg:hidden flex"
             />
        </Link>
        
        <div className="search-bar-container">
            <SearchBar />
        </div>
        <div className="w-[350px] h-full flex justify-center items-center">
        <div className="accounts-container">
        <SignedOut>
            <Link 
            href={"/sign-in"}
            className="flex p-2 rounded-md hover:cursor-pointer hover:border border-white"
            >
                Sign In
            </Link>
            <Link 
                href = {"/sign-up"}
                className="flex p-2 rounded-md hover:cursor-pointer hover:border border-white"
            >
                Sign Up
            </Link>                
            </SignedOut>
            <SignedIn>
                <div className="w-[150px] h-full flex justify-end items-center space-x-4">
                 
                <UserButton userProfileMode="navigation" userProfileUrl={"/user/user-profile"}/>
                </div>
            </SignedIn>
        </div>
        <div className="orders-container">
        <Link 
        href={user?"/user/orders":"/sign-in"}
        className="font-semibold">Orders</Link>
        </div>
        <Link 
         href={user?"/user/cart":"/sign-in"}
         className="cart-container">
            <Image 
            src="/assets/shopping-cart.svg"
            alt="shopping-cart"
            width={30}
            height={30}
            />
            <span className="w-[10px] h-[10px] flex jutify-center items-center bg-red-700 rounded-[20px] p-2 z-20 absolute top-[10px] right-[35px]">
                <p className="w-full h-full flex justify-center items-center text-xs">
                    {user && cartDetails ? cartDetails.items.length: "0"}
                </p>
            </span>
        </Link>
        </div>
        </div>
    )
}

export default Header;
