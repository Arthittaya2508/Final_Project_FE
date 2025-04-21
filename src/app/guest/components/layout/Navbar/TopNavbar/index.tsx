"use client";
import React, { useState } from "react";
import { cn } from "../../../../../../lib/utils";
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
import RegisterModal from "./RegisterModal"; // Import RegisterModal component
import Swal from "sweetalert2"; // Import SweetAlert2

const data: NavMenu = [
  {
    id: 1,
    label: "สินค้าทั้งหมด",
    type: "MenuList",
    children: [
      { id: 11, label: "ผู้ชาย", url: "/guest/shop#men-clothes" },
      { id: 12, label: "ผู้หญิง", url: "/guest/shop#women-clothes" },
      { id: 13, label: "เด็ก", url: "/guest/shop#kids-clothes" },
      { id: 14, label: "อุปกรณ์กีฬา", url: "/guest/shop#bag-shoes" },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "ประเภทสินค้า",
    url: "/guest/shop#on-sale",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "แบรนด์สินค้า",
    url: "/guest/shop#brands",
    children: [],
  },
];

const TopNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const mockUsername = "jayping"; // Mocked username
  const mockPassword = "123456"; // Mocked password

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoginForm(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock login check
    if (username === mockUsername && password === mockPassword) {
      // ถ้าชื่อผู้ใช้และรหัสผ่านตรงกับที่ mock ไว้
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "คุณเข้าสู่ระบบสำเร็จแล้ว.",
      });
      setIsModalOpen(false); // ปิด modal หลังจาก login สำเร็จ
    } else {
      // ถ้าไม่ตรง
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/guest"
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
        <div className="flex items-center">
          <button
            onClick={() => setIsModalOpen(true)}
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
        </div>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[300px] md:w-[400px] relative">
            <h2 className="text-center text-xl font-semibold mb-4">
              {isLoginForm ? "Login" : "Register"}
            </h2>
            {isLoginForm ? (
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p
                  className="text-blue-500 cursor-pointer text-center mb-4"
                  onClick={() => setIsLoginForm(false)}
                >
                  สมัครสมาชิก
                </p>
                {loginError && (
                  <p className="text-red-500 text-center">{loginError}</p>
                )}
                <Link href="/user">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md"
                  >
                    Login
                  </button>
                </Link>
              </form>
            ) : (
              <RegisterModal isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600"
              title="Close Modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
