//page where user is redirected after payment
"use client";
import { useCartContext } from "@/contexts/cartContext";
import { convertToDateTime } from "@/utils/functions";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

const PaymentRedirectPage = () => {
    const {user} = useUser();
    const searchParams = useSearchParams();
    const linkId = searchParams.get("link_id");
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [successPayment, setSuccessPayment] = useState<Payment>();
    const [failedPayment, setFailedPayment] = useState<Payment>();
    const [pendingPayment, setPendingPayment] = useState<Payment>();
    const [userDetails, setUserDetails] = useState<User>();
    const {setCartDetails} = useCartContext();
    const [productId, setProductId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<Order>();

    useEffect(()=>{
      if(user && user.id){
          try{
            const fetchPaymentData = async ()=>{
              setLoading(true);
              //api to fetch current payment details from server through payment link id
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getPaymentDetails`, {
                method: "POST",
                body: JSON.stringify({
                  userClerkId: user.id,
                  linkId,
                }),
                headers: {"Content-Type": "application/json"},
              });

              const data = await response.json();
              console.log(data.message);

              if(response.status !== 200){
                setError(data.message);
                return;
              }

              if(data.userDetails){
                //store user details in state variable
                setUserDetails(data.userDetails);
              }
              
              if(data.paymentDetails.status === "SUCCESS"){
                //if payment successful, set payment details in successPayment variable
                setSuccessPayment(data.paymentDetails);
                setProductId(data.paymentDetails.productId);
              }
              else if(data.paymentDetails.status === "FAILED"){
                //if payment failed, set payment details in failedPayment variable
                setFailedPayment(data.paymentDetails);
              }
              else if(data.paymentDetails.status === "PENDING"){
                //if payment pending, set payment details in pendingPayment variable
                setPendingPayment(data.paymentDetails);
              }
            }
            fetchPaymentData();
          }
          catch(err){
            console.log(err);
          }
          finally{
            setLoading(false);
          }
      }
    }, []);

    useEffect(()=>{
      if(successPayment && user && productId){
        try{
           const placeOrder = async ()=>{
             setLoading(true);
              //if payment successful, call api to create new order for the user
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/placeOrder`, {
                      method: "POST",
                      body: JSON.stringify({
                          userClerkId: user.id,
                          productId,
                          paymentOrderId: successPayment.orderId,
                          paymentId: successPayment.id,
                      }),
                      headers: {"Content-Type": "application/json"}
              });

              const data = await response.json();
              console.log(data.message); 
              
              if(response.status !== 200){
                setError(data.message);
                return;
              }
              
              setInfo(data.message);
              if(data.orderPlaced){
                //store order details in state variable
                setOrderDetails(data.orderPlaced);
              }
           }
           placeOrder();
        }
        catch(err){
          console.log(err);
        }
        finally{
          setLoading(false);
        }
      }

    }, [successPayment, user, productId])
    

    useEffect(()=>{
        if(successPayment && user && productId && orderDetails){
          try{
               const updateCart = async ()=>{
                setLoading(true);
                  //if payment successful and order created, call api to remove associated items from cart
                  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/removeFromCart`, {
                    method: "POST",
                    body: JSON.stringify({
                        userClerkId: user.id,
                        productId,
                    }),
                    headers: {"Content-Type": "application/json"}
                  });

                  const data = await response.json();
                  console.log(data.message);

                  if(response.status !== 200){
                    setError(data.message);
                    return;
                  }

                  if(data.cartDetails){
                      //store updated cart details in context variable to immediately update cart item count
                      setCartDetails(data.cartDetails);
                  }
               }
               updateCart();  
            }
        catch(err){
            console.log(err);
        }
        finally{
          setLoading(false);
        }
      }
    }, [successPayment, user, productId, orderDetails]);

    //show loading message if data is not loaded
    if(loading){
      return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-4">
          <p className="text-lg tracking-wider">Loading...</p>
          <CircularProgress />
        </div>
      )
    }

    //display payment details if payment successful
    if(successPayment && userDetails && orderDetails){
      return (
        <div className="w-screen h-[670px] flex flex-col justify-center items-center p-8 space-y-10">
            <div className="w-full lg:w-1/3 h-auto flex flex-col justify-start items-center space-y-6 p-4 bg-gray-100 shadow-lg rounded-lg">
                <p className="text-lg font-semibold tracking-wider">
                  Payment Successful
                </p>
                 <div className="w-full h-auto flex flex-col justify-start items-start space-y-2 tracking-wider text-sm">
                    <div className="w-full h-auto flex justify-start items-start space-x-12 ">
                      <p>Payment Id:</p>
                      <p className="text-blue-800 font-font-medium">{successPayment.orderId}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-7">
                      <p>Payment Time:</p>
                      <p className="text-blue-800 font-font-medium">{convertToDateTime(successPayment.createdAt)}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Payment Status:</p>
                      <p className="text-blue-800 font-medium">{successPayment.status}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-9">
                      <p>Paid Amount:</p>
                      <p className="text-blue-800 font-font-medium">&#8377;{successPayment.amount.toFixed(2)}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-3">
                      <p>Customer Name:</p>
                      <p className="text-blue-800 font-font-medium">{userDetails.name}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-3">
                      <p>Customer Email:</p>
                      <p className="text-blue-800 font-font-medium">{userDetails.email}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-2">
                      <p>Customer Phone:</p>
                      <p className="text-blue-800 font-medium">{userDetails.contactNumber}</p>
                    </div>
                 </div>
            </div>
            <div className="w-screen h-auto flex justify-center items-center">
                <Link 
                 href={`/user/orders/${orderDetails.id}`}
                 className="w-[200px] h-[40px] flex justify-center items-center p-4 bg-black text-white rounded-md hover:cursor-pointer hover:bg-gray-800"
                 >
                  See order details
                </Link>
            </div>
        </div>
      )
    }
    //show failed payment details
    else if(failedPayment && userDetails){
      return (
        <div className="w-screen h-[670px] flex justify-center items-center p-8">
            <div className="w-1/3 h-auto flex flex-col justify-start items-center space-y-6 p-4 bg-gray-100 shadow-lg rounded-lg">
                <p className="text-lg font-semibold tracking-wider">
                  Payment Failed
                </p>
                 <div className="w-full h-auto flex flex-col justify-start items-start space-y-2">
                    <div className="w-full h-auto flex justify-start items-start space-x-4 tracking-wider">
                      <p>Payment Id:</p>
                      <p>{failedPayment.orderId}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Payment Time:</p>
                      <p>{failedPayment.createdAt}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Payment Status:</p>
                      <p>{failedPayment.status}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Payment Amount:</p>
                      <p>{failedPayment.currency} {failedPayment.amount}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Customer Name:</p>
                      <p>{userDetails.name}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Customer Email:</p>
                      <p>{userDetails.email}</p>
                    </div>
                    <div className="w-full h-auto flex justify-start items-start space-x-4">
                      <p>Customer Phone:</p>
                      <p>{userDetails.contactNumber}</p>
                    </div>
                 </div>
            </div>
        </div>
      )
    }
    //for other payment status, show no information available
    else{
      return (
        <div className="w-screen h-[670px] flex justify-center items-center p-8">
          <p>No Information Available</p>
        </div>
      )
    }
    
}

export default PaymentRedirectPage;
