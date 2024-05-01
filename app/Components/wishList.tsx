import { Link } from "@remix-run/react";
import { useCart } from "../Context/cartContext";
import { useWishList } from "~/Context/wishListContext";
import { useState } from "react";

export default function WishList() {
    const { state, dispatch2 } = useWishList();
    // console.log("state"+JSON.stringify(state));

    const totalNoOfProducts = state.productRow.length;

    const [openCart, setOpenCart] = useState(false);

    const handleClick = async (
        email: string,
        productId: string,
        action: string
    ) => {
        try {
            if (action === "delete") {
                dispatch2({ type: "DELETE_PRODUCT", productId });
            }
            if (action === "move") {
                dispatch2({ type: "MOVE_PRODUCT", productId });
            }
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    return (
        <>
            <div
                className="absolute top-4 right-24 cursor-pointer"
                onClick={() => setOpenCart(!openCart)}
            >
                <img
                    src="https://cdn2.iconfinder.com/data/icons/thick-outlines-online-project-basics/128/20-blue_favorite-heart-love-wishlist-512.png"
                    alt=""
                    className="h-8 w-8"
                />
                <div className="h-6 w-6 bg-orange-600 rounded-full absolute top-[-10px] left-[18px] flex justify-center">
                    {totalNoOfProducts}
                </div>
                {/* {userEmail} */}
            </div>
            {openCart && (
                <div className="flex flex-col justify-between absolute right-2 top-2 bg-green-50 text-black p-4 border rounded-md h-full  z-10">
                    <div className="">
                        <div className="flex gap-4 align-center justify-between px-2">
                            <div>
                                <img
                                    src="https://cdn2.iconfinder.com/data/icons/thick-outlines-online-project-basics/128/20-blue_favorite-heart-love-wishlist-512.png"
                                    alt=""
                                    className="h-8 w-8"
                                />
                                <div className="h-6 w-6 bg-orange-600 rounded-full relative top-[-40px] left-[20px] flex justify-center text-white">
                                    {totalNoOfProducts}
                                </div>
                            </div>

                            <h1>Your WishList</h1>
                            <button
                                className="border p-1 h-8 w-8 "
                                onClick={() => setOpenCart(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div>
                            <ul>
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
                                                    <div>
                                                        <button className="border border-black rounded px-2 " onClick={() =>
                                                            handleClick(
                                                                "shivam.gautam@growthjockey.com",
                                                                item.product_id,
                                                                "move"
                                                            )
                                                        }>
                                                            Move to cart
                                                        </button>
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
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex">
                        <div className=" flex items-center justify-center m-1 w-full   bg-emerald-600 text-white text-lg ">
                            
                            <button className=" m-2 p-2  rounded-md bg-emerald-900 text-white flex items-center gap-2 ">
                                Move all items to cart
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
