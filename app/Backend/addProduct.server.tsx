import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { json, redirect } from "@remix-run/node";

export async function AddProduct({
    email,
    product_id,
}: {
    email: string;
    product_id: number;
}) {
    try {
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }

        const result = await postgresDatabaseManager.execute(
            `SELECT 
             product_id
        FROM
             cart
             WHERE email = $1
             AND product_id = $2`,
            [email, product_id]
        );

        if (result instanceof Error) {
            throw new Error("Error querying database for categories");
        }

        // console.log(result);
        if (result.rows.length != 0) {
            console.log("product exists");
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
        } else {
            console.log("product to be added");
            const result = await postgresDatabaseManager.execute(
                `INSERT INTO cart (email, product_id, no_of_product)
            VALUES ($1, $2, $3)`,
                [email, product_id, 1]
            );

            if (result instanceof Error) {
                throw new Error("Error querying database for categories");
            }
        }
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to add product to cart" }, 500);
    }
}
