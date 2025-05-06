"use client";

import React, { useState, useEffect } from "react";
import NotificationModal from "../Notification";

type StockItem = {
  sku: string;
  image: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
};

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [colorRes, sizeRes, productRes] = await Promise.all([
          fetch(`${API_URL}/colors`),
          fetch(`${API_URL}/sizes`),
          fetch(`${API_URL}/products`),
        ]);

        const colors = await colorRes.json();
        const sizes = await sizeRes.json();
        const products = await productRes.json();

        const colorMap = new Map(
          colors.map((c: any) => [c.color_id, c.color_name])
        );
        const sizeMap = new Map(
          sizes.map((s: any) => [s.size_id, s.size_name])
        );

        const lowStockItems: string[] = [];

        for (const product of products) {
          const detailRes = await fetch(
            `${API_URL}/product_details?pro_id=${product.pro_id}`
          );
          const details = await detailRes.json();

          for (const detail of details) {
            const itemRes = await fetch(
              `${API_URL}/product_detail_items?pro_detail_id=${detail.pro_detail_id}`
            );
            const items = await itemRes.json();

            for (const item of items) {
              if (item.stock_quantity <= 10) {
                const color =
                  colorMap.get(detail.color_id) || `Color ${detail.color_id}`;
                const size =
                  sizeMap.get(item.size_id) || `Size ${item.size_id}`;
                lowStockItems.push(
                  `${product.pro_name} - ${color} / ${size} เหลือ ${item.stock_quantity} ชิ้น`
                );
              }
            }
          }
        }

        setNotifications(lowStockItems);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, [API_URL]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl ml-10 font-bold">
          เฟื่องฟู สปอร์ต
        </div>
        <div className="relative">
          <svg
            onClick={() => setIsModalOpen(true)}
            className="w-6 h-6 mr-8 text-white cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a7.002 7.002 0 00-5-6.709V4a2 2 0 10-4 0v.291C7.67 5.099 6 7.388 6 10v4.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 21h-2v-2h2v2z"
            />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-8 block h-2 w-2 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
      />
    </nav>
  );
};

export default Navbar;
