import { IncreaseProductByOne } from "~/Backend/increaseProduct.server";
import { ActionFunction } from "@remix-run/node";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { redirect } from "@remix-run/node";

export let action: ActionFunction = async ({ request }) => {
    
    try {
      console.log("action run for increasing the product by one")
      const accessToken = await getAccessTokenFromCookies(request);
        if (accessToken == null) {
          return redirect("/sign-in");
      } 
      if (!accessToken.email.endsWith("@growthjockey.com")) {
          throw new Error("Unauthorized access");
      }
        const userEmail=accessToken.email
        const {  product_id } = await request.json();
       
        await IncreaseProductByOne( userEmail , product_id );
      return { response: "200 OK" };
    } catch (error) {
      console.error("Action failed:", error);
      throw error;
    }
  };
  