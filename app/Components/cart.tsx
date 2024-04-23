import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { useState } from "react";

export default function Cart({ productRow }) {
    const [openCart, setOpenCart] = useState(false);
    const totalNoOfProducts = productRow.reduce(
        (total, item) => total + item.no_of_product,
        0
    );
    return (
        <>
            <div
                className="absolute top-4 right-6 "
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
                <div className="flex flex-col justify-between absolute right-2 top-2 bg-green-50 text-black p-4 border rounded-md h-full  z-10">
                    <div className="">
                        <div className="flex gap-4 align-center">
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

                            <h1>-------This is your cart-------</h1>
                            <button
                                className="border p-1 h-8 w-8 "
                                onClick={() => setOpenCart(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div>
                            <ul>
                                {productRow.map((item, index) => (
                                    <li key={index}>
                                        Product ID: {item.product_id}, No. of
                                        Products: {item.no_of_product}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex">
                        <div className=" flex align-center justify-center m-1 w-full h-12  bg-emerald-600 text-white ">
                            Subtotal: 
                        </div>

                        <button className=" m-1 w-full h-12 rounded-md bg-emerald-900 text-white ">
                           Checkout ✔
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
