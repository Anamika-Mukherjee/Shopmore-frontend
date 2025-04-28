//card component to show product details in user cart page 
"use client";
import { useCartContext } from "@/contexts/cartContext";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

const CartProductsCard = ({productId}: {productId: string}) => {
    const {user} = useUser();
    const {cartDetails, setCartDetails} = useCartContext();
    const [productDetails, setProductDetails] = useState<Product>();
    const [quantity, setQuantity] = useState<number>(1);
    const [image, setImage] = useState<string>("");
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
          if(user && cartDetails && cartDetails.items.length){
              try{
                    
                   //check if product is in cart and if in cart store cart item details in variable
                    const productInCart = cartDetails.items.find((item)=>item.productId===productId);
                        const fetchProductDetails = async ()=>{
                            setLoading(true);    
                            //api request to fetch product details from database
                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`, {
                                method: "GET",
                            });

                            const data = await response.json();
                            console.log(data.message);

                            if(response.status !== 200){
                                setError(data.message);
                                return;
                            }                    

                            if(data.productDetails){
                                //store product details in a state variable
                                setProductDetails(data.productDetails);
                                //store first image url in state variable
                                setImage(data.productDetails.imageUrls[0]);
                                //if product is in cart, store product quantity in state variable
                                if(productInCart){
                                    setQuantity(productInCart.quantity);
                                }
                            
                            }
                        }
                        fetchProductDetails();
              }
              catch(err: any){
                console.log(err);
                setError(err.message);
              }
              finally{
                setLoading(false);
            }
          }
      }, [cartDetails, user]);

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
                        const {paymentLink} = orderResponse.orderData;
                        //if payment link created successfully, redirect user to payment link
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


      //event handler "remove from cart" button click
      const handleRemoveClick = async ()=>{
        try{
            if(user && user.id){
                setLoading(true); 
                //api request to remove item from cart
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

                setInfo(data.message);
                if(data.cartDetails){
                    //store updated cart details in context variable to immediately update cart item count
                    setCartDetails(data.cartDetails);
                }
            }
           
        }
        catch(err: any){
            console.log(err);
            setError(err.message);
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

    //display product details for cart item  
    return productDetails && cartDetails && quantity &&(
        <>
         <div className="w-full h-full flex flex-col justify-start items-start space-y-4">
            <div className="w-full h-4/5 flex justify-start items-start space-x-4">
                <div className="w-auto h-auto flex justify-center items-center rounded-md">
                    <Image 
                    src={productDetails?.imageUrls[0]}
                    alt="product image"
                    width={100}
                    height={100}
                    className="flex justify-center items-center rounded-md"
                    />
                </div>
                <div className="w-full h-auto flex flex-col justify-start items-start space-y-2">
                   <p className="text-lg font-semibold tracking-wide">{productDetails.name}</p>
                   <p className="tracking-wide">{productDetails.description}</p>
                   <p className="text-lg font-semibold">&#8377;{productDetails.price}</p>
                   <p className="text-lg font-semibold">{productDetails.stock?"In Stock":"Sold Out"}</p>
                   <p className="text-lg font-semibold">Quantity: {quantity}</p>

                </div>
                
            </div>
            <div className="w-full h-auto flex justify-center items-center space-x-6 text-sm">
                    <button
                     type="button"
                     disabled={productDetails.stock?false: true}
                     onClick={handleBuyClick}
                     className="w-[100px] h-[35px] flex justify-center items-center p-4 rounded-md bg-(--brand-secondary) text-white hover:cursor-pointer hover:bg-(--brand-secondary-dark) disabled:bg-(--brand-secondary-light) disabled:hover:cursor-not-allowed"
                     >
                        Buy Now
                    </button>
                    <button
                     type="button"
                     onClick={handleRemoveClick}
                     className="w-[150px] h-[35px] flex justify-center items-center p-4 rounded-md bg-red-800 text-white hover:cursor-pointer hover:bg-red-900"
                     >
                        Remove from Cart
                    </button>
                </div>
         </div>
        </>
    )
}

export default CartProductsCard;
