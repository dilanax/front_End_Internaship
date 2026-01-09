import React from "react";
import ProductList from "./pages/ProductList.jsx";

export default function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        Product List_
      </h1>
      <ProductList />
    </div>
  );
}
