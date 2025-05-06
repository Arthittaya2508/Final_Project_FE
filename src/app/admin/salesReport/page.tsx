"use client";

import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Card, CardContent } from "@/components/ui/Card";
import { Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

const mockSalesData = {
  "1": [
    // มกราคม
    { date: "01/01", sales: 12000 },
    { date: "02/01", sales: 15000 },
    { date: "03/01", sales: 11000 },
    { date: "04/01", sales: 18000 },
    { date: "05/01", sales: 9000 },
    { date: "06/01", sales: 5000 },
    { date: "07/01", sales: 10000 },
    { date: "08/01", sales: 7000 },
    { date: "09/01", sales: 10000 },
    { date: "10/01", sales: 5000 },
    { date: "11/01", sales: 4000 },
    { date: "12/01", sales: 10000 },
    { date: "13/01", sales: 20000 },
    { date: "14/01", sales: 22000 },
    { date: "15/01", sales: 22000 },
    { date: "16/01", sales: 10000 },
    { date: "17/01", sales: 15000 },
    { date: "18/01", sales: 17000 },
    { date: "19/01", sales: 12000 },
    { date: "20/01", sales: 10000 },
    { date: "21/01", sales: 15000 },
    { date: "22/01", sales: 10000 },
    { date: "23/01", sales: 25000 },
    { date: "24/01", sales: 20000 },
    { date: "25/01", sales: 15000 },
    { date: "26/01", sales: 10000 },
    { date: "27/01", sales: 15000 },
    { date: "28/01", sales: 10000 },
    { date: "29/01", sales: 15000 },
    { date: "30/01", sales: 20000 },
    { date: "31/01", sales: 15000 },
  ],
  "2": [
    // กุมภาพันธ์
    { date: "01/02", sales: 10000 },
    { date: "02/02", sales: 14000 },
    { date: "03/02", sales: 11000 },
    { date: "04/02", sales: 17000 },
    { date: "05/02", sales: 12000 },
    { date: "06/02", sales: 15000 },
    { date: "07/02", sales: 16000 },
    { date: "08/02", sales: 18000 },
    { date: "09/02", sales: 14500 },
    { date: "10/02", sales: 14000 },
    { date: "11/02", sales: 20000 },
    { date: "12/02", sales: 18000 },
    { date: "13/02", sales: 21000 },
    { date: "14/02", sales: 22000 },
    { date: "15/02", sales: 25000 },
    { date: "16/02", sales: 20000 },
    { date: "17/02", sales: 15000 },
    { date: "18/02", sales: 7000 },
    { date: "19/02", sales: 12000 },
    { date: "20/02", sales: 20000 },
    { date: "21/02", sales: 15000 },
    { date: "22/02", sales: 10000 },
    { date: "23/02", sales: 15000 },
    { date: "24/02", sales: 10000 },
    { date: "25/02", sales: 15000 },
    { date: "26/02", sales: 10000 },
    { date: "27/02", sales: 5000 },
    { date: "28/02", sales: 10000 },
  ],
  "3": [
    // มีนาคม
    { date: "01/03", sales: 13000 },
    { date: "02/03", sales: 15000 },
    { date: "03/03", sales: 12000 },
    { date: "04/03", sales: 19000 },
    { date: "05/03", sales: 10000 },
    { date: "06/03", sales: 16000 },
    { date: "07/03", sales: 17000 },
    { date: "08/03", sales: 18000 },
    { date: "09/03", sales: 15500 },
    { date: "10/03", sales: 15000 },
    { date: "11/03", sales: 21000 },
    { date: "12/03", sales: 19000 },
    { date: "13/03", sales: 22000 },
    { date: "14/03", sales: 23000 },
    { date: "15/03", sales: 16000 },
    { date: "16/03", sales: 11000 },
    { date: "17/03", sales: 16000 },
    { date: "18/03", sales: 8000 },
    { date: "19/03", sales: 13000 },
    { date: "20/03", sales: 11000 },
    { date: "21/03", sales: 6000 },
    { date: "22/03", sales: 5000 },
    { date: "23/03", sales: 6000 },
    { date: "24/03", sales: 10000 },
    { date: "25/03", sales: 16000 },
    { date: "26/03", sales: 10000 },
    { date: "27/03", sales: 6000 },
    { date: "28/03", sales: 8000 },
    { date: "29/03", sales: 6000 },
    { date: "30/03", sales: 9000 },
    { date: "31/03", sales: 6000 },
  ],
  "4": [
    // เมษายน
    { date: "01/04", sales: 12000 },
    { date: "02/04", sales: 15000 },
    { date: "03/04", sales: 11000 },
    { date: "04/04", sales: 18000 },
    { date: "05/04", sales: 9000 },
    { date: "06/04", sales: 15000 },
    { date: "07/04", sales: 16000 },
    { date: "08/04", sales: 17000 },
    { date: "09/04", sales: 14500 },
    { date: "10/04", sales: 14000 },
    { date: "11/04", sales: 10000 },
    { date: "12/04", sales: 18000 },
    { date: "13/04", sales: 21000 },
    { date: "14/04", sales: 20000 },
    { date: "15/04", sales: 25000 },
    { date: "16/04", sales: 30000 },
    { date: "17/04", sales: 10000 },
    { date: "18/04", sales: 7000 },
    { date: "19/04", sales: 3000 },
    { date: "20/04", sales: 10000 },
    { date: "21/04", sales: 5000 },
  ],
};

const SalesReportPage = () => {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("4");
  const [selectedYear, setSelectedYear] = useState("2568");

  const months = [
    { label: "มกราคม", value: "1" },
    { label: "กุมภาพันธ์", value: "2" },
    { label: "มีนาคม", value: "3" },
    { label: "เมษายน", value: "4" },
  ];

  const years = ["2568"];

  const selectedSalesData = mockSalesData[selectedMonth] || [];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      selectedSalesData.map((sale, index) => ({
        วันที่ขาย: `${sale.date}/${selectedYear}`,
        เลขที่บิล: `ORD${index + 1}`,
        จำนวนสินค้า: index + 1,
        ยอดรวม: sale.sales,
        กำไร: (sale.sales * 0.3).toFixed(2),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    XLSX.writeFile(wb, `Sales_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Month-Year Selector */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">รายงานการขายประจำเดือน</h1>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-1"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded px-3 py-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Export Button */}
      <div className="flex gap-4 items-center mt-4 justify-end">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded flex"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>ยอดขายรวม</p>
            <h2 className="text-xl font-bold text-green-600">
              ฿
              {selectedSalesData.reduce((total, sale) => total + sale.sales, 0)}
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>ยอดรวมบิล</p>
            <h2 className="text-xl font-bold">{selectedSalesData.length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>จำนวนสินค้าที่ขายได้</p>
            <h2 className="text-xl font-bold">
              {selectedSalesData.length * 3}
            </h2>{" "}
            {/* Mock item sold */}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>กำไรสุทธิ</p>
            <h2 className="text-xl font-bold text-blue-600">
              ฿
              {selectedSalesData.reduce(
                (total, sale) => total + sale.sales * 0.3,
                0
              )}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">วันที่ขาย</th>
                <th className="text-left p-2">เลขที่บิล</th>
                <th className="text-right p-2">จำนวนสินค้า</th>
                <th className="text-right p-2">ยอดรวม</th>
                <th className="text-right p-2">กำไร</th>
              </tr>
            </thead>
            <tbody>
              {selectedSalesData.map((sale, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    {sale.date}/{selectedYear}
                  </td>
                  <td className="p-2">ORD0000{index + 1}</td>
                  <td className="p-2 text-right">{index + 1}</td>
                  <td className="p-2 text-right">{sale.sales}</td>
                  <td className="p-2 text-right">
                    {(sale.sales * 0.3).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReportPage;
