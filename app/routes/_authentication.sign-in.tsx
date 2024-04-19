import type {LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {useEffect} from "react";
import {getRequiredEnvironmentVariable} from "~/common-remix--utilities/utilities.server";
import {getNonEmptyStringFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";
import {getAccessTokenFromCookies} from "~/server/sessionCookieHelper.server";
import {AccountsPages} from "~/utilities/typeDefinitions";
import {showErrorToast} from "~/utilities/utilities";

type LoaderData = {
    authCallbackUrl: string;
};

export const loader: LoaderFunction = async ({request}) => {
    const accessToken = await getAccessTokenFromCookies(request);

    if (accessToken != null) {
        return redirect("/");
    }

    const authCallbackUrl = getAccountsRedirectUrl(AccountsPages.googleSignIn);

    const loaderData: LoaderData = {
        authCallbackUrl: authCallbackUrl,
    };

    return json(loaderData);
};

export default function () {
    const {authCallbackUrl} = useLoaderData() as LoaderData;

    useEffect(() => {
        if (localStorage != undefined) {
            window.addEventListener("message", function (event) {
                if (event.data.source != null && event.data.source.startsWith("react-devtools")) {
                    return;
                }

                showErrorToast(
                    "Error",
                    event.data.message,
                    // {
                    //     toastId: "from-iframe",
                    // },
                );
                console.log("4d4a10aa-80c7-42e5-b6ff-46b030c2a214");
                console.log(event.data);
            });
        }
    }, []);

    return (
        <div className="tw-px-4 tw-w-full tw-max-w-lg tw-mx-auto">
            shivam
            <SignInWithGoogle authCallbackUrl={authCallbackUrl} />
        </div>
    );
}

function SignInWithGoogle({className, authCallbackUrl}: {className?: string; authCallbackUrl: string}) {
    return (
        <div className={className}>
            <div className="tw-h-[31.25rem]">
                <iframe
                    title="accounts"
                    src={authCallbackUrl}
                    className={"tw-h-full tw-w-full tw-rounded-xl"}
                ></iframe>
            </div>
        </div>
    );
}

function getAccountsRedirectUrl(accountPage: AccountsPages) {
    const growthjockeyAccountsBaseUrl = getNonEmptyStringFromUnknown(getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_BASE_URL"));
    const redirectBaseUrl = getNonEmptyStringFromUnknown(getRequiredEnvironmentVariable("WEBSITE_BASE_URL"));
    const authCallbackUrl = getNonEmptyStringFromUnknown(getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_CALLBACK_URL"));
    const clientId = getNonEmptyStringFromUnknown(getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_CLIENT_ID"))

    const redirectUrl = `${growthjockeyAccountsBaseUrl}/v1/${accountPage}?callbackUrl=${redirectBaseUrl}/${authCallbackUrl}&clientId=${clientId}`;

    return redirectUrl;
}

