"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export type Order = {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  shipping_date: string;
  status_id: number;
};

export type StatusOrders = {
  status_id: number;
  status_name: string;
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

const OrderHistory = () => {
  const user_id = 3;
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<Users | null>(null);
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);
  const [statusOrders, setStatusOrders] = useState<StatusOrders[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders?user_id=${user_id}`
        );
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
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
          `http://localhost:5000/api/users/user?user_id=3`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    const fetchStatusOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/status_orders`
        );
        setStatusOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch status orders:", error);
      }
    };

    fetchUser();
    fetchStatusOrders();
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
    if (selectedStatus !== null) {
      setFilteredOrders(
        orders.filter((order) => order.status_id === selectedStatus)
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [selectedStatus, orders]);

  return (
    <div className="bg-gray-100 min-h-screen  items-center justify-center p-20">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        ประวัติคำสั่งซื้อของฉัน
      </h1>

      <table className="min-w-full table-auto bg-gray-50 rounded-lg overflow-hidden">
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
              const orderStatus = statusOrders.find(
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
                    {orderStatus ? orderStatus.status_name : "ไม่พบสถานะ"}
                  </td>
                  <td className="px-6 py-4 text-blue-500 cursor-pointer">
                    <u>รายละเอียด</u>
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
