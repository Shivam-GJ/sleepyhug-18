
import { json, redirect } from "@remix-run/node";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";

export  async function Cart(email:string){
    try {
       
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const cartItems = await postgresDatabaseManager.execute(
            `SELECT DISTINCT c.product_id, c.no_of_product, p.name, p.price, p.image_url
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.email  = $1
            AND c.no_of_product > 0`,
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