"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Type Definitions
type OrderImport = {
  order_import_id: number;
  company_id: number;
  company_name: string;
  created_at: string;
  quantity: number;
  total_price: number;
};

type Company = { company_id: number; company_name: string };
type Product = { pro_id: number; pro_name: string; brand_id: number };
type Color = { color_id: number; color_name: string };
type Size = { size_id: number; size_name: string };

type OrderImportDetail = {
  pro_id: number;
  pro_name: string;
  color_id: number;
  size_id: number;
  quantity: number;
  cost_price: string;
};

// Modal Component to Display Order Details
const Modal = ({
  order,
  closeModal,
}: {
  order: OrderImport;
  closeModal: () => void;
}) => {
  const [details, setDetails] = useState<OrderImportDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch order details
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order_import_detail?order_import_id=${order.order_import_id}`
        );
        if (!detailRes.ok) throw new Error("ไม่สามารถโหลดรายละเอียดบิล");
        const detailData = await detailRes.json();
        setDetails(detailData);

        // Fetch product/color/size
        const [productRes, colorRes, sizeRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`),
        ]);

        const [productData, colorData, sizeData] = await Promise.all([
          productRes.json(),
          colorRes.json(),
          sizeRes.json(),
        ]);

        setProducts(productData);
        setColors(colorData);
        setSizes(sizeData);
      } catch (err) {
        console.error("❌ Failed to load modal data:", err);
      }
    };

    fetchAll();
  }, [order.order_import_id]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-full relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-xl">
          X
        </button>

        {/* Order Information */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <p>
            <strong>เลขที่บิล:</strong> 00000{order.order_import_id}
          </p>
          <p>
            <strong>วันที่สั่งซื้อ:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString("th-TH")}
          </p>
          <p>
            <strong>จำนวนสินค้ารวม:</strong> {order.quantity} ชิ้น
          </p>
          <p>
            <strong>ราคารวม:</strong>{" "}
            {order.total_price.toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}{" "}
            บาท
          </p>
        </div>

        {/* Product Details */}
        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">รายการสินค้า</h2>
          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">สินค้า</th>
                    <th className="border px-2 py-1">สี</th>
                    <th className="border px-2 py-1">ขนาด</th>
                    <th className="border px-2 py-1">จำนวน</th>
                    <th className="border px-2 py-1">ราคาต่อหน่วย</th>
                    <th className="border px-2 py-1">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, i) => {
                    const productName =
                      products.find((p) => p.pro_id === item.pro_id)
                        ?.pro_name || "ไม่พบสินค้า";
                    const colorName =
                      colors.find((c) => c.color_id === item.color_id)
                        ?.color_name || "ไม่พบสี";
                    const sizeName =
                      sizes.find((s) => s.size_id === item.size_id)
                        ?.size_name || "ไม่พบขนาด";

                    return (
                      <tr key={i} className="border-t">
                        <td className="border px-2 py-1">{productName}</td>
                        <td className="border px-2 py-1">{colorName}</td>
                        <td className="border px-2 py-1">{sizeName}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">
                          {Number(item.cost_price).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1">
                          {(
                            Number(item.quantity) * Number(item.cost_price)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">ไม่มีรายการสินค้าในบิลนี้</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const OrderImportListPage = () => {
  const [orders, setOrders] = useState<OrderImport[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderImport | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const [ordersRes, companyRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`),
      ]);
      const [ordersData, companyData] = await Promise.all([
        ordersRes.json(),
        companyRes.json(),
      ]);
      setOrders(ordersData);
      setCompany(companyData);
    };

    fetchAll();
  }, []);

  const openModal = (order: OrderImport) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          รายการบิลคำสั่งซื้อสินค้า
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          onClick={() => router.push("/admin/order_import")}
        >
          + สั่งสินค้า
        </button>
      </div>
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">เลขที่บิล</th>
                <th className="border px-3 py-2">บริษัท</th>
                <th className="border px-3 py-2">วันที่สั่งซื้อ</th>
                <th className="border px-3 py-2">จำนวนทั้งหมด</th>
                <th className="border px-3 py-2">ราคารวม</th>
                <th className="border px-3 py-2">ดูรายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_import_id}>
                  <td className="border px-3 py-1">
                    00000{order.order_import_id}
                  </td>
                  <td className="border px-3 py-1">
                    {company.find((c) => c.company_id === order.company_id)
                      ?.company_name || "ไม่พบบริษัท"}
                  </td>
                  <td className="border px-3 py-1">
                    {new Date(order.created_at).toLocaleString("th-TH", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="border px-3 py-1">{order.quantity}</td>
                  <td className="border px-3 py-1">
                    {order.total_price.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border px-3 py-1">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openModal(order)}
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>ไม่มีข้อมูลคำสั่งซื้อ</p>
      )}

      {showModal && selectedOrder && (
        <Modal order={selectedOrder} closeModal={closeModal} />
      )}
    </div>
  );
};

export default OrderImportListPage;
