"use client";
import { useState, useEffect } from "react";

const StockReport = () => {
  const [reports, setReports] = useState<
    {
      id: number;
      name: string;
      quantity: number;
      price: number;
      date: string;
    }[]
  >([]);

  useEffect(() => {
    // โหลดข้อมูลจาก API หรือ Database
    setReports([
      {
        id: 1,
        name: "เสื้อกีฬา",
        quantity: 10,
        price: 500,
        date: "2025-03-15",
      },
      {
        id: 2,
        name: "รองเท้าฟุตบอล",
        quantity: 5,
        price: 1200,
        date: "2025-03-14",
      },
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">รายงานการรับเข้าสินค้า</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ลำดับที่</th>
            <th className="border border-gray-300 p-2">วันที่</th>
            <th className="border border-gray-300 p-2">ชื่อสินค้า</th>
            <th className="border border-gray-300 p-2">จำนวน</th>
            <th className="border border-gray-300 p-2">ราคา</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="text-center">
              <td className="border border-gray-300 p-2">{report.id}</td>
              <td className="border border-gray-300 p-2">{report.date}</td>
              <td className="border border-gray-300 p-2">{report.name}</td>
              <td className="border border-gray-300 p-2">{report.quantity}</td>
              <td className="border border-gray-300 p-2">{report.price} บาท</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockReport;
