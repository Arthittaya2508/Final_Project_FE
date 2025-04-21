import { cn } from "../../../../../lib/utils";
import { integralCF } from "../../../../../styles/fonts";
import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import Link from "next/link";
import LayoutSpacing from "./LayoutSpacing";

const socialsData = [
  {
    id: 1,
    icon: <FaFacebookF />,
    url: "https://facebook.com",
  },
  {
    id: 2,
    icon: <FaInstagram />,
    url: "https://instagram.com",
  },
  {
    id: 3,
    icon: <BsFillTelephoneFill />,
    url: "tel:+11234567890",
  },
  {
    id: 4,
    icon: <FaLocationDot />,
    url: "https://maps.app.goo.gl/JQ21143fuypn7iM8A",
  },
];

const Footer = () => {
  return (
    <footer className="bg-te-papa-green-50 pt-8 pb-4">
      <div className="max-w-frame mx-auto text-center">
        <nav className="mb-2 flex flex-col items-center">
          <div className="flex flex-col items-center mb-1">
            <h1
              className={cn([
                integralCF.className,
                "text-[28px] lg:text-[32px] mb-6",
              ])}
            >
              เฟื่องฟู สปอร์ต
            </h1>
            <p className="text-black/60 text-sm mb-9 max-w-md">
              เราคัดสรรเสื้อผ้าและอุปกรณ์กีฬาเกรดคุณภาพที่ทำให้คุณภูมิใจไม่ว่าจะเป็นแฟชั่นสไตล์การออกไปข้างนอกหรือชุดกีฬาเฉพาะทาง
              พร้อมด้วยอุปกรณ์กีฬาอย่างรองเท้า, ชุดออกกำลังกาย, ถุงมือ
              ที่ช่วยเพิ่มประสิทธิภาพในการเล่นกีฬา.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center space-x-4">
            {socialsData.map((social) => (
              <Link
                href={social.url}
                key={social.id}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-te-papa-green-700 hover:text-white transition-all w-12 h-12 rounded-full border border-black/20 flex items-center justify-center p-1.5"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <LayoutSpacing />
    </footer>
  );
};

export default Footer;
