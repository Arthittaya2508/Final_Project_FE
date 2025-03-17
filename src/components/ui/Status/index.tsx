import React, { useState, useEffect } from "react";
import axios from "axios";

export type status_orders = {
  status_id: number;
  status_name: string;
};

export type orders = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
};

const orderStatuses = [
  { label: "ที่ยังไม่ได้รับ", status_id: 1, bgColor: "bg-yellow-400" },
  { label: "ที่กำลังจัดเตรียม", status_id: 2, bgColor: "bg-orange-400" },
  { label: "รอขนส่งมารับ", status_id: 3, bgColor: "bg-blue-400" },
  { label: "ที่จัดส่งแล้ว", status_id: 4, bgColor: "bg-indigo-400" },
  { label: "ที่ส่งเรียบร้อย", status_id: 5, bgColor: "bg-green-400" },
  { label: "ที่ยกเลิก", status_id: 6, bgColor: "bg-red-400" },
];

function Status() {
  const [orders, setOrders] = useState<orders[]>([]);
  const [orderCounts, setOrderCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchOrders() {
      try {
        // ดึงข้อมูลคำสั่งซื้อจาก API
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          }/orders`
        );
        setOrders(response.data); // บันทึกข้อมูลคำสั่งซื้อ

        // นับจำนวนคำสั่งซื้อที่มีแต่ละ status_id
        const counts: { [key: number]: number } = {};
        response.data.forEach((order: orders) => {
          const status_id = order.status_id;
          counts[status_id] = counts[status_id] ? counts[status_id] + 1 : 1;
        });
        setOrderCounts(counts); // อัพเดตค่าการนับคำสั่งซื้อ
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div>
      {/* Responsive Stepper */}
      <div className="overflow-x-auto mb-6">
        <div className="flex items-center min-w-[800px]">
          {orderStatuses.map((status, index) => (
            <React.Fragment key={status.label}>
              <div className="flex flex-col items-center cursor">
                <div
                  className={`${status.bgColor} w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base cursor`}
                >
                  {/* แสดงจำนวนคำสั่งซื้อที่มี status_id ตรงกับสถานะ */}
                  {orderCounts[status.status_id] || 0}
                </div>
                <span className="text-xs lg:text-sm mt-2 text-center w-20 lg:w-24 cursor ">
                  {status.label}
                </span>
              </div>
              {index < orderStatuses.length - 1 && (
                <div className="h-[2px] bg-gray-300 flex-grow mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Status;
