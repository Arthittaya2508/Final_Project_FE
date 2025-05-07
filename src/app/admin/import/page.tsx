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

const Modal = ({
  order,
  closeModal,
}: {
  order: OrderImport;
  closeModal: () => void;
}) => {
  const [details, setDetails] = useState<OrderImportDetail[]>([]);
  const [editableDetails, setEditableDetails] = useState<OrderImportDetail[]>(
    []
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order_import_detail?order_import_id=${order.order_import_id}`
        );
        if (!detailRes.ok) throw new Error("ไม่สามารถโหลดรายละเอียดบิล");
        const detailData = await detailRes.json();
        setDetails(detailData);
        setEditableDetails(JSON.parse(JSON.stringify(detailData)));

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

  const updateDetailField = (
    index: number,
    field: keyof OrderImportDetail,
    value: any
  ) => {
    setEditableDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order_import_detail?order_import_id=${order.order_import_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: editableDetails, // ส่งข้อมูลที่ถูกแก้ไข
          }),
        }
      );

      if (!res.ok) throw new Error("การบันทึกล้มเหลว");
      alert("✅ บันทึกเรียบร้อยแล้ว");
      closeModal();
    } catch (err) {
      console.error("❌ Save Error:", err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-full relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-xl">
          X
        </button>

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

        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">
            รายการสินค้า (แก้ไขได้)
          </h2>
          {editableDetails.length > 0 ? (
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
                  {editableDetails.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="border px-2 py-1">
                        {products.find((p) => p.pro_id === item.pro_id)
                          ?.pro_name || "ไม่พบชื่อสินค้า"}
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded p-1"
                          value={item.color_id}
                          onChange={(e) =>
                            updateDetailField(
                              i,
                              "color_id",
                              Number(e.target.value)
                            )
                          }
                        >
                          {colors.map((c) => (
                            <option key={c.color_id} value={c.color_id}>
                              {c.color_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="border rounded p-1"
                          value={item.size_id}
                          onChange={(e) =>
                            updateDetailField(
                              i,
                              "size_id",
                              Number(e.target.value)
                            )
                          }
                        >
                          {sizes.map((s) => (
                            <option key={s.size_id} value={s.size_id}>
                              {s.size_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="border rounded p-1 w-20 text-center"
                          value={item.quantity}
                          onChange={(e) =>
                            updateDetailField(
                              i,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          step="0.01"
                          className="border rounded p-1 w-24 text-center"
                          value={item.cost_price}
                          onChange={(e) =>
                            updateDetailField(i, "cost_price", e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        {(
                          Number(item.quantity) * Number(item.cost_price)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                  onClick={handleSave}
                >
                  💾 บันทึกการแก้ไข
                </button>
              </div>
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
const ProductImport = () => {
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
          รายงานคำสั่งซื้อสินค้า
        </h1>
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
                    {new Date(order.created_at).toLocaleDateString("th-TH")}
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

export default ProductImport;
