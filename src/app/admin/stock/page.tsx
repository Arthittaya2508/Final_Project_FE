"use client";

import React, { useEffect, useState } from "react";

type Product = {
  pro_id: number;
  sku: string;
  pro_name: string;
  pro_des: string;
  category_id: number;
  brand_id: number;
  gender_id: number;
};

type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  pro_image: string;
};

type ItemProductDetail = {
  item_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
  detail_id: number;
};

type Color = {
  color_id: number;
  color_name: string;
};

type Size = {
  size_id: number;
  size_name: string;
};

type StockItem = {
  sku: string;
  image: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
};

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [colorRes, sizeRes] = await Promise.all([
          fetch(`${API_URL}/colors`),
          fetch(`${API_URL}/sizes`),
        ]);
        const colors: Color[] = await colorRes.json();
        const sizes: Size[] = await sizeRes.json();

        const colorMap = new Map(colors.map((c) => [c.color_id, c.color_name]));
        const sizeMap = new Map(sizes.map((s) => [s.size_id, s.size_name]));

        const res = await fetch(`${API_URL}/products`);
        const products: Product[] = await res.json();

        const stockItems: StockItem[] = [];

        for (const product of products) {
          const detailRes = await fetch(
            `${API_URL}/product_details?pro_id=${product.pro_id}`
          );
          const details: ProductDetail[] = await detailRes.json();

          for (const detail of details) {
            const itemRes = await fetch(
              `${API_URL}/product_detail_items?pro_detail_id=${detail.pro_detail_id}`
            );
            const items: ItemProductDetail[] = await itemRes.json();

            for (const item of items) {
              stockItems.push({
                sku: product.sku,
                image: detail.pro_image,
                name: product.pro_name,
                color:
                  colorMap.get(detail.color_id) || `Color ${detail.color_id}`,
                size: sizeMap.get(item.size_id) || `Size ${item.size_id}`,
                quantity: item.stock_quantity,
              });
            }
          }
        }

        setStockData(stockItems);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, [API_URL]);

  // Pagination Logic
  const totalItems = stockData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = stockData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalQuantity = stockData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">สต๊อกสินค้า</h1>
      <p className="mb-4 text-gray-700">
        สินค้าทั้งหมดในร้าน:{" "}
        <span className="font-semibold">{totalQuantity}</span> ชิ้น
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">รูปสินค้า</th>
              <th className="px-4 py-2">ชื่อสินค้า</th>
              <th className="px-4 py-2">สี / ขนาด</th>
              <th className="px-4 py-2">จำนวนคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => {
              const isLowStock = item.quantity <= 10;
              return (
                <tr
                  key={index}
                  className={`border-t ${
                    isLowStock ? "bg-red-100 text-red-600" : ""
                  }`}
                >
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">
                    {item.image ? (
                      item.image.startsWith("data:image/") ? (
                        <img src={item.image} alt="Product" width={100} />
                      ) : (
                        <img
                          src={`/images/${item.image}`}
                          alt="Product"
                          width={100}
                        />
                      )
                    ) : (
                      "ไม่มีรูปภาพ"
                    )}
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    {item.color} / {item.size}
                  </td>
                  <td className="px-4 py-2">{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        <span className="text-gray-700">
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default StockPage;
