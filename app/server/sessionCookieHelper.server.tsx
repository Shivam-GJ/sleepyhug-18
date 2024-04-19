import {NonEmptyString, Uuid} from "~/common--type-definitions/typeDefinitions";
import {getRequiredEnvironmentVariable} from "~/common-remix--utilities/utilities.server";
import {getSessionCookie} from "~/server/sessionCookie.server";
import {getTtlCache} from "~/growth-jockey-common-typescript/server/cache.server";
import {getEmailFromSession, getProfilePictureFromSession, getUserIdFromSession, verifyAccessToken} from "~/server/accounts.server";

// export const zodAccessToken = zod.object();
export type AccessToken = {
    token: string;
    userId: Uuid;
    email: string;
    profilePicture: string;
    // TODO: Figure out what the future of schemaVersion will be
    // schemaVersion: NonEmptyString;
};

export async function getAccessTokenFromCookies(request: Request): Promise<AccessToken | null> {
    const session = await getSessionCookie(request.headers.get("Cookie"));

    if (!session.has("accessToken")) {
        return null;
    }

    // TODO: Remove caching, added temporarily
    const ttlCache = getTtlCache();
    if (ttlCache.has(session.get("accessToken"))) {
        return ttlCache.get(session.get("accessToken"));
    }
    //

    // const accessToken = safeParse(getObjectFromUnknown, session.get("accessToken"));
    // if (accessToken == null) {
    // return null;
    // }

    const verifyAccessTokenResult = await verifyAccessToken(session.get("accessToken"));
    if (verifyAccessTokenResult instanceof Error) {
        return null;
        // return verifyAccessTokenResult;
    }

    if (verifyAccessTokenResult === false) {
        return null;
        // return new Error("Invalid token");
    }

    const userId = await getUserIdFromSession(session.get("accessToken"));
    if (userId instanceof Error || userId == null) {
        return null;
    }

    const email = await getEmailFromSession(session.get("accessToken"));
    if (email instanceof Error || email == null) {
        return null;
    }

    const profilePicture = await getProfilePictureFromSession(session.get("accessToken"));
    if (profilePicture instanceof Error || profilePicture == null) {
        return null;
    }

    const accessToken: AccessToken = {
        token: session.get("accessToken"),
        userId: userId as Uuid,
        email: email,
        profilePicture: profilePicture,
        // schemaVersion: getRequiredEnvironmentVariable("COOKIE_SCHEMA_VERSION"),
    };

    // TODO: Remove caching, added temporarily
    const ttl = 3600000; // Set in milliseconds
    ttlCache.set(session.get("accessToken"), accessToken, {ttl: ttl})
    //

    return accessToken;

    // return await decodeAccessToken(accessToken);
}
