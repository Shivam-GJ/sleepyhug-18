

import type {ActionFunction,LoaderFunction} from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  
  const products = [
    { id: 1, name: 'Product 1', price: 10.99 },
    { id: 2, name: 'Product 2', price: 20.99 },
    { id: 3, name: 'Product 3', price: 30.99 },
  ];
   console.log("shivam")
  return (products);
};
