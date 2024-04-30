import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { json, redirect } from "@remix-run/node";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export async function DecreaseProductByOne(
    email:string,
    product_id:string,
) {
    try {
        const postgresDatabaseManager = await getPostgresDatabaseManager(null);
        if (postgresDatabaseManager instanceof Error) {
            throw new Error("Error connecting to database");
        }
        const firstResult=await postgresDatabaseManager.execute(
            `SELECT no_of_product
            FROM cart 
            WHERE email = $1
            AND product_id = $2`,
                [email, product_id]
        )

        const number =firstResult.rows[0].no_of_product;
        console.log(number)
        if(number==1){
            const result = await postgresDatabaseManager.execute(
                `DELETE FROM cart
                WHERE email = $1
                AND product_id = $2`,
                [email, product_id]
            );

            if (result instanceof Error) {
                throw new Error("Error querying database ");
            }
            console.log("cart updated successfully and product deleted");
        }

        const result = await postgresDatabaseManager.execute(
            `UPDATE cart
        SET no_of_product = no_of_product - 1
        WHERE email = $1
        AND product_id = $2`,
            [email, product_id]
        );



        if (result instanceof Error) {
            throw new Error("Error querying database");
        }
        console.log("cart updated successfully");
    } catch (error) {
        console.error(error);
        return json({ error: "Failed to load categories" }, 500);
    }
}
