//component to update user profile accessed from dashboard
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

const ManageAccount = () => {
    const {getToken} = useAuth();
    const {user} = useUser();
    const router = useRouter()
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [contactNumber, setContactNumber] = useState<string>("");
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
      //store previous user details in state variables to show in the form input fields when the form loads  
      if(user && user.id && user.publicMetadata.role){
        if(user.primaryEmailAddress){
            setEmail(user.primaryEmailAddress.emailAddress)
        }
        if(user.publicMetadata.name){
            setName(String(user.publicMetadata.name));
        }
        if(user.publicMetadata.phoneNumber){
            setContactNumber(String(user.publicMetadata.contactNumber));
        }
      } 
    }, [user]);

    //submit event handler for form submit event
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(user && user.id){
            try {
                   if(user.publicMetadata.role === "ADMIN"){
                        setLoading(true);
                        //if role is "admin", get session token from clerk to be sent with api request to protected route
                        const token = await getToken();
                        //api request to update admin information in database
                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/updateAdminInfo`, {
                            method: "POST",
                            body: JSON.stringify({
                            userClerkId: user.id,
                            name,
                            contactNumber,
                            email, 
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            }
                        });
            
                        const data = await response.json();
                        console.log(data.message);
            
                        if(response.status !== 200){
                            setError(data.message);
                            return;
                        }
                        setInfo(data.message);
                        //if information updated successfully, redirect to dashboard page
                        router.push("/admin");
                        
                   }
                   else{
                        setLoading(true);
                        //api request to update user information in database (for "user" role)
                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/updateUserInfo`, {
                            method: "POST",
                            body: JSON.stringify({
                            userClerkId: user.id,
                            name,
                            contactNumber,
                            email, 
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            }
                        });
            
                        const data = await response.json();
                        console.log(data.message);
            
                        if(response.status !== 200){
                            setError(data.message);
                        }
                        else{
                            setInfo(data.message);
                            //if information updated successfully, redirect to dashboard page
                            router.push("/user");
                        }
                   }
                    
            } 
            catch (err) {
                  console.log(err);
            }
            finally{
                setLoading(false);
            }
        }    
      };

    //show loading message if data is not loaded
    if(loading){
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            <p className="text-lg tracking-wider">Loading...</p>
            <CircularProgress />
            </div>
        )
    }

    //display form to update information   
    return user ?(
        <div className="w-full lg:w-2/3 h-full flex flex-col justify-start items-center lg:p-8">
            <form onSubmit={handleSubmit} className="w-full lg:w-[60%] h-auto flex flex-col justify-start items-center space-y-20 p-4 lg:p-0">
                <div className="w-full h-auto flex flex-col justify-center items-center space-y-4">
                    <h1 className="text-2xl font-semibold tracking-wide">
                        Update Profile
                    </h1>
                </div>
                <div className="w-full h-auto flex flex-col justify-start items-center space-y-8">
                    <div className="w-full h-auto flex flex-col justify-center items-start space-y-2">
                        <label htmlFor="email" className="w-auto h-auto flex justify-start items-center">Email</label>
                        <input 
                                type="text"
                                name="email"  
                                id="email"
                                value={email}
                                placeholder="Please enter your primary email address..." 
                                autoComplete="off"
                                className="w-full h-[40px] flex justify-start items-center p-2 border border-gray-600 rounded-md"
                                onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-full h-auto flex flex-col justify-center items-start space-y-2">
                        <label htmlFor="name" className="w-auto h-auto flex justify-start items-center">Name</label>
                        <input 
                                type="text"
                                name="name"  
                                id="name"
                                value={name}
                                placeholder="Please enter your name..." 
                                autoComplete="off"
                                className="w-full h-[40px] flex justify-start items-center p-2 border border-gray-600 rounded-md"
                                onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <div className="w-full h-auto flex flex-col justify-center items-start space-y-2">
                        <label htmlFor="contactNumber" className="w-auto h-auto flex justify-start items-center">Contact Number</label>
                        <input 
                        type="text"
                        name="contactNumber"
                        id="contactNumber" 
                        value={contactNumber}
                        placeholder="Please enter your contact number..." 
                        autoComplete="off"
                        className="w-full h-[40px] flex justify-start items-center p-2 border border-gray-600 rounded-md"
                        onChange={(e)=>setContactNumber(e.target.value)}
                        />
                    </div>
                    
                    <div className="w-[200px] h-[45px] flex flex-col justify-center items-center p-4 bg-black text-white rounded-md hover:cursor-poiner hover:bg-gray-800">
                        <button 
                        type="submit"
                        className="w-full h-full flex justify-center items-center hover:cursor-pointer rounded-md"
                        >
                         Save Changes
                        </button>
                    </div>
                    
                </div>
           </form>
          
        </div>
      ):null 
}

export default ManageAccount;
