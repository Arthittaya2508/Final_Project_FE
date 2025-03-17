"use client";
import { useState } from "react";

const StockReceive = () => {
  const [items, setItems] = useState<
    { name: string; quantity: number; price: number }[]
  >([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, price: 0 });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      setItems([...items, newItem]);
      setNewItem({ name: "", quantity: 1, price: 0 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">รับเข้าสินค้า</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">ชื่อสินค้า</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">จำนวน</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium">ราคา (บาท)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleAddItem}
      >
        เพิ่มสินค้า
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-bold">รายการสินค้าที่รับเข้า</h3>
        <ul className="mt-2 border rounded p-4">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span>
                {item.quantity} ชิ้น - {item.price} บาท
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockReceive;
