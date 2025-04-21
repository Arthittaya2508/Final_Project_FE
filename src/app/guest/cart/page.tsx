"use client";

import BreadcrumbCart from "../../../components/cart-page/BreadcrumbCart";
import ProductCard from "../../../components/cart-page/ProductCard";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { integralCF } from "../../../styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import React, { useState } from "react";
import { RootState } from "../../..//lib/store";
import { useAppSelector } from "../../../lib/hooks/redux";
import Link from "next/link";

// ฟังก์ชันนี้แสดงราคาเป็นเงินบาท (THB)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับเปิด-ปิด Modal

  const handleOrderClick = () => {
    setIsModalOpen(true); // เปิด Modal เมื่อคลิกที่ปุ่มสั่งซื้อ
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // ปิด Modal
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
              ])}
            >
              ตะกล้าของคุณ
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  สรุปการสั่งซื้อ
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">รวม</span>
                    <span className="md:text-xl font-bold">
                      {formatPrice(totalPrice)} {/* แสดงราคาเป็น THB */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      ส่วนลด (-
                      {Math.round(
                        ((totalPrice - adjustedTotalPrice) / totalPrice) * 100
                      )}
                      %)
                    </span>
                    <span className="md:text-xl font-bold text-red-600">
                      -{formatPrice(totalPrice - adjustedTotalPrice)}{" "}
                      {/* ส่วนลดใน THB */}
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
                      {formatPrice(adjustedTotalPrice)} {/* แสดงราคาเป็น THB */}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  className="text-sm md:text-base font-medium bg-te-papa-green-800 rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                  onClick={handleOrderClick} // เปิด Modal เมื่อคลิก
                >
                  สั่งซื้อสินค้า{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-te-papa-green-700 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl " />
            <span className="block mb-4">ไม่มีสินค้าในตะกร้า</span>
            <Button
              className="rounded-full w-24 bg-te-papa-green-800 hover:bg-te-papa-green-700"
              asChild
            >
              <Link href="/user/shop">Shop</Link>
            </Button>
          </div>
        )}

        {/* Modal เลือกที่อยู่จัดส่ง */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">
                เลือกที่อยู่สำหรับจัดส่ง
              </h2>

              <div className="mb-4">
                <label className="block text-lg">ชื่อผู้รับ</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="กรุณากรอกชื่อ"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg">เบอร์โทร</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="กรุณากรอกเบอร์โทร"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg">ที่อยู่จัดส่ง</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>เลือกที่อยู่ที่มีในระบบ</option>
                  <option>กรอกที่อยู่ใหม่</option>
                </select>
              </div>

              {/* เลือกขนส่งที่ต้องการจัดส่ง */}
              <div className="mb-4">
                <label className="block text-lg">เลือกขนส่งที่ต้องการ</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>ขนส่งธรรมดา</option>
                  <option>ขนส่งด่วน</option>
                  <option>ขนส่งพิเศษ</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button onClick={handleCloseModal}>ยกเลิก</Button>
                <Button onClick={handleCloseModal}>ยืนยันการสั่งซื้อ</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
