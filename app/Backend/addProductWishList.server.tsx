import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { json, redirect } from "@remix-run/node";

export async function AddProductWishList(
    email:string,
    product_id:string) {
    try {
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `SELECT 
             product_id
        FROM
             wishlist
             WHERE email = $1
             AND product_id = $2`,
            [email, product_id]
        );

        if (result instanceof Error) {
            throw new Error("Error querying database for categories");
        }

        // console.log(result);
        if (result.rows.length != 0) {
            console.log("product exists in wishlist");
           
        } else {
            console.log("product to be added in wishlist");
            const result = await postgresDatabaseManager.execute(
                `INSERT INTO wishlist (email, product_id)
            VALUES ($1, $2)`,
                [email, product_id]
            );

            if (result instanceof Error) {
                throw new Error("Error querying database for adding product to wishlist");
            }
        }
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to add product to wishlist" }, 500);
    }
}
