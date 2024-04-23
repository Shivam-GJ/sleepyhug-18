import { IncreaseProductByOne } from "~/Backend/increaseProduct.server";
import { ActionFunction } from "@remix-run/node";

export let action: ActionFunction = async ({ request }) => {
    
    try {
        console.log("action chala")
        const { email, product_id } = await request.json();
        await IncreaseProductByOne({ email, product_id });
      return { response: "200 OK" };
    } catch (error) {
      console.error("Action failed:", error);
      throw error;
    }
  };
  