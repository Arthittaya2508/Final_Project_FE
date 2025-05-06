"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProductImport = {
  product_import_id: number;
  company_id: number;
  brand_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  quantity: number;
  cost_price: number;
  total_price: number;
  created_at: string;
};

type Company = {
  company_id: number;
  company_name: string;
};

type Brand = {
  brand_id: number;
  brand_name: string;
  company_id: number;
};

type Product = {
  pro_id: number;
  pro_name: string;
  brand_id: number;
};

type Color = {
  color_id: number;
  color_name: string;
};

type Size = {
  size_id: number;
  size_name: string;
};

const ReceiveProductHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState<ProductImport[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, companyRes, brandRes, productRes, colorRes, sizeRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_import`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`),
          ]);

        const [
          orderData,
          companyData,
          brandData,
          productData,
          colorData,
          sizeData,
        ] = await Promise.all([
          orderRes.json(),
          companyRes.json(),
          brandRes.json(),
          productRes.json(),
          colorRes.json(),
          sizeRes.json(),
        ]);

        setOrderHistory(orderData);
        setCompanies(companyData);
        setBrands(brandData);
        setProducts(productData);
        setColors(colorData);
        setSizes(sizeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAll();
  }, []);

  const getCompanyName = (id: number) =>
    companies.find((c) => c.company_id === id)?.company_name || "-";

  const getBrandName = (id: number) =>
    brands.find((b) => b.brand_id === id)?.brand_name || "-";

  const getProductName = (id: number) =>
    products.find((p) => p.pro_id === id)?.pro_name || "-";

  const getColorName = (id: number) =>
    colors.find((c) => c.color_id === id)?.color_name || "-";

  const getSizeName = (id: number) =>
    sizes.find((s) => s.size_id === id)?.size_name || "-";

  const handleRowClick = (orderId: number) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = selectedMonth
    ? orderHistory.filter((order) => {
        const orderDate = new Date(order.created_at);
        const month = orderDate.getMonth() + 1;
        const year = orderDate.getFullYear();
        return `${year}-${month.toString().padStart(2, "0")}` === selectedMonth;
      })
    : orderHistory;

  const exportToExcel = () => {
    const data = filteredOrders.map((order) => ({
      เลขที่: order.product_import_id,
      วันที่: new Date(order.created_at).toLocaleDateString("th-TH"),
      บริษัท: getCompanyName(order.company_id),
      แบรนด์: getBrandName(order.brand_id),
      สินค้า: getProductName(order.pro_id),
      สี: getColorName(order.color_id),
      ขนาด: getSizeName(order.size_id),
      จำนวน: order.quantity,
      ราคาต่อชิ้น: order.cost_price,
      ราคารวม: order.total_price,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order History");
    XLSX.writeFile(wb, "รายงานการรับเข้าสินค้า.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "เลขที่",
          "วันที่",
          "บริษัท",
          "แบรนด์",
          "สินค้า",
          "สี",
          "ขนาด",
          "จำนวน",
          "ราคาต่อชิ้น",
          "ราคารวม",
        ],
      ],
      body: filteredOrders.map((order) => [
        order.product_import_id,
        new Date(order.created_at).toLocaleDateString("th-TH"),
        getCompanyName(order.company_id),
        getBrandName(order.brand_id),
        getProductName(order.pro_id),
        getColorName(order.color_id),
        getSizeName(order.size_id),
        order.quantity,
        order.cost_price,
        order.total_price,
      ]),
    });
    doc.save("รายงานการรับเข้าสินค้า.pdf");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOrderIds.length === 0) {
      alert("กรุณาเลือกคำสั่งซื้อก่อน");
      return;
    }

    const ordersToSubmit = orderHistory.filter((order) =>
      selectedOrderIds.includes(order.product_import_id)
    );

    try {
      for (const order of ordersToSubmit) {
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product_details?pro_id=${order.pro_id}&color_id=${order.color_id}`
        );

        if (!detailRes.ok) {
          throw new Error("ไม่สามารถดึงข้อมูล pro_detail_id ได้");
        }

        const detailData = await detailRes.json();
        const pro_detail_id = detailData?.[0]?.pro_detail_id;

        if (!pro_detail_id) {
          console.warn("ไม่พบ pro_detail_id สำหรับ order:", order);
          continue;
        }

        console.log(
          `จำลองการเพิ่มสินค้าจำนวน ${order.quantity} ขนาด ${order.size_id} เข้า pro_detail_id ${pro_detail_id}`
        );
      }

      setOrderHistory((prevOrders) =>
        prevOrders.filter(
          (order) => !selectedOrderIds.includes(order.product_import_id)
        )
      );
      setSelectedOrderIds([]);
      alert("รับเข้าสินค้าสำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการรับเข้าสินค้า:", error);
      alert("เกิดข้อผิดพลาดในการรับเข้าสินค้า");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">
        รายงานการรับเข้าสินค้า
      </h1>

      {/* ตัวเลือกเดือน + ปุ่ม Export */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="month" className="text-sm font-medium">
            เลือกเดือน:
          </label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">
                เลขที่
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                วันที่
              </th>
              {/* <th className="px-4 py-2 text-left text-sm font-medium">
                บริษัท
              </th> */}
              <th className="px-4 py-2 text-left text-sm font-medium">
                แบรนด์
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                สินค้า
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">สี</th>
              <th className="px-4 py-2 text-left text-sm font-medium">ขนาด</th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                จำนวน
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                ราคาต่อชิ้น
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                ราคารวม
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.product_import_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(order.product_import_id)}
              >
                <td className="px-4 py-2">{order.product_import_id}</td>
                <td className="px-4 py-2">
                  {new Date(order.created_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  เวลา{" "}
                  {new Date(order.created_at).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                {/* <td className="px-4 py-2">
                  {getCompanyName(order.company_id)}
                </td> */}
                <td className="px-4 py-2">{getBrandName(order.brand_id)}</td>
                <td className="px-4 py-2">{getProductName(order.pro_id)}</td>
                <td className="px-4 py-2">{getColorName(order.color_id)}</td>
                <td className="px-4 py-2">{getSizeName(order.size_id)}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
                <td className="px-4 py-2 text-right">{order.cost_price}</td>
                <td className="px-4 py-2 text-right">{order.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiveProductHistoryPage;
