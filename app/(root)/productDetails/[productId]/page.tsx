//product details page
"use client";
import { useCartContext } from "@/contexts/cartContext";
import { useUser } from "@clerk/nextjs";
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

const page = () => {
    const {productId} = useParams();
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [productDetails, setProductDetails] = useState<Product>();
    const [image, setImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const {user} = useUser();
    const router = useRouter();
    const {setCartDetails} = useCartContext();

    useEffect(()=>{
       const fetchProductDetails = async ()=>{
         try{
          setLoading(true);
          //api to fetch product details from server database
           const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`, {
            method: "GET",
           });

           const data = await response.json();
            if(response.status !== 200){
                throw new Error(data.message);
            }
            console.log(data.message);
            if(data.productDetails){
                //store product details object and image url of first image in state variables
                setProductDetails(data.productDetails);
                setImage(data.productDetails.imageUrls[0]);
            }
         }
         catch(err: any){
           console.log(err.message);
           setError(err.message);
         }
         finally{
          setLoading(false);
        }
       }
       fetchProductDetails();
    }, []);

    //event handler to handle "add to cart" button click
    const handleAddToCartClick = async ()=>{
      try{
        //redirect to sign in page if user is not signed in 
        if(!user){
          router.push("/sign-in");
        }
        else{
          if(productDetails){
            setLoading(true);
            //api to store product details into user cart table in server database
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addToCart`, {
              method: "POST",
              body: JSON.stringify({
                userClerkId: user.id,
                productId: productDetails.id,
                quantity,
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
            //store cart details in a state variable
            setCartDetails(data.cartDetails);
          }
          
        }
      }
      catch(err: any){
        console.log(err.message);
        setError(err.message);
      }
      finally{
        setLoading(false);
      }
      
    }

    //event handler to handle "buy now" button click
    const handleBuyClick = async ()=>{
      try{
          if(user && user.id && productDetails){
              setLoading(true);
              //api to get user details from backend
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getUserDetails`, {
                  method: "POST",
                  body: JSON.stringify({
                      userClerkId: user.id,
                  }),
                  headers: {"Content-Type": "application/json"},
              });

              const userData = await response.json();
              console.log(userData.message);

              if(response.status !== 200){
                  setError(userData.message);
                  return;
              }
              
              if(userData.userDetails && productDetails){
                  
                  const {email, name, contactNumber} = userData.userDetails;
                  //if user details retrieved from backend, call api to backend to create payment link 
                  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/createPaymentLink`, {
                      method: "POST",
                      body: JSON.stringify({
                          orderAmount: productDetails.price,
                          customerId: user.id,
                          customerName: String(name),
                          customerEmail: String(email),
                          customerPhone: String(contactNumber),
                          paymentPurpose: `Payment for ${productDetails.name}`,
                          productId,
                          productQuantity: quantity,
                      }),
                      headers: {"Content-Type": "application/json"},
                  });

                  const orderResponse = await res.json();
                  console.log(orderResponse.message);

                  if(res.status !== 200){
                      setError(orderResponse.message);
                      return;
                  }

                  if(orderResponse.orderData){
                      //if payment link created successfully, redirect user to payment link
                      const {paymentLink} = orderResponse.orderData;
                      window.location.href = paymentLink;
                  }
                  else{
                      console.log("No order data received from server");
                  }
              }

          }
      }
      catch(err: any){
          console.log(err.message);
          setError(err.message);
      }
      finally{
        setLoading(false);
      }
    }

    //event handler to set product quantity
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
       setQuantity(Number(e.target.value));
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

    return productDetails && (
        <div className="w-screen h-[98%] flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-4 lg:space-y-0 py-10 px-8">
          <div className="w-auto h-auto flex lg:flex-col justify-start items-center space-x-2 lg:space-y-2 lg:space-x-0">
              {productDetails.imageUrls.map((image, index)=>(
                <button
                 type="button"
                 key={index}
                 onClick={()=>setImage(image)}
                 >
                  <Image 
                   src={image}
                   alt="image thumbnail"
                   width={100}
                   height={100}
                   className="rounded-md hover:outline-2 outline-blue-500 hover:cursor-pointer"
                   />
                </button>
              ))}
          </div>
          {image && <div className="w-full lg:w-2/5 h-full flex flex-col justify-center items-center">
            <Image 
             src={image}
             alt="product image"
             width={500}
             height={500}
             className="w-full h-full"
            />
          </div>
          }
          <div className="w-full lg:w-1/5 h-full flex flex-col justify-center items-start overflow-y-auto">
             <p className="text-lg font-semibold">{productDetails.name}</p>
             <hr className="w-full border-t border-gray-300 mb-6 mt-2"/>
             <div className="w-full h-auto flex flex-col justify-start items-start space-y-10">
                <div className="w-full h-auto flex flex-col justify-start items-start space-y-4">
                  <p className="text-sm font-medium flex justify-center items-start">&#8377; <span className="ml-1 text-2xl font-bold">{productDetails.price.toLocaleString("en-IN")}</span></p>
                  <p className="font-semibold">{productDetails.stock>0?"In stock":"Sold Out"}</p>
                </div>
                <div className="w-full h-auto flex flex-col justify-start items-start space-y-1">
                  <p className="text-gray-600 tracking-wider font-semibold">About this item:</p>
                  <p className="tracking-wider font-medium">{productDetails.description}</p>
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/5 h-auto flex flex-col justify-start items-start p-8 rounded-xl border border-(--brand-secondary) space-y-4">
              <div className="w-full h-auto flex flex-col justify-start items-start">
                <p className="font-semibold">Price</p>
                <p className="text-lg font-semibold text-red-700">&#8377;{productDetails.price.toLocaleString("en-IN")}</p>
              </div>
              <p className={productDetails.stock>0?"text-green-600 text-lg tracking-wider":"text-red-500 tracking-wider"}>{productDetails.stock>0?"In stock":"Sold Out"}</p>
              <div className="w-full h-auto flex justify-start items-center space-x-4">
                <label htmlFor="productQuantity">
                  Quantity:
                </label>
                <input 
                 type="number" 
                 onChange={handleChange}
                 defaultValue={1}
                 className="w-[80px] h-[30px] flex justify-start items-center p-2 border border-gray-300 rounded-md text-sm"
                 />
              </div>
              <div className="w-full h-auto flex flex-col justify-start items-center space-y-2">
                 <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="w-[130px] h-[30px] flex justify-center items-center bg-(--brand-secondary) p-4 text-white tracking-wide rounded-md text-sm hover:cursor-pointer hover:bg-(--brand-secondary-light)"
                  >
                   Add to Cart
                 </button>
                 <button
                  type="button"
                  onClick={()=>user?handleBuyClick():router.push(`/sign-in`)}
                  className="w-[130px] h-[30px] flex justify-center items-center bg-(--pink) p-4 text-white tracking-wide rounded-md text-sm hover:cursor-pointer hover:bg-(--pink-dark)"
                  >
                   Buy Now
                 </button>
              </div>
          </div>
        </div>
    )
}

export default page;
