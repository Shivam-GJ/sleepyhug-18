import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { Link } from "react-router-dom";
import Cart from "~/Components/cart";
import WishList from "~/Components/wishList";
import cart from "../assets/cart.png";
import heart from "../assets/heart.png";
import { useState } from "react";
import { useCart } from "~/Context/cartContext";
import { useWishList } from "~/Context/wishListContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "../App.css";

type Product = {
    name: number;
    price: string;
    imageUrl: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    try {
        const accessToken = await getAccessTokenFromCookies(request);

        if (accessToken == null) {
            return redirect("/sign-in");
        } else {
            console.log("accessToken hai for product by id page");
        }

        if (!accessToken.email.endsWith("@growthjockey.com")) {
            throw new Error("Unauthorized access");
        }
        const productId = params.id;
        // Fetch categories from the database
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `SELECT 
             name,price,original_price,image_url,image_url2,image_url3,image_url4,description,id
        FROM
             products
        WHERE
              id = $1`,
            [productId]
        );

        if (result instanceof Error) {
            throw new Error("Error querying database for products");
        }
// ----------------------------------------------------------------------
        const resultVariants = await postgresDatabaseManager.execute(
            `SELECT 
             name,price,original_price,image_url,image_url2,image_url3,image_url4,description,id
        FROM
             products
        WHERE
              id = $1`,
            [productId]
        );
        
        if (resultVariants instanceof Error) {
            throw new Error("Error querying database for products");
        }
// ----------------------------------------------------------------
        const userEmail = accessToken.email;

        const products: Product[] = result.rows;
        console.log("this is the product" + JSON.stringify(products));

        return json({ products, userEmail });
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load products" }, 500);
    }
};

export default function SearchProductsById() {
    const { dispatch } = useCart();
    const { dispatch2 } = useWishList();
    const data = useLoaderData();
    const { state: wishlistState } = useWishList();
    const [liked, setLiked] = useState(false);

 useEffect(() => {
    const productIdToCheck = data.products[0].id; // Adjust the index if needed
    const isProductInWishlist = wishlistState.productRow.some(item => item.product_id === productIdToCheck);
    if (isProductInWishlist) {
        console.log('Product not in the wishlist');
       
           setLiked(true);
           
    }
    else{
        setLiked(false)
    }
    console.log("checker chla")
}, [data.products, wishlistState.productRow]);

    

    const toggleLiked = () => {
        setLiked(true);
    };

    const [previewImage, setPreviewImage] = useState(
        data.products[0].image_url
    );
    const notify = () =>
        toast.success("😍 Product added to your cart!", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        const notify2 = () =>
            toast.success("❤️ Product added to Wish list!", {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

    const handleAddToCart = async (email: string, productId: string) => {
        console.log(email);
        console.log(productId);
        try {
            await fetch("/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, product_id: productId }),
            });

            dispatch({
                type: "ADD_PRODUCT",
                product: {
                    product_id: data.products[0].id,
                    name: data.products[0].name,
                    image_url: data.products[0].image_url,
                    price: data.products[0].price,
                    no_of_product: 1,
                },
            });
            // Dispatching an action to add the product to the cart with initial quantity 1
            notify();
            // window.location.reload();
        } catch (error) {
            console.error("Failed to increase product:", error);
        }
    };

    const handleAddToWishList = async (email: string, productId: string) => {
        console.log(email);
        console.log(productId);
        try {
            // await fetch("/addProduct", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ email, product_id: productId }),
            // });

            dispatch2({
                type: "ADD_PRODUCT",
                product: {
                    product_id: data.products[0].id,
                    name: data.products[0].name,
                    image_url: data.products[0].image_url,
                    price: data.products[0].price,
                },
            });
            // Dispatching an action to add the product to the cart with initial quantity 1
            notify2();
            // window.location.reload();
        } catch (error) {
            console.error("Failed to increase product:", error);
        }
    };
    

    return (
        <div className="bg-white min-h-screen">
            <header className="flex justify-center bg-orange-50 text-white py-4">
                <Link to={`/`}>
                    <img
                        src="https://sleepyhug.in/cdn/shop/files/Group_1831.png?v=1690469218&width=140"
                        className=""
                        alt="Logo"
                    />
                </Link>
                <Cart />
                <WishList />
            </header>

            <main className="container mx-auto py-4 flex justify-center ">
                <div className="bg-white rounded-lg  p-4 flex items-center m-8 gap-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="relative top-16  ">
                                <button
                                    onClick={() =>
                                        handleAddToWishList(
                                            data.userEmail,
                                            data.products[0].id
                                        )
                                    }
                                >
                                    <div className="heart-bg">
                                        <div
                                            className={`heart-icon ${
                                                liked ? "liked" : ""
                                            }`}
                                            onClick={toggleLiked}
                                        ></div>
                                    </div>
                                </button>
                            </div>
                            <img
                                src={previewImage}
                                alt={data.products[0].name}
                                className="mx-auto mb-2 h-96 w-96 rounded-xl"
                            />
                        </div>

                        <div className="flex justify-between">
                            <img
                                src={data.products[0].image_url}
                                alt={data.products[0].name}
                                className=" mb-2 h-20 w-20 rounded-xl cursor-pointer"
                                onClick={() => {
                                    setPreviewImage(data.products[0].image_url);
                                }}
                            />
                            <img
                                src={data.products[0].image_url2}
                                alt={data.products[0].name}
                                className=" mb-2 h-20 w-20 rounded-xl cursor-pointer"
                                onClick={() => {
                                    setPreviewImage(
                                        data.products[0].image_url2
                                    );
                                }}
                            />
                            <img
                                src={data.products[0].image_url3}
                                alt={data.products[0].name}
                                className=" mb-2 h-20 w-20 rounded-xl cursor-pointer"
                                onClick={() => {
                                    setPreviewImage(
                                        data.products[0].image_url3
                                    );
                                }}
                            />
                            <img
                                src={data.products[0].image_url4}
                                alt={data.products[0].name}
                                className=" mb-2 h-20 w-20 rounded-xl cursor-pointer"
                                onClick={() => {
                                    setPreviewImage(
                                        data.products[0].image_url4
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <div className="ml-4 h-64 flex flex-col justify-start gap-6 h-full w-96 py-8">
                        <p className="text-lg text-orange-500 mb-2 w-96 font-semibold">
                            SLEEPYHUG
                        </p>
                        <div>
                            <h1 className=" text-4xl text-black font-bold mb-2">
                                {data.products[0].name}
                            </h1>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 w-96">
                            {data.products[0].description}
                        </p>
                        <div className="flex gap-4">
                            <div>
                                {" "}
                                <h2 className="text-[28px]  text-black font-bold">
                                    ₹ {data.products[0].price}
                                </h2>
                                <h2 className="text-xl font-semibold line-through">
                                    ₹ {data.products[0].original_price}
                                </h2>
                            </div>
                            <div className="py-2">
                                <div className="bg-orange-200 rounded-md p-1 px-2 text-red-600 font-semibold">
                                    {Math.floor(
                                        100 *
                                            ((data.products[0].original_price -
                                                data.products[0].price) /
                                                data.products[0].original_price)
                                    )}
                                    % off
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    handleAddToCart(
                                        data.userEmail,
                                        data.products[0].id
                                    )
                                }
                                className="bg-orange-500  p-1 px-12 rounded text-white flex items-center gap-2"
                            >
                                <img src={cart} alt="" className="h-6 w-6" />
                                Add to cart
                            </button>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
