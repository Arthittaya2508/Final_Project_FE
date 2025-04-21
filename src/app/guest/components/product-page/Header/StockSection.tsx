"use client";

import React from "react";
import { useAppSelector } from "../../../../../lib/hooks/redux";
import { RootState } from "../../../../../lib/store";
import { Product } from "../../../../../types/product.types";

const StockSection = ({ data }: { data: Product }) => {
  const stock =
    useAppSelector((state: RootState) => state.products.stock) || {}; // ใช้ useAppSelector
  const productStock = stock[data.id] ?? 0;

  return (
    <div className="text-sm text-gray-700 mt-2">
      คงเหลือในสต็อก: <span className="font-semibold">{productStock}</span> ชิ้น
    </div>
  );
};

export default StockSection;
