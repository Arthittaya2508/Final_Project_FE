"use client";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const TopBanner = () => {
  // สร้างสถานะเพื่อควบคุมการแสดงผลของแบนเนอร์
  const [isVisible, setIsVisible] = useState(true);

  // ฟังก์ชันที่ใช้ปิดแบนเนอร์เมื่อคลิกปุ่ม "close"
  const handleCloseBanner = () => {
    setIsVisible(false);
  };

  // ถ้า isVisible เป็น false จะไม่แสดงแบนเนอร์
  if (!isVisible) return null;

  return (
    <div className="bg-elephant-800 text-white text-center py-2 px-2 sm:px-4 xl:px-0">
      <div className="relative max-w-frame mx-auto">
        <p className="text-xs sm:text-sm">
          สมัครสมาชิกและรับส่วนลด 20% สำหรับการสั่งซื้อครั้งแรกของคุณ{" "}
          <Link href="#" className="underline font-medium">
            สมัครสมาชิก ตอนนี้
          </Link>
        </p>
        <Button
          variant="ghost"
          className="hover:bg-transparent bg-elephant-800 absolute right-0 top-1/2 -translate-y-1/2 w-fit h-fit p-1 hidden sm:flex"
          size="icon"
          type="button"
          aria-label="close banner"
          onClick={handleCloseBanner} // เพิ่ม onClick เพื่อปิดแบนเนอร์
        >
          <Image
            priority
            src="/icons/times.svg"
            height={13}
            width={13}
            alt="close banner"
          />
        </Button>
      </div>
    </div>
  );
};

export default TopBanner;
