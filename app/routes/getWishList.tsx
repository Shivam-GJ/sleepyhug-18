import { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getAccessTokenFromCookies } from "~/server/sessionCookieHelper.server";
import { WishList } from "~/Backend/wishlist.server";

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const accessToken = await getAccessTokenFromCookies(request);

        if (accessToken == null) {
            return redirect("/sign-in");
        } else {
            console.log("accessToken hai bhai");
        }

        if (!accessToken.email.endsWith("@growthjockey.com")) {
            throw new Error("Unauthorized access");
        }
        const result =await WishList(accessToken.email);
        return json({result});
    } catch (error) {
        console.error(error);
        return json(error);
    }
};