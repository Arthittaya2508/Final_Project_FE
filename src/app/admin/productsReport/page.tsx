"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ประกาศ type
type Product = {
  name: string;
  quantity: number;
  color?: string;
};

type ProductData = {
  bestSelling: Product[];
  worstSelling: Product[];
};

const mockData: Record<string, ProductData> = {
  "2025-01": {
    bestSelling: [
      { name: "Warrix เสื้อโปโล", quantity: 120 },
      { name: "กางเกง Warrix ", quantity: 95 },
      { name: "ลูกฟุตบอล รุ่นF5D1000-TL1 ", quantity: 75 },
      { name: "กางเกงวอร์ม", quantity: 75 },
      { name: "เสื้อฟุตบอลคอกลมแขนสั้น", quantity: 75 },
    ],
    worstSelling: [
      { name: "ถุงมือผู้รักษาประตูฟุตบอล ", quantity: 8 },
      { name: "รองเท้าฟุตซอล", quantity: 5 },
      { name: "FBT กางเกงวอร์มขาจั๊ม", quantity: 2 },
      { name: "แว่นกันแดด", quantity: 2 },
      { name: "ลูกปิงปอง", quantity: 2 },
    ],
  },
  "2025-02": {
    bestSelling: [
      { name: "FBT กางเกงวิ่งสีล้วน(แบบบาง)", quantity: 100 },
      { name: "Warrix Classic Polo Shirt", quantity: 80 },
      { name: "รองเท้าฟุตซอล", quantity: 60 },
      { name: "กางเกง Warrix", quantity: 60 },
      { name: "แว่นกันแดด", quantity: 60 },
    ],
    worstSelling: [
      { name: "ผ้าคาดศีรษะ", quantity: 6 },
      { name: "ถุงเท้า ", quantity: 4 },
      { name: "GRAND SPORT กางเกงวอร์มขาปล่อย", quantity: 1 },
      { name: "สนับมือ ", quantity: 1 },
      { name: "สนับมือ ", quantity: 1 },
    ],
  },
  "2025-03": {
    bestSelling: [
      { name: "เสื้อกีฬา G", quantity: 100 },
      { name: "หมวกกีฬา", quantity: 80 },
      { name: "รองเท้า ", quantity: 60 },
      { name: "รองเท้า ", quantity: 60 },
      { name: "รองเท้า ", quantity: 60 },
    ],
    worstSelling: [
      { name: "ผ้าคาดศีรษะ J", quantity: 6 },
      { name: "ถุงเท้า K", quantity: 4 },
      { name: "สนับมือ L", quantity: 1 },
      { name: "สนับมือ L", quantity: 1 },
      { name: "สนับมือ L", quantity: 1 },
    ],
  },
  "2025-04": {
    bestSelling: [
      { name: "เสื้อกีฬา G", quantity: 100 },
      { name: "หมวก H", quantity: 80 },
      { name: "รองเท้า I", quantity: 60 },
      { name: "รองเท้า I", quantity: 60 },
      { name: "รองเท้า I", quantity: 60 },
    ],
    worstSelling: [
      { name: "ผ้าคาดศีรษะ J", quantity: 6 },
      { name: "ถุงเท้า K", quantity: 4 },
      { name: "สนับมือ L", quantity: 1 },
      { name: "สนับมือ L", quantity: 1 },
      { name: "GRAND SPORT กางเกงวอร์มขาปล่อย", quantity: 1 },
    ],
  },
};

// พาเลตสี
const colorPalette = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#818cf8",
  "#fcd34d",
];

export default function ProductReportPage() {
  const [month, setMonth] = useState("2025-01");
  const [type, setType] = useState<"bestSelling" | "worstSelling">(
    "bestSelling"
  );
  const [search, setSearch] = useState("");

  const rawData = mockData[month]?.[type] || [];

  const filteredData = useMemo(() => {
    return rawData
      .filter((item: Product) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((item, index) => ({
        ...item,
        color: colorPalette[index % colorPalette.length],
      }));
  }, [search, rawData]);

  const handleExport = () => {
    const exportData = filteredData.map(({ name, quantity }) => ({
      name,
      quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานสินค้า");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `รายงานสินค้า_${month}_${type}.xlsx`);
  };

  // ฟังก์ชันเพื่อแสดงชื่อเดือน
  const getMonthName = (month: string) => {
    switch (month) {
      case "2025-01":
        return "มกราคม 2025";
      case "2025-02":
        return "กุมภาพันธ์ 2025";
      case "2025-03":
        return "มีนาคม 2025";
      case "2025-04":
        return "เมษายน 2025";
      default:
        return "";
    }
  };

  // ฟังก์ชันเพื่อแสดงประเภทสินค้า
  const getTypeName = (type: "bestSelling" | "worstSelling") => {
    return type === "bestSelling" ? "สินค้าขายดี" : "สินค้าขายไม่ดี";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-center font-bold">รายงานสินค้า</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[150px]">
            {getMonthName(month)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025-01">มกราคม 2025</SelectItem>
            <SelectItem value="2025-02">กุมภาพันธ์ 2025</SelectItem>
            <SelectItem value="2025-03">มีนาคม 2025</SelectItem>
            <SelectItem value="2025-04">เมษายน 2025</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(value) => {
            setType(value as "bestSelling" | "worstSelling");
          }}
        >
          <SelectTrigger className="w-[180px]">
            {getTypeName(type)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bestSelling">สินค้าขายดี</SelectItem>
            <SelectItem value="worstSelling">สินค้าขายไม่ดี</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="ค้นหาชื่อสินค้า"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />

        <Button onClick={handleExport} variant="outline">
          Export เป็น Excel
        </Button>
      </div>

      {/* ส่วนกราฟ */}

      <Card>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity">
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ส่วนตาราง */}

      <h2 className="text-xl font-semibold mb-2">ตาราง</h2>
      <table className="w-full table-auto border border-gray-300 bg-white">
        <thead>
          <tr>
            <th className="p-2 border">ลำดับ</th>
            <th className="p-2 border">ชื่อสินค้า</th>
            <th className="p-2 border">จำนวนที่ขายได้(ชิ้น)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: Product, idx: number) => (
            <tr key={idx}>
              <td className="p-2 border text-center">{idx + 1}</td>

              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border text-center">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
