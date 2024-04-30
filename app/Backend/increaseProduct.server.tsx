import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { json, redirect } from "@remix-run/node";


export async function IncreaseProductByOne(
    email:string,
    product_id:string,
) {
    try {
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `UPDATE cart
        SET no_of_product = no_of_product + 1
        WHERE email = $1
        AND product_id = $2`,
            [email, product_id]
        );

        if (result instanceof Error) {
            throw new Error("Error querying database for categories");
        }
        console.log("cart updated successfully");
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load categories" }, 500);
    }
}
