"use client";
import { useState, useMemo, useEffect } from "react";
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

// ตัวอย่าง API URL สำหรับใช้จริงให้เปลี่ยนเป็น BASE_URL ของคุณ
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ProductSale = {
  name: string;
  quantity: number;
  color: string;
  size: string;
  color_id: number;
  size_id: number;
  pro_detail_id: number;
};

type OrderDetail = {
  order_id: number;
  order_detail_id: string;
  pro_id: number;
  pro_detail_id: number;
  item_id: number;
  quantity: number;
  selling_price: number;
  total_price: number;
  total_quantity: number;
};

type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  pro_image: string;
};

type Product = {
  pro_id: number;
  sku: string;
  pro_name: string;
};

type Color = {
  color_id: number;
  color_name: string;
};

type Size = {
  size_id: number;
  size_name: string;
};

const fetchSalesData = async () => {
  // ดึงข้อมูลคำสั่งซื้อทั้งหมด
  const ordersRes = await fetch(`${API_URL}/orderAdmin`);
  const orders = await ordersRes.json();

  // ดึงรายละเอียดคำสั่งซื้อทั้งหมด
  const orderDetailsRes = await Promise.all(
    orders.map((order: { order_id: number }) =>
      fetch(`${API_URL}/order_details?order_id=${order.order_id}`).then((res) =>
        res.json()
      )
    )
  );
  const orderDetails = orderDetailsRes.flat();

  // ดึงข้อมูล colors และ sizes
  const [colorsRes, sizesRes, productsRes] = await Promise.all([
    fetch(`${API_URL}/colors`),
    fetch(`${API_URL}/sizes`),
    fetch(`${API_URL}/products`),
  ]);

  const [colors, sizes, products] = await Promise.all([
    colorsRes.json(),
    sizesRes.json(),
    productsRes.json(),
  ]);

  const proDetailIds = [
    ...new Set(orderDetails.flat().map((od: OrderDetail) => od.pro_detail_id)),
  ];
  const productDetailsRes = await Promise.all(
    proDetailIds.map((pro_detail_id) =>
      fetch(`${API_URL}/product_details?pro_detail_id=${pro_detail_id}`).then(
        (res) => res.json()
      )
    )
  );

  const productDetailItemsRes = await Promise.all(
    proDetailIds.map((id) =>
      fetch(`${API_URL}/product_detail_items?pro_detail_id=${id}`).then((res) =>
        res.json()
      )
    )
  );

  return {
    orders,
    orderDetails,
    products,
    productDetails: productDetailsRes.flat(),
    productDetailItems: productDetailItemsRes.flat(),
    colors,
    sizes,
  };
};

export default function ProductReportPage() {
  const [month, setMonth] = useState("2025-01");
  const [type, setType] = useState<"bestSelling" | "worstSelling">(
    "bestSelling"
  );
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"top" | "all">("top");
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchSalesData();
      setData(fetchedData);

      const salesData = fetchedData.orderDetails.map((detail: OrderDetail) => {
        const product = fetchedData.products.find(
          (p: Product) => p.pro_id === detail.pro_id
        );
        const productDetail = fetchedData.productDetails.find(
          (pd: ProductDetail) => pd.pro_detail_id === detail.pro_detail_id
        );

        const productItemDetails = fetchedData.productDetailItems.find(
          (pdi: any) => pdi.item_id === detail.item_id
        );

        return {
          name: product?.pro_name || "ไม่พบชื่อสินค้า",
          quantity: detail.total_quantity,

          color: productDetail
            ? fetchedData.colors.find(
                (c) => c.color_id === productDetail.color_id
              )?.color_name || `สี: ${productDetail.color_id}`
            : "ไม่มีสี",

          size: productItemDetails
            ? fetchedData.sizes.find(
                (s) => s.size_id === productItemDetails.size_id
              )?.size_name || `ขนาด: ${productItemDetails.size_id}`
            : "ไม่มีขนาด",

          color_id: productDetail ? productDetail.color_id : 0,
          size_id: productItemDetails ? productItemDetails.size_id : 0,
          pro_detail_id: detail.pro_detail_id,
          pro_id: detail.pro_id,
        };
      });

      // รวมยอดขายของสินค้ารายการเดียวกัน
      const aggregatedSalesData = salesData.reduce((acc, currentItem) => {
        const existingItem = acc.find(
          (item) =>
            item.pro_detail_id === currentItem.pro_detail_id &&
            item.color_id === currentItem.color_id &&
            item.size_id === currentItem.size_id
        );

        if (existingItem) {
          existingItem.quantity += currentItem.quantity;
        } else {
          acc.push({ ...currentItem });
        }

        return acc;
      }, [] as ProductSale[]);

      setProductSales(aggregatedSalesData);
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    const sorted = [...productSales].sort((a, b) =>
      type === "bestSelling" ? b.quantity - a.quantity : a.quantity - b.quantity
    );

    return (viewMode === "top" ? sorted.slice(0, 5) : sorted).filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [productSales, type, search, viewMode]);
  const handleExport = () => {
    const exportData = filteredData.map(({ name, quantity, color, size }) => ({
      name,
      quantity,
      color,
      size,
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
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const getTypeName = (type: "bestSelling" | "worstSelling") =>
    type === "bestSelling" ? "สินค้าขายดี" : "สินค้าขายไม่ดี";

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
          onValueChange={(value) =>
            setType(value as "bestSelling" | "worstSelling")
          }
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

        <Button
          variant={viewMode === "top" ? "default" : "outline"}
          onClick={() => setViewMode("top")}
        >
          แสดง Top 5
        </Button>

        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          onClick={() => setViewMode("all")}
        >
          แสดงทั้งหมด
        </Button>
      </div>

      {/* กราฟ */}
      {viewMode === "top" && (
        <Card>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity">
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ตาราง */}
      <h2 className="text-xl font-semibold mb-2">ตาราง</h2>
      <table className="w-full table-auto border border-gray-300 bg-white">
        <thead>
          <tr>
            <th className="p-2 border">ลำดับ</th>
            <th className="p-2 border">ชื่อสินค้า</th>
            <th className="p-2 border">สี</th>
            <th className="p-2 border">ขนาด</th>
            <th className="p-2 border">จำนวนที่ขายได้(ชิ้น)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.color}</td>
              <td className="p-2 border">{item.size}</td>
              <td className="p-2 border text-center">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
