"use client";
import { useState, useEffect } from "react";

type OrderImport = {
  order_import_id: number;
  company_id: number;
  brand_id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  quantity: number;
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
  const [orderHistory, setOrderHistory] = useState<OrderImport[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, companyRes, brandRes, productRes, colorRes, sizeRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`),
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOrderIds.length === 0) {
      alert("กรุณาเลือกคำสั่งซื้อก่อน");
      return;
    }

    const ordersToSubmit = orderHistory.filter((order) =>
      selectedOrderIds.includes(order.order_import_id)
    );

    try {
      for (const order of ordersToSubmit) {
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product_details?pro_id=${order.product_id}&color_id=${order.color_id}`
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

        // จำลองการเพิ่มสินค้าเข้า stock
        console.log(
          `จำลองการเพิ่มสินค้าจำนวน ${order.quantity} ขนาด ${order.size_id} เข้า pro_detail_id ${pro_detail_id}`
        );
      }

      // ลบออกจากหน้าจอหลังจำลอง
      setOrderHistory((prevOrders) =>
        prevOrders.filter(
          (order) => !selectedOrderIds.includes(order.order_import_id)
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
      <h1 className="text-2xl font-semibold text-center mb-6">รับเข้าสินค้า</h1>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">เลือก</th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                เลขที่
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                วันที่
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                บริษัท
              </th>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderHistory.map((order) => (
              <tr
                key={order.order_import_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(order.order_import_id)}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(order.order_import_id)}
                    readOnly
                  />
                </td>
                <td className="px-4 py-2">{order.order_import_id}</td>
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
                <td className="px-4 py-2">
                  {getCompanyName(order.company_id)}
                </td>
                <td className="px-4 py-2">{getBrandName(order.brand_id)}</td>
                <td className="px-4 py-2">
                  {getProductName(order.product_id)}
                </td>
                <td className="px-4 py-2">{getColorName(order.color_id)}</td>
                <td className="px-4 py-2">{getSizeName(order.size_id)}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrderIds.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmitOrder}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            ยืนยันการรับเข้าสินค้า
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiveProductHistoryPage;
