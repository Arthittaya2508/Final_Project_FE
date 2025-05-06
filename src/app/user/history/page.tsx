"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export type Order = {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  shipping_date: string;
  status_id: number;
};

type Users = {
  user_id: number;
  name: string;
  lastname: string;
  telephone: string;
  email: string;
  address: string;
  username: string;
  image: string | null;
};

export type Address = {
  address_id: number;
  user_id: number;
  address_name: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
};

const orderStatuses = [
  {
    label: "ที่ยังไม่ได้รับ",
    status_id: 1,
    bgColor: "bg-yellow-400",
    buttonText: "รับออเดอร์",
  },
  {
    label: "ที่กำลังจัดเตรียม",
    status_id: 2,
    bgColor: "bg-orange-400",
    buttonText: "จัดเตรียมเสร็จแล้ว",
  },
  {
    label: "รอขนส่งมารับ",
    status_id: 3,
    bgColor: "bg-blue-400",
    buttonText: "ขนส่งมารับแล้ว",
  },
  {
    label: "ที่จัดส่งแล้ว",
    status_id: 4,
    bgColor: "bg-indigo-400",
    buttonText: "จัดส่งแล้ว",
  },
  {
    label: "ที่ส่งเรียบร้อย",
    status_id: 5,
    bgColor: "bg-green-400",
    buttonText: "สิ้นสุดคำสั่งซื้อ",
  },
  { label: "ที่ยกเลิก", status_id: 6, bgColor: "bg-red-400", buttonText: "" },
];

const OrderHistory = () => {
  const user_id = 3;
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<Users | null>(null);
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orderUser?user_id=${user_id}`
        );
        const fetchedOrders = Array.isArray(response.data.orders)
          ? response.data.orders
          : [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch {
        setOrders([]);
        setFilteredOrders([]);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/user?user_id=${user_id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/address?user_id=${user_id}`
        );
        setAddressOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch address data:", error);
      }
    };
    fetchAddressData();
  }, []);

  useEffect(() => {
    const sorted = [...orders].sort((a, b) => {
      const aIndex = orderStatuses.findIndex(
        (s) => s.status_id === a.status_id
      );
      const bIndex = orderStatuses.findIndex(
        (s) => s.status_id === b.status_id
      );
      return aIndex - bIndex;
    });

    setFilteredOrders(
      selectedStatus !== null
        ? sorted.filter((order) => order.status_id === selectedStatus)
        : sorted
    );
  }, [selectedStatus, orders]);

  return (
    <div className="bg-gray-100 min-h-screen p-20">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        ประวัติคำสั่งซื้อของฉัน
      </h1>

      {/* Dropdown filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">เลือกสถานะ:</label>
        <select
          value={selectedStatus ?? ""}
          onChange={(e) =>
            setSelectedStatus(e.target.value ? parseInt(e.target.value) : null)
          }
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">ทั้งหมด</option>
          {orderStatuses.map((status) => (
            <option key={status.status_id} value={status.status_id}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full table-auto bg-gray-50 rounded-lg overflow-hidden shadow">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left">เลขที่ใบสั่งซื้อ</th>
            <th className="px-6 py-3 text-left">ชื่อลูกค้า</th>
            <th className="px-6 py-3 text-left">ที่อยู่ที่จัดส่ง</th>
            <th className="px-6 py-3 text-left">วันที่สั่งซื้อ</th>
            <th className="px-6 py-3 text-left">ยอดรวม</th>
            <th className="px-6 py-3 text-left">สถานะ</th>
            <th className="px-6 py-3 text-left">รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const userAddress = addressOptions.find(
                (addr) => addr.user_id === order.user_id
              );
              const statusObj = orderStatuses.find(
                (status) => status.status_id === order.status_id
              );

              return (
                <tr
                  key={order.order_id}
                  className="hover:bg-gray-100 transition-all duration-200"
                >
                  <td className="px-6 py-4">{order.order_id}</td>
                  <td className="px-6 py-4">
                    {user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูล"}
                  </td>
                  <td className="px-6 py-4">
                    {userAddress
                      ? `${userAddress.address_name}, ${userAddress.district}, ${userAddress.amphoe}, ${userAddress.province} ${userAddress.zipcode}`
                      : "ไม่พบที่อยู่"}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.order_date).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4">
                    {order.total_amount.toLocaleString()} บาท
                  </td>
                  <td className="px-6 py-4">
                    {statusObj ? (
                      <span
                        className={`text-white px-3 py-1 text-sm rounded-full ${statusObj.bgColor}`}
                      >
                        {statusObj.label}
                      </span>
                    ) : (
                      "ไม่พบสถานะ"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/user/history/order_details?order_id=${order.order_id}`}
                    >
                      <button className="text-blue-600 underline">
                        ดูรายละเอียด
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                ไม่พบข้อมูลคำสั่งซื้อ
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
