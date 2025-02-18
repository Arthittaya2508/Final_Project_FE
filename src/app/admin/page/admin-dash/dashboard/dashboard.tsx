"use client";
import Link from "next/link";
import React from "react";

const Dashboard: React.FC = () => {
  const orderStatuses = [
    { label: "ออเดอร์ที่ยังไม่ได้รับ", count: 20, bgColor: "bg-yellow-400" },
    { label: "ที่กำลังจัดเตรียม", count: 15, bgColor: "bg-orange-400" },
    { label: "รอขนส่งมารับ", count: 10, bgColor: "bg-blue-400" },
    { label: "ออเดอร์ที่จัดส่งแล้ว", count: 25, bgColor: "bg-indigo-400" },
    { label: "ออเดอร์ที่ส่งเรียบร้อย", count: 18, bgColor: "bg-green-400" },
    { label: "ออเดอร์ที่ยกเลิก", count: 5, bgColor: "bg-red-400" },
    // { label: "ออเดอร์ทั้งหมด", count: 110, bgColor: "bg-blue-400" },
  ];

  const orders = [
    {
      orderNumber: "001",
      customerName: "John Doe",
      deliveryAddress: "123 Main St, Bangkok",
      totalPrice: 500,
      orderStatus: "จัดส่งแล้ว",
      productDetails: "Product A, Product B",
      orderDateTime: "2024-08-11 14:30:00",
    },
    {
      orderNumber: "002",
      customerName: "Jane Smith",
      deliveryAddress: "456 Another St, Bangkok",
      totalPrice: 300,
      orderStatus: "ยังไม่ได้รับ",
      productDetails: "Product C",
      orderDateTime: "2024-08-11 15:00:00",
    },
  ];

  return (
    <div className="p-6 ml-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        {orderStatuses.map((status) => (
          <div
            key={status.label}
            className={`${status.bgColor} text-black p-4 rounded-md shadow-md w-40 h-20 text-center `}
          >
            <h2 className="text-sm font-semibold">{status.label}</h2>
            <p className="text-sm font-bold">({status.count})</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">เลขที่ออเดอร์</th>
              <th className="py-3 px-6 text-left">ชื่อลูกค้า</th>
              <th className="py-3 px-6 text-left">ที่อยู่ที่จัดส่ง</th>
              <th className="py-3 px-6 text-left">วันเวลาที่สั่ง</th>
              <th className="py-3 px-6 text-right">ราคารวม</th>
              <th className="py-3 px-6 text-left">สถานะการสั่ง</th>
              <th className="py-3 px-6 text-left">รายละเอียดสินค้า</th>{" "}
              {/* เพิ่มคอลัมน์ใหม่ */}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <tr
                key={order.orderNumber}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="py-3 px-6 text-left">{order.customerName}</td>
                <td className="py-3 px-6 text-left">{order.deliveryAddress}</td>
                <td className="py-3 px-6 text-left">{order.orderDateTime}</td>
                <td className="py-3 px-6 text-right">{order.totalPrice} บาท</td>
                <td className="py-3 px-6 text-left">{order.orderStatus}</td>
                <td className="py-3 px-6 text-left">
                  <Link href={`/admin/admin-dash/detail`}>
                    <button className="text-blue-500 hover:underline">
                      ดูรายละเอียด
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
