import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { useState } from "react";
import FuzzySearchComponent from "./FuzzySearchComponent";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { User } from "~/utilities/typeDefinitions";
import { Link } from "react-router-dom";
import Cart from "~/Components/cart";

type Category = {
    id: number;
    title: string;
    imageUrl: string;
};

type Product = {
    name: string;
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const accessToken = await getAccessTokenFromCookies(request);

        if (accessToken == null) {
            return redirect("/sign-in");
        } else {
            console.log("accessToken hai");
        }

        if (!accessToken.email.endsWith("@growthjockey.com")) {
            throw new Error("Unauthorized access");
        }
        console.log(accessToken);

        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `SELECT id, title, image_url FROM category`
        );
        if (result instanceof Error) {
            throw new Error("Error querying database for categories");
        }

        const resultProducts = await postgresDatabaseManager.execute(
            `SELECT name FROM products`
        );
        if (resultProducts instanceof Error) {
            throw new Error("Error querying database for products");
        }

        const cartItems = await postgresDatabaseManager.execute(
            `SELECT DISTINCT c.product_id, c.no_of_product, p.name, p.price, p.image_url
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.email  = $1`,
            [accessToken.email]
        );
        if (cartItems instanceof Error) {
            throw new Error("Error querying database for products");
        }
        console.log(cartItems.rows)
        const row=cartItems.rows;

        const user: User & { employeeId?: string } = {
            id: accessToken.userId,
            email: accessToken.email,
            profilePicture: accessToken.profilePicture,
            name: accessToken.name,
        };
    

        const products: Product[] = resultProducts.rows;
        const categories: Category[] = result.rows;
        const names = products.map((item) => item.name);
        // console.log(names);
        // console.log(products);

        return json({ names, categories, user,row });
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load categories" }, 500);
    }
};

export default function Index() {
    const data = useLoaderData();
    const [profileOpen, setProfileOpen] = useState(false);
    return (
        <>
            <div className="bg-gradient-to-br from-orange-200 to-orange-300 min-h-screen">
                <header className="flex justify-center bg-orange-50 text-white py-4">
                    <Link to={`/`}>
                        <img
                            src="https://sleepyhug.in/cdn/shop/files/Group_1831.png?v=1690469218&width=140"
                            className=""
                            alt="Logo"
                        />
                    </Link>
                    <Cart
                        productRow={data.row}
                    />
                </header>
                <div className="w-full">
                    <img
                        src="https://sleepyhug.in/cdn/shop/files/heraBanner1_3x_e0af34ed-32f8-49ac-a35a-c98034d0ba7c_1.webp?v=1713270831"
                        className="w-full"
                        alt="Banner"
                    />
                </div>
                <div className="h-auto w-auto p-2 text-black bg-white absolute top-2 left-2 border flex flex-col gap-1 ">
                    <div className="flex gap-4 ">
                        {" "}
                        <img
                            src={data.user.profilePicture}
                            alt=":)"
                            className="h-8 rounded-full "
                        />
                        <p>{data.user.name}</p>
                        {!profileOpen && (
                            <button
                                className="border px-1 rounded"
                                onClick={() => {
                                    setProfileOpen(!profileOpen);
                                }}
                            >
                                ☰
                            </button>
                        )}
                        {profileOpen && (
                            <button
                                className="border px-1 rounded"
                                onClick={() => {
                                    setProfileOpen(!profileOpen);
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {profileOpen && (
                        <div className="">
                            <p className="my-1">{data.user.email}</p>

                            <button className="border px-2 shadow-lg">
                                <Link
                                    to="/sign-out"
                                    className="tw-p-3 hover:tw-underline "
                                   >
                                    Logout
                                </Link>
                            </button>
                        </div>
                    )}
                </div>
                <FuzzySearchComponent data={data.names} />
                <main className="container mx-auto py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {data.categories.map((category) => (
                            <Link
                                to={`/category/${category.id}`}
                                key={category.id}
                            >
                                <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition duration-300 transform hover:scale-105">
                                    <div>
                                        {" "}
                                        <img
                                            src={category.image_url}
                                            alt={category.title}
                                            className="mx-auto mb-2 h-24 w-32"
                                        />{" "}
                                    </div>

                                    <h2 className="text-l font-semibold text-center">
                                        {category.title}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
