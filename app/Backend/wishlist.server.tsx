
import { json, redirect } from "@remix-run/node";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";

export  async function WishList(email:string){
    try {
       
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const cartItems = await postgresDatabaseManager.execute(
            `SELECT DISTINCT w.product_id,p.name, p.price, p.image_url
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.email  = $1
           `,
            [email]
        );
        if (cartItems instanceof Error) {
            throw new Error("Error querying database for cart items");
        }
        console.log(cartItems.rows)
        const row=cartItems.rows;
        return (row);
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load the cart items" }, 500);
    }
};