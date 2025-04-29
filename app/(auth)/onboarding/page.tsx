//onboarding page where user is redirected after sign up to get user details like name and contact number 
"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from '@mui/material/CircularProgress';
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";


//define zod schema for user profile
const profileSchema = z.object({
  name: z.string()
       .min(3, "Name must be atleast 3 characters")
       .regex(/^[A-Za-z\s]+$/, "Must be a valid name"),
  contactNumber: z
                .string()
                .regex(/^\d{10}$/, "Must be a valid phone number"),
});

//define type for schema
type ProfileSchema= z.infer<typeof profileSchema>;

const OnboardingPage = () => {
    const {user, isLoaded} = useUser();
    const router = useRouter();
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [loading, setLoading] = useState<boolean>(false);

    //initialize react-hook-form with zod resolver
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<ProfileSchema>({
      resolver: zodResolver(profileSchema),
    });
  
    //submit handler for user profile form
    const onSubmit = async (values: ProfileSchema) => {
        //if user not signed in, return
        if(!isLoaded || !user){
          return;
        }
        try{
          if(user && user.id){
            setLoading(true);
            //api to store user details and user role in clerk and server database 
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/assignRole`, {
              method: "POST",
              body: JSON.stringify({
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                ...values,
              }),
              headers: {"Content-Type": "application/json"}
            });
    
            const data = await response.json();
            console.log(data.message);

            if(response.status !== 200){
              setError(data.message);
            }
            else{
              setInfo(data.message);
              if(!data.userRole){
                console.log("Role not assigned");
                return;
              }
              else{
                  //redirect to dashboard according to role
                  if(data.userRole === "ADMIN"){
                      router.push("/admin");
                  }
                  else{
                      router.push("/user");
                  }
              }  
            }
          }      
      }
      catch(err){
        console.log(err);
      }
      finally{
        setLoading(false);
      }
    }

    //show loading message if data is not loaded
    if(loading){
      return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-4">
          <p className="text-lg tracking-wider">Loading...</p>
          <CircularProgress />
        </div>
      )
    }

    return (
      <div className="w-full h-screen flex justify-center items-center p-4">
        <div className="w-full lg:w-2/5 h-auto flex flex-col justify-start items-center space-y-6 p-8 border-1 border-gray-300 rounded-xl">
            <h2 className="text-lg font-semibold">Complete Your Profile</h2>
            <form 
             className="w-full h-auto flex flex-col justify-start items-start space-y-6 bg-gray-100 p-8 rounded-xl"
             onSubmit={handleSubmit(onSubmit)}
             >
                <div className="w-full h-auto flex flex-col justify-start items-start space-y-2">
                    <label 
                    htmlFor="name"
                    className="tracking-wider"
                    >
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter Name"
                      className="w-full h-[30px] flex justify-start items-center p-2 text-sm tracking-wide border border-gray-300 rounded-md bg-white focus:outline-1 focus:outline-blue-600"
                      {...register("name")}
                    />
                    <p className="text-sm tracking-wide text-red-500">{errors.name?.message}</p>
                </div>
                <div className="w-full h-auto flex flex-col justify-start items-start space-y-2">
                    <label 
                    htmlFor="contactNumber"
                    className="tracking-wider"
                    >
                      Contact Number:
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      placeholder="Enter Contact Number"
                      className="w-full h-[30px] flex justify-start items-center p-2 text-sm tracking-wide border border-gray-300 rounded-md bg-white focus:outline-1 focus:outline-blue-600"
                      {...register("contactNumber")}
                    />
                    <p className="text-sm tracking-wide text-red-500">{errors.contactNumber?.message}</p>
                  </div>
        
                  <button 
                  type="submit"
                  className="w-[200px] h-[40px] flex justify-center items-center p-4 bg-black text-white self-center rounded-md hover:cursor-pointer hover:bg-gray-800" 
                  disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Finish Onboarding"}
                  </button>
            </form>
    </div>
    </div>
    )
}

export default OnboardingPage;
