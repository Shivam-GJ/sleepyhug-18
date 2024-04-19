import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { json, redirect } from "@remix-run/node";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { getPostgresDatabaseManager } from '~/common--database-manager--postgres/postgresDatabaseManager.server';
import { useState } from 'react';
import { Combobox, InputBase } from '@mantine/core';
import SelectGroupsSearchable from "./SelectGroupSearchable";
import FuzzySearchComponent from "./FuzzySearchComponent";



import { Link } from 'react-router-dom';
import SearchableSelect from "./SearchableSelect";
type Category = {
  id: number;
  title: string;
  imageUrl: string;
}

type Product = {
  name: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    // Fetch categories from the database
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
    const products: Product[] = resultProducts.rows;
    const categories: Category[] = result.rows;
    const names = products.map(item => item.name);
    console.log(names);
    console.log(products)

    return json({ names,categories});
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to load categories" }, 500);
  }
};

export default function Index() {
  const data = useLoaderData();
  
  return (
    <>

      <div className="bg-gradient-to-br from-orange-200 to-orange-300 min-h-screen">
        <header className="flex justify-center bg-orange-50 text-white py-4">
          <img
            src="https://sleepyhug.in/cdn/shop/files/Group_1831.png?v=1690469218&width=140"
            className=""
            alt="Logo"
          />
        </header>
        <div className="w-full">
          <img
            src="https://sleepyhug.in/cdn/shop/files/heraBanner1_3x_e0af34ed-32f8-49ac-a35a-c98034d0ba7c_1.webp?v=1713270831"
            className="w-full"
            alt="Banner"
          />

        </div>
      
        <FuzzySearchComponent data={data.names}/>
        <main className="container mx-auto py-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data.categories.map((category) => (
              <Link to={`/category/${category.id}`} key={category.id}>
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

