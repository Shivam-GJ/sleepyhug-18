import { AddProduct } from "~/Backend/addProduct.server";
import { ActionFunction } from "@remix-run/node";

export let action: ActionFunction = async ({ request }) => {
    
    try {
        console.log("action chala")
        const { email, product_id } = await request.json();
        await AddProduct({ email, product_id });
      return { response: "200 OK" };
    } catch (error) {
      console.error("Action failed:", error);
      throw error;
    }
  };
  