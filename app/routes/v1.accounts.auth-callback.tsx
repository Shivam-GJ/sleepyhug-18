import React from 'react'
import type {LoaderFunction} from "@remix-run/node";
import {useNavigate} from "@remix-run/react";
import Cryptr from "cryptr";
import {useEffect} from "react";

import {  getRequiredEnvironmentVariable } from "../common-remix--utilities/utilities.server"
import {commitSessionCookie, getSessionCookie} from "../server/sessionCookie.server";
import {safeParse, getStringFromUnknown} from "../global-common-typescript/utilities/typeValidationUtilities";

export const loader: LoaderFunction = async ({request}) => {
    const urlSearchParams = new URL(request.url).searchParams;

    const token = safeParse(getStringFromUnknown, urlSearchParams.get("token"));
    if (token == null) {
        return null;
    }

    const cryptr = new Cryptr(getRequiredEnvironmentVariable("GROWTHJOCKEY_ACCOUNTS_CLIENT_SECRET"));;
    const decrypted = cryptr.decrypt(token);

    const cookieSession = await getSessionCookie(request.headers.get("Cookie"));
    cookieSession.set("accessToken", decrypted);

    return new Response(null, {
        headers: {
            "Set-Cookie": await commitSessionCookie(cookieSession),
        },
    });
};

export default function AuthCallback() {
    // TODO: Figure out why cookies are not propagated without this
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");
    }, []);

    // return <div className="h-full tw-w-full tw-grid tw-place-items-center tw-text-3xl">Loading...</div>;
    return (
        <div className="fixed inset-0 z-[999] bg-[#000000dd] flex flex-col items-center justify-center">
            <div className="text-[3rem]">
                <main className="flex justify-around align-baseline p-[3em_1em_3em_1em]">
                    <section>
                        <div className="inline-block">
                        
                            <p className="text-[1.5em] font-bold leading-[0.55] is-loading-bounce m-[0_-1.5px] text-left text-[#4361ee] font-1\.5rem">.</p>
                            <p className="text-center text-[1em] m-0 font-bold text-white leading-[0.55]">Sleepyhug</p>
                            <p className="text-[#4361ee] text-[0.25em] m-[10px_0]">By Shivam</p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
      
    );
}
