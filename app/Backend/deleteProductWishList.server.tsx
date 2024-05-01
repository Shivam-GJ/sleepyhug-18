import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { json, redirect } from "@remix-run/node";

export async function DeleteProductWishList(
    email:string,
    product_id:string,
) {
    try {
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `DELETE FROM wishlist
            WHERE email = $1
            AND product_id = $2`,
            [email, product_id]
        );

        if (result instanceof Error) {
            throw new Error("Error querying database delete product from wishlist");
        }
        console.log("wishlist updated successfully (product deleted)");
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load categories" }, 500);
    }
}
