import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import type {MetaFunction} from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";


import "~/tailwind.css";
// Ensure this is always below tailwind styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export const meta: MetaFunction = () => {
    const title = "Sleepyhug";

    return [{title: title}, {property: "og:title", content: title}];
};

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                {/* TODO: Shift to links */}
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />

                <Meta />
                <Links />

                <ColorSchemeScript defaultColorScheme="dark" />
            </head>

            <body className="tw-bg-ap-background tw-text-ap-foreground tw-text-base tw-dark tw-h-screen" >
                <MantineProvider defaultColorScheme="dark">
                    <Notifications
                        position="top-right"
                        autoClose={5000}
                        zIndex={1000}
                    />

                    <Outlet />

                    <ScrollRestoration />
                    <Scripts />
                </MantineProvider>
            </body>
        </html>
    );
}




















