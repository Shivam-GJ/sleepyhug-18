import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getObjectFromUnknown } from "~/global-common-typescript/utilities/typeValidationUtilities";
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
export let loader: LoaderFunction = async ({ request, params }) => {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        throw new Error("Error connecting to database");
    }
    console.log("connection done");
    const productId = params.id;
    const resultFurniture = await postgresDatabaseManager.execute(
        `SELECT 
         name,price,description
     FROM
         products
     WHERE
        id = $1`,
        [productId],
    );
    if (resultFurniture instanceof Error) {
        throw new Error("Error querying database collecting data");
    }
    console.log(resultFurniture.rows[0])
    return (resultFurniture.rows[0]);
};


export let action: ActionFunction = async ({ request, params }) => {
    const productId = params.id;
    if (request.method === 'PUT') {
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
              `UPDATE products
              SET name = $1, description = $2, sku = $3, category_id = $4, inventory_id = $5, price = $6, discount_id = $7
              WHERE id = $8;
              `,
              [name, description, sku, category_id, inventory_id, price, discount_id,productId],
            );
        
            if (resultFurniture instanceof Error) {
              throw new Error("Error querying database : " + Error);
            }
            return { message: "Resource updated successfully" };
        } catch (error) {
            console.error("Update failed:", error);
            return { error: "Failed to update resource" };
        }
    } else if (request.method === 'DELETE') {
        try {
            const postgresDatabaseManager = await getPostgresDatabaseManager(null);
            if (postgresDatabaseManager instanceof Error) {
                throw new Error("Error connecting to database");
            }
            console.log("connection done");
            const productId = params.id;
            const result = await postgresDatabaseManager.execute(
                `DELETE FROM products WHERE id = $1`,
                [productId]
            );
            
            if (result instanceof Error) {
                throw new Error("Error querying database collecting data");
            }
            console.log(result)
            return { message: "Resource deleted successfully" };
        } catch (error) {
            console.error("Delete failed:", error);
            return { error: "Failed to delete resource" };
        }
    } else {

    }
};

