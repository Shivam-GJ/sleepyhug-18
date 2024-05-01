
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { CartProvider } from "./Context/cartContext";
import { WishListProvider } from "./Context/wishListContext";

startTransition(() => {
  hydrateRoot(
    document,
    <WishListProvider>
    
    <CartProvider>
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
    </CartProvider>
    </WishListProvider>
  );
});
