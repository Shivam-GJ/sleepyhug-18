import type {LoaderFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {commitSessionCookie, getSessionCookie} from "~/server/sessionCookie.server";
import {getAccessTokenFromCookies} from "~/server/sessionCookieHelper.server";
import {markSessionAsDeleted} from "~/server/accounts.server";

export const loader: LoaderFunction = async ({request}) => {
    const urlSearchParams = new URL(request.url).searchParams;

    const redirectTo = urlSearchParams.get("redirectTo");

    const sessionCookie = await getSessionCookie(request.headers.get("Cookie"));

    const accessToken = await getAccessTokenFromCookies(request);
    if (!(accessToken instanceof Error) && accessToken != null) {
        await markSessionAsDeleted(accessToken.token);
    }

    sessionCookie.unset("accessToken");
    // session.unset("refreshToken");

    return redirect(redirectTo ?? "/", {
        headers: {
            "Set-Cookie": await commitSessionCookie(sessionCookie),
        },
    });
};
