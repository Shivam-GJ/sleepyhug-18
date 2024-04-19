import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { json, redirect } from "@remix-run/node";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { getPostgresDatabaseManager } from '~/common--database-manager--postgres/postgresDatabaseManager.server';
import { Link } from 'react-router-dom';

type Product = {
  name: number;
  price: string;
  imageUrl: string;
}

export const loader: LoaderFunction = async ({ request,params}) => {
    try {
        const categoryId=params.id;
      // Fetch categories from the database
      const postgresDatabaseManager = await getPostgresDatabaseManager(null);
      if (postgresDatabaseManager instanceof Error) {
        throw new Error("Error connecting to database");
      }
      
      const result = await postgresDatabaseManager.execute(
        `SELECT 
             name,price,image_url,id
        FROM
             products
        WHERE
              category_id = $1`,
       [categoryId],
   );
  
      if (result instanceof Error) {
        throw new Error("Error querying database for categories");
      }
  
      const products: Product[] = result.rows;
  
      return json({ products});
    } catch (error) {
      console.error(error);
      return json({ error: "Failed to load categories" }, 500);
    }
  };

export default function Index() {
    const data = useLoaderData();
  
    return (
      <div className="bg-gradient-to-br from-orange-200 to-orange-300 min-h-screen">
        <header className="flex justify-center bg-orange-50 text-white py-4">
          <img src="https://sleepyhug.in/cdn/shop/files/Group_1831.png?v=1690469218&width=140" className="" alt="Logo"></img>
        </header>
        <div className="w-full">
          <img src="https://sleepyhug.in/cdn/shop/files/heraBanner1_3x_e0af34ed-32f8-49ac-a35a-c98034d0ba7c_1.webp?v=1713270831" className="w-full" alt="Banner"></img>
        </div>
        <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition duration-300 transform hover:scale-105">
                 <div className=""> <img src={product.image_url} alt={product.name} className="mx-auto mb-2 h-24 w-32" /> </div> 
                
                <h2 className="text-l font-semibold text-center">{product.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
       
      </div>
    );
  }
  