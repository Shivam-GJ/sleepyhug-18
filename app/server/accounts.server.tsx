import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {getRequiredEnvironmentVariable} from "~/common-remix--utilities/utilities.server";
import {getNonEmptyStringFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";

export async function getEmailFromSession(
    token: string,
): Promise<string | null | Error> {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );

    const emailFetchResult = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/get-email`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    const emailFetchResultParsed = await emailFetchResult.json();
    if (emailFetchResultParsed.email == null) {
        return null;
    }

    return emailFetchResultParsed.email;
}

export async function verifyAccessToken(token: string) {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );
    const verifyToken = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/verify-access-token`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    const verifyTokenResult = await verifyToken.json();
    return verifyTokenResult.authorized;
}

export async function getUserIdFromSession(
    token: string,
): Promise<Uuid | null | Error> {
    const formData = new FormData();
    formData.append("token", token);

    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );
    const verifyToken = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/get-user-id-from-session`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    const verifyTokenResult = await verifyToken.json();
    if (
        verifyTokenResult.authorized === true &&
        verifyTokenResult.userId != null
    ) {
        return verifyTokenResult.userId;
    }

    return null;
}

export function getAccountsCallbackUrl() {
    const accountsAuthCallbackRoute = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_CALLBACK_URL"),
    );
    const accountsClientId = getRequiredEnvironmentVariable(
        "GROWTHJOCKEY_ACCOUNTS_CLIENT_ID",
    );
    const redirectBaseUrl = getRequiredEnvironmentVariable("REDIRECT_BASE_URI");

    return `${redirectBaseUrl}/${accountsAuthCallbackRoute}?clientId=${accountsClientId}`;
}

export async function markSessionAsDeleted(token: string) {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );
    const markSessionAsDeletedResult = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/sign-out`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    if (markSessionAsDeletedResult.status !== 200) {
        return new Error("Could not delete session");
    }
}

export async function getProfilePictureFromSession(
    token: string,
): Promise<string | null | Error> {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );

    const profilePictureFetchResult = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/get-profile-picture-from-session`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    const profilePictureFetchResultParsed =
        await profilePictureFetchResult.json();
    return profilePictureFetchResultParsed.profilePicture;
}

export async function getNameFromSession(
    token: string,
): Promise<string | null | Error> {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(
        getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"),
    );

    const profilePictureFetchResult = await fetch(
        `${growthjockeyAccountsBaseUrl}/api/v1/get-name-from-session`,
        {
            method: "POST",
            headers: {
                Authorization: token,
            },
        },
    );

    const profilePictureFetchResultParsed =
        await profilePictureFetchResult.json();
    return profilePictureFetchResultParsed.name;
}
