
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getObjectFromUnknown } from "~/global-common-typescript/utilities/typeValidationUtilities";


export let loader: LoaderFunction = async ({ request }) => {
  const postgresDatabaseManager = await getPostgresDatabaseManager(null);
  if (postgresDatabaseManager instanceof Error) {
    throw new Error("Error connecting to database");
  }
  console.log("connection done");
  // console.log(postgresDatabaseManager.databaseConnectionPool)
  const resultFurniture = await postgresDatabaseManager.execute(
    `SELECT 
         name,price,description
     FROM
         products
    `
  );
  if (resultFurniture instanceof Error) {
    throw new Error("Error querying database collecting data");
  }
  console.log(resultFurniture.rows)
  return (resultFurniture.rows);

};


export let action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.formData();
    const payload = getObjectFromUnknown(body.get("payload"));
    const name = payload.name;
    const description = payload.description;
    const sku = payload.sku;
    const category_id = payload.category_id;
    const inventory_id = payload.inventory_id;
    const price = payload.price;
    const discount_id = payload.discount_id;

    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
      throw new Error("Error connecting to database");
    }
    console.log("connection done");
    const resultFurniture = await postgresDatabaseManager.execute(
      `INSERT INTO products (name, description, sku, category_id, inventory_id, price, discount_id)
      VALUES 
          ($1, $2, $3, $4, $5, $6, $7)`,
      [name, description, sku, category_id, inventory_id, price, discount_id],
    );

    if (resultFurniture instanceof Error) {
      throw new Error("Error querying database : " + Error);
    }
    console.log("Action completed successfully");
    return { response: "200 OK" };
  } catch (error) {
    console.error("Action failed:", error);
    throw error;
  }
};
