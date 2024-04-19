import {createCookieSessionStorage} from "@remix-run/node";
import {getIntegerFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";

// TODO: Cache these as global variables?
const {getSession: getSessionCookie, commitSession: commitSessionCookie, destroySession: destroySessionCookie} = createCookieSessionStorage({
    cookie: {
        name: "__session",
        // domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        maxAge: getIntegerFromUnknown(process.env.COOKIE_MAX_AGE),
        path: "/",
        sameSite: "strict",
        secrets: [process.env.SESSION_SECRET],
        secure: true,
    },
});

export {getSessionCookie, commitSessionCookie, destroySessionCookie};
