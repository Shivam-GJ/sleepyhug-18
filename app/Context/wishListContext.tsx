import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useCart } from "./cartContext";
type Product = {
    product_id: string;
    name: string;
    image_url: string;
    price: number;
};

// const {state,dispatch}=useCart();

type WishListState = {
    productRow: Product[];
};

type Action =
    | { type: "SET_PRODUCTS"; payload: Product[] }
    | { type: "ADD_PRODUCT"; product: Product }
    | { type: "DELETE_PRODUCT"; productId: string }
    | { type: "MOVE_PRODUCT"; productId: string };

const wishListReducer = (
    state: WishListState,
    action: Action
): WishListState => {
    switch (action.type) {
        case "SET_PRODUCTS":
            return { ...state, productRow: action.payload };

        case "ADD_PRODUCT":
            const existingProduct = state.productRow.find(
                (product) => product.product_id === action.product.product_id
            );

            if (existingProduct) {
                console.log("product exists in cart");
                // If the product is already in the cart, increase its quantity by one
                return state;
            } else {
                fetch("/addProductWishList", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ product_id: action.product.product_id }),
                });
                
                return {
                    ...state,
                    productRow: [...state.productRow, action.product],
                };
            }

        case "MOVE_PRODUCT":
            // Send a request to the server to delete the product
            fetch("/deleteProductWishList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: action.productId }),
            });

            fetch("/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: action.productId }),
            });
            console.log('move')
            const productToMove = state.productRow.find(
                (product) => product.product_id == action.productId
            );

            if (productToMove) {
                console.log("product to move run")
            // const { dispatch } = useCart(); 

            //  dispatch({ type: "ADD_PRODUCT", product: { 
            //     product_id: productToMove.product_id,
            //     name: productToMove.name,
            //     image_url: productToMove.image_url,
            //     price: productToMove.price,
            //     no_of_product: 1 
            // }  });
                     } 
            return {
                ...state,
                productRow: state.productRow.filter(
                    (product) => product.product_id !== action.productId
                ),
            };

        case "DELETE_PRODUCT":
            // Send a request to the server to delete the product
            fetch("/deleteProductWishList", {
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

const WishListContext = createContext<{
    state: WishListState;
    dispatch2: React.Dispatch<Action>;
}>({
    state: { productRow: [] },
    dispatch2: () => null,
});

export const WishListProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch2] = useReducer(wishListReducer, { productRow: [] });

    useEffect(() => {
        fetch(`/getWishList/`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data" + data);
                dispatch2({ type: "SET_PRODUCTS", payload: data.result });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <WishListContext.Provider value={{ state, dispatch2 }}>
            {children}
        </WishListContext.Provider>
    );
};

export const useWishList = () => useContext(WishListContext);
