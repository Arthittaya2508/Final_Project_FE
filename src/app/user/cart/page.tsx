"use client";

import BreadcrumbCart from "../../../components/cart-page/BreadcrumbCart";
import ProductCard from "../../../components/cart-page/ProductCard";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { integralCF } from "../../../styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import React from "react";
import { RootState } from "../../..//lib/store";
import { useAppSelector } from "../../../lib/hooks/redux";
import Link from "next/link";

// ฟังก์ชันนี้จะไม่แปลงราคาจาก USD เป็น THB แล้ว
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([integralCF.className, "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6"])}
            >
              ตะกล้าของคุณ
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && <hr className="border-t-black/10" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">สรุปการสั่งซื้อ</h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">รวม</span>
                    <span className="md:text-xl font-bold">
                      {formatPrice(totalPrice)} {/* แสดงราคาใน USD */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      ส่วนลด (-{Math.round(((totalPrice - adjustedTotalPrice) / totalPrice) * 100)}%)
                    </span>
                    <span className="md:text-xl font-bold text-red-600">
                      -{formatPrice(totalPrice - adjustedTotalPrice)} {/* ส่วนลดใน USD */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">ค่าจัดส่ง</span>
                    <span className="md:text-xl font-bold">ฟรี</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black">รวมทั้งหมด</span>
                    <span className="text-xl md:text-2xl font-bold">
                      {formatPrice(adjustedTotalPrice)} {/* แสดงราคาใน USD */}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                >
                  Go to Checkout{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/user/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
