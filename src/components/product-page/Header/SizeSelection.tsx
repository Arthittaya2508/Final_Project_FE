"use client";

import { setSizeSelection } from "../../../lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import { RootState } from "../../../lib/store";
import { cn } from "../../../lib/utils";
import React from "react";

const SizeSelection = () => {
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        เลือกขนาดไซส์
      </span>
      <div className="flex items-center flex-wrap lg:space-x-3">
        {["S", "M", "L", "XL"].map((size, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              "bg-te-papa-green-100 flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full m-1 lg:m-0 max-h-[46px]",
              sizeSelection === size &&
                "bg-te-papa-green-800 font-medium text-white",
            ])}
            onClick={() => dispatch(setSizeSelection(size))}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
