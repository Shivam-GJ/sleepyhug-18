import { Link } from "@remix-run/react";
import { useCart } from "../Context/cartContext";
import { useState } from "react";

export default function Cart() {
    const { state, dispatch } = useCart(); 
    // console.log("state"+JSON.stringify(state));

    const totalNoOfProducts = state.productRow.reduce(
        (total, item) => total + item.no_of_product,
        0
    );

    const subtotalPrice = state.productRow.reduce(
        (subtotal, item) => subtotal + item.price * item.no_of_product,
        0
    );
    const [openCart, setOpenCart] = useState(false);

    const handleClick = async (email:string, productId:string, action:string) => {
        try {
            if (action === "increase") {
              
                dispatch({ type: "INCREASE_PRODUCT", productId });
            }
            if (action === "decrease") {
              
                dispatch({ type: "DECREASE_PRODUCT", productId });
            }
            if (action === "delete") {
               
                dispatch({ type: "DELETE_PRODUCT", productId });
            }
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    return (
        <>
            <div
                className="absolute top-4 right-6 cursor-pointer"
                onClick={() => setOpenCart(!openCart)}
            >
                <img
                    src="https://www.freeiconspng.com/thumbs/cart-icon/basket-cart-icon-27.png"
                    alt=""
                    className="h-8 w-8"
                />
                <div className="h-6 w-6 bg-orange-600 rounded-full absolute top-[-10px] left-6 flex justify-center">
                    {totalNoOfProducts}
                </div>
                {/* {userEmail} */}
            </div>
            {openCart && (
                <div className="flex flex-col justify-between absolute right-1 top-1 bg-green-50 text-black p-4 border rounded-md h-[95vh]  z-10">
                    <div className=" h-[90%]">
                        <div className="flex gap-4 align-center justify-between px-2">
                            <div>
                                <img
                                    src="https://www.freeiconspng.com/thumbs/cart-icon/basket-cart-icon-27.png"
                                    alt=""
                                    className="h-8 w-8"
                                />
                                <div className="h-6 w-6 bg-orange-600 rounded-full relative top-[-40px] left-6 flex justify-center text-white">
                                    {totalNoOfProducts}
                                </div>
                            </div>

                            <h1>Your Cart</h1>
                            <button
                                className="border p-1 h-8 w-8 "
                                onClick={() => setOpenCart(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-scroll h-[80%]">
                            <ul className="overflow-hidden">
                                {state.productRow.map((item, index) => (
                                    <li key={index}>
                                        <div className="bg-green-200 m-2 p-2 rounded flex gap-4 justify-between">
                                            <div className=" flex gap-4">
                                                <img
                                                    className=" h-20 w-20"
                                                    src={item.image_url}
                                                    alt=""
                                                />
                                                <div className="">
                                                    <Link
                                                        to={`/search/product/${item.name}`}
                                                    >
                                                        <h6>{item.name}</h6>
                                                    </Link>
                                                    Price : {item.price} ₹
                                                    <div className="flex">
                                                        <div
                                                            className="flex justify-center items-center h-6 w-6 border border-black border-r-0 cursor-pointer"
                                                            onClick={() =>
                                                                handleClick(
                                                                    "shivam.gautam@growthjockey.com",
                                                                    item.product_id,
                                                                    "decrease"
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </div>

                                                        <div className="border border-black h-6 w-8 flex justify-center items-center">
                                                            {item.no_of_product}
                                                        </div>
                                                        <div
                                                            className="border border-black h-6 w-6 border-l-0 flex justify-center items-center cursor-pointer"
                                                            onClick={() =>
                                                                handleClick(
                                                                    "shivam.gautam@growthjockey.com",
                                                                    item.product_id,
                                                                    "increase"
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <div className="flex justify-end">
                                                    <button
                                                        className="h-4 w-4 "
                                                        onClick={() =>
                                                            handleClick(
                                                                "shivam.gautam@growthjockey.com",
                                                                item.product_id,
                                                                "delete"
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/128/3395/3395538.png"
                                                            alt=""
                                                        />
                                                    </button>
                                                </div>

                                                <div>
                                                    {item.price *
                                                        item.no_of_product}{" "}
                                                    ₹
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex">
                        <div className=" flex items-center justify-center m-1 w-full   bg-emerald-600 text-white text-lg ">
                            Subtotal : {subtotalPrice} ₹
                            <button className=" m-2 p-2  rounded-md bg-emerald-900 text-white flex items-center gap-2 ">
                                Checkout
                                <div className="flex ">
                                    <img
                                        className="h-4 w-4"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/White_lock.svg/1024px-White_lock.svg.png"
                                        alt=""
                                    />
                                    <img
                                        className="h-4 w-4"
                                        src="https://www.freeiconspng.com/thumbs/check-mark-png/checkmark-png-line-29.png"
                                        alt=""
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
