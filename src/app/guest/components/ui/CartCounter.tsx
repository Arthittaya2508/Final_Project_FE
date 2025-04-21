"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { cn } from "../../../../lib/utils";
import { useAppDispatch } from "../../../../lib/hooks/redux";
import { updateStock } from "@/lib/features/products/productsSlice"; // นำเข้า updateStock จาก productsSlice

type CartCounterProps = {
  isZeroDelete?: boolean;
  onAdd?: (value: number) => void;
  onRemove?: (value: number) => void;
  className?: string;
  initialValue?: number;
  productId: number; // เพิ่ม productId เพื่อลด stock
};

const CartCounter = ({
  isZeroDelete,
  onAdd,
  onRemove,
  className,
  initialValue = 1,
  productId,
}: CartCounterProps) => {
  const [counter, setCounter] = useState<number>(initialValue);
  const dispatch = useAppDispatch();

  const addToCart = () => {
    setCounter((prev) => prev + 1);
    dispatch(updateStock({ id: productId, change: 1 })); // ลด stock ลง 1
    if (onAdd) onAdd(counter + 1);
  };

  const remove = () => {
    if ((counter === 1 && !isZeroDelete) || counter <= 0) return;

    setCounter((prev) => prev - 1);
    dispatch(updateStock({ id: productId, change: -1 })); // เพิ่ม stock คืน 1
    if (onRemove) onRemove(counter - 1);
  };

  return (
    <div
      className={cn(
        "bg-[#F0F0F0] w-full min-w-[110px] max-w-[110px] sm:max-w-[170px] py-3 md:py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={remove}
      >
        <FaMinus />
      </Button>
      <span className="font-medium text-sm sm:text-base">{counter}</span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={addToCart}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default CartCounter;
