"use client";
import { Button } from "../../../components/ui/button";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../lib/features/carts/cartsSlice"; // ✅ import action

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

export type Transport = {
  transport_id: number;
  transport_name: string;
};

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const dispatch = useDispatch(); // ใช้ dispatch เพื่อเรียกใช้ Redux action
  const [user, setUser] = useState<Users | null>(null);
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);
  const [transportOptions, setTransportOptions] = useState<Transport[]>([]);
  const [addressType, setAddressType] = useState<"existing" | "new">(
    "existing"
  );

  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserLastName, setNewUserLastName] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/users/user?user_id=3`
          );
          const data: Users = await res.json();
          setUser(data);
          fetchAddressData(data.user_id);
          fetchTransportData();
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const fetchAddressData = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/address?user_id=${userId}`
      );
      const data: Address[] = await response.json();
      setAddressOptions(data);
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    }
  };

  const fetchTransportData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/transports`);
      const data: Transport[] = await response.json();
      setTransportOptions(data);
    } catch (error) {
      console.error("Failed to fetch transport data:", error);
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressType(event.target.value as "existing" | "new");
  };

  // เมื่อคลิกปุ่มยืนยันการสั่งซื้อ จะทำการลบสินค้าในตะกร้า
  const handleConfirmOrder = () => {
    dispatch(clearCart()); // เรียกใช้ action clearCart จาก Redux
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">เลือกที่อยู่สำหรับจัดส่ง</h2>

        {/* Radio buttons to select between existing or new address */}
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="addressType"
                value="existing"
                checked={addressType === "existing"}
                onChange={handleAddressChange}
                className="mr-2"
              />
              เลือกที่อยู่ที่มีในระบบ
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="addressType"
                value="new"
                checked={addressType === "new"}
                onChange={handleAddressChange}
                className="mr-2"
              />
              กรอกที่อยู่ใหม่
            </label>
          </div>
        </div>

        {/* Conditional render based on address selection */}
        {addressType === "existing" ? (
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-lg">ผู้ใช้:</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <input
                  type="text"
                  value={user.lastname}
                  disabled
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </div>
            <label className="block text-lg">ที่อยู่จัดส่ง</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>เลือกที่อยู่ที่มีในระบบ</option>
              {addressOptions.map((address) => (
                <option key={address.address_id}>
                  {address.address_name}, {address.district}, {address.amphoe},{" "}
                  {address.province}, {address.zipcode}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-lg">กรุณากรอกชื่อผู้ใช้ใหม่</label>
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="ชื่อ"
              />
              <input
                type="text"
                value={newUserLastName}
                onChange={(e) => setNewUserLastName(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="นามสกุล"
              />
            </div>
            <label className="block text-lg">ที่อยู่จัดส่งใหม่</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="กรุณากรอกที่อยู่ใหม่"
            />
          </div>
        )}

        {/* Transport options */}
        <div className="mb-4">
          <label className="block text-lg">เลือกขนส่งที่ต้องการ</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            {transportOptions.length === 0 ? (
              <option>ไม่มีข้อมูลขนส่ง</option>
            ) : (
              transportOptions.map((transport) => (
                <option key={transport.transport_id}>
                  {transport.transport_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose}>ยกเลิก</Button>
          {/* Use Link to navigate to the payment page */}
          <Link href="/user/cart/payment">
            <Button onClick={handleConfirmOrder}>ยืนยันการสั่งซื้อ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
