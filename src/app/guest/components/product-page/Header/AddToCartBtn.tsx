"use client";

import { addToCart } from "../../../../../lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../lib/hooks/redux";
import { RootState } from "../../../../../lib/store";
import { Product } from "../../../../../types/product.types";
import React from "react";
import Swal from "sweetalert2"; // นำเข้า sweetalert2

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  // ฟังก์ชันเช็คการเข้าสู่ระบบ (กรณีนี้จะใช้ตัวแปรสถานะการเข้าสู่ระบบเป็นตัวอย่าง)
  const isLoggedIn = false; // เปลี่ยนเป็นสถานะจริงของผู้ใช้ที่เข้าสู่ระบบ

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      // แสดง SweetAlert หากยังไม่ได้เข้าสู่ระบบ
      Swal.fire({
        icon: "warning",
        title: "ไม่สามารถเพิ่มสินค้าในตะกร้าได้",
        text: "กรุณาเข้าสู่ระบบเพื่อสั่งซื้อ",
        confirmButtonText: "ตกลง",
      });
    } else {
      // หากผู้ใช้เข้าสู่ระบบแล้ว สามารถเพิ่มสินค้าในตะกร้าได้
      dispatch(
        addToCart({
          id: data.id,
          name: data.title,
          srcUrl: data.srcUrl,
          price: data.price,
          attributes: [sizeSelection, colorSelection.name],
          discount: data.discount,
          quantity: data.quantity,
        })
      );
    }
  };

  return (
    <button
      type="button"
      className="bg-te-papa-green-800 w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-te-papa-green-700 transition-all"
      onClick={handleAddToCart}
    >
      เพิ่มลงตะกร้า
    </button>
  );
};

export default AddToCartBtn;
