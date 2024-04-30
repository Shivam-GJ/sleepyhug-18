
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { CartProvider } from "./Context/CartContext";

startTransition(() => {
  hydrateRoot(
    document,
    <CartProvider>
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
    </CartProvider>
  );
});
