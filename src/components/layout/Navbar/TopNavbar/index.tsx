"use client";
import React, { useState } from "react";
import { cn } from "../../../../lib/utils";
import Link from "next/link";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "../../../../components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import RegisterModal from "./RegisterModal"; // Import ModalRegister component

const data: NavMenu = [
  {
    id: 1,
    label: "สินค้าทั้งหมด",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "ผู้ชาย",
        url: "/user/shop#men-clothes",
        description: "เสื้อผ้าดีไซน์เท่ สปอร์ต และทันสมัยสำหรับทุกโอกาส",
      },
      {
        id: 12,
        label: "ผู้หญิง",
        url: "/user/shop#women-clothes",
        description: "แฟชั่นสวยมีสไตล์ ใส่ได้ทุกวัน เพิ่มความมั่นใจให้คุณ",
      },
      {
        id: 13,
        label: "เด็ก",
        url: "/user/shop#kids-clothes",
        description: "เสื้อผ้าสีสันสดใส ใส่สบาย เหมาะกับทุกวัย",
      },
      {
        id: 14,
        label: "อุปกรณ์กีฬา",
        url: "/user/shop#bag-shoes",
        description: "อุปกรณ์คุณภาพ สำหรับทุกกิจกรรมกีฬาและไลฟ์สไตล์",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "ประเภทสินค้า",
    url: "/user/shop#category",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "แบรนด์สินค้า",
    url: "/user/shop#brands",
    children: [],
  },
];

const TopNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [registerModal, setRegisterModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoginForm(true); // Reset to Login form when modal is closed
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/user"
            className={cn(["text-2xl lg:text-[32px] mb-2 mr-3 lg:mr-10"])}
          >
            FF_Shop
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <InputGroup className="hidden md:flex bg-te-papa-green-50 mr-3 lg:mr-10">
          <InputGroup.Text>
            <Image
              priority
              src="/icons/search.svg"
              height={20}
              width={20}
              alt="search"
              className="min-w-5 min-h-5"
            />
          </InputGroup.Text>
          <InputGroup.Input
            type="search"
            name="search"
            placeholder="Search for products..."
            className="bg-transparent placeholder:text-black/40"
          />
        </InputGroup>
        <div className="flex items-center relative">
          <CartBtn />
          <button
            onClick={toggleDropdown} // Toggle dropdown visibility
            className="p-1"
            aria-label="User login"
          >
            <Image
              priority
              src="/icons/user.svg"
              height={100}
              width={100}
              alt="user"
              className="max-w-[22px] max-h-[22px]"
            />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-lg w-48">
              <ul>
                <li>
                  <Link
                    href="/user/userProfile"
                    className="block px-4 py-2 text-sm text-gray-700"
                  >
                    ข้อมูลผู้ใช้
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/myAddress"
                    className="block px-4 py-2 text-sm text-gray-700"
                  >
                    ที่อยู่ของฉัน
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/history"
                    className="block px-4 py-2 text-sm text-gray-700"
                  >
                    ประวัติการสั่งซื้อ
                  </Link>
                </li>
                <hr className="border-t-black/10" />
                <li>
                  {/* Redirect to /guest on logout */}
                  <Link
                    href="/guest"
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                  >
                    ออกจากระบบ
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
