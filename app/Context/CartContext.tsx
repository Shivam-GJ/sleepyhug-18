import React, { createContext, useContext, useReducer, useEffect } from "react";

type Product = {
    product_id: string;
    name: string;
    image_url: string;
    price: number;
    no_of_product: number;
};

type CartState = {
    productRow: Product[];
};

type Action =
    | { type: "SET_PRODUCTS"; payload: Product[] }
     | { type: "ADD_PRODUCT"; product: Product }
    | { type: "INCREASE_PRODUCT"; productId: string }
    | { type: "DECREASE_PRODUCT"; productId: string }
    | { type: "DELETE_PRODUCT"; productId: string };

const cartReducer = (state: CartState, action: Action): CartState => {
    switch (action.type) {
        case "SET_PRODUCTS":
            return { ...state, productRow: action.payload };

        case "ADD_PRODUCT":
            console.log("add to cart chla with product id "+ action.product.product_id + JSON.stringify(action.product))

            const existingProduct = state.productRow.find(
                (product) => product.product_id === action.product.product_id
            );
            if (existingProduct) {
                console.log("product exists in cart");
                // If the product is already in the cart, increase its quantity by one
                return {
                    ...state,
                    productRow: state.productRow.map((product) =>
                        product.product_id === action.product.product_id
                            ? {
                                  ...product,
                                  no_of_product: product.no_of_product + 1,
                              }
                            : product
                    ),
                };
            } else {
                // If the product is not in the cart, add it with quantity 1
                console.log("product not exists in cart");
                return {
                    ...state,
                    productRow: [
                        ...state.productRow,
                        { ...action.product, no_of_product: 1 },
                    ],
                };
            }
        case "INCREASE_PRODUCT":
            fetch("/increaseProductByOne", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: action.productId }),
            });
            return {
                ...state,
                productRow: state.productRow.map((product) =>
                    product.product_id === action.productId
                        ? {
                              ...product,
                              no_of_product: product.no_of_product + 1,
                          }
                        : product
                ),
            };
        case "DECREASE_PRODUCT":
            fetch("/decreaseProductByOne", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: action.productId }),
            });

            return {
                ...state,
                productRow: state.productRow
                    .map((product) =>
                        product.product_id === action.productId
                            ? {
                                  ...product,
                                  no_of_product: Math.max(
                                      product.no_of_product - 1,
                                      0
                                  ),
                              }
                            : product
                    )
                    .filter((product) => product.no_of_product > 0),
            };
        case "DELETE_PRODUCT":
            // Send a request to the server to delete the product
            fetch("/deleteProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: action.productId }),
            });

            return {
                ...state,
                productRow: state.productRow.filter(
                    (product) => product.product_id !== action.productId
                ),
            };
        default:
            return state;
    }
};

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<Action>;
}>({
    state: { productRow: [] },
    dispatch: () => null,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(cartReducer, { productRow: [] });

    useEffect(() => {
        fetch(`/getCart/`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data" + data);
                dispatch({ type: "SET_PRODUCTS", payload: data.result });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
