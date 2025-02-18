"use client";
import ProductTable from "./product";

import React from "react";

function Products() {
  return (
    <div className="flex-1 p-4 ">
      <h1 className="text-xl lg:text-2xl font-bold ">Products</h1>
      <div>
        <ProductTable/>
      </div>
    </div>
  );
}

export default Products;