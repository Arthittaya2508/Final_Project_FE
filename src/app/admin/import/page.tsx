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
  order_import_detail_id: number;
  order_import_id: number;
};

type ProductReceive = {
  order_import_id: number;
  order_import_detail_id: number;
  actual_quantity: number;
};

const Modal = ({
  order,
  closeModal,
  refreshData,
}: {
  order: OrderImport;
  closeModal: () => void;
  refreshData: () => Promise<void>;
}) => {
  const [details, setDetails] = useState<OrderImportDetail[]>([]);
  const [receivedQuantities, setReceivedQuantities] = useState<number[]>([]);
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
        const detailData: OrderImportDetail[] = await detailRes.json();
        setDetails(detailData);

        const receiveRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product_receive?order_import_id=${order.order_import_id}`
        );
        if (!receiveRes.ok) throw new Error("ไม่สามารถโหลดข้อมูลรับสินค้า");
        const receiveData: ProductReceive[] = await receiveRes.json();

        const initialReceivedQuantities = detailData.map((item) => {
          const receiveItem = receiveData.find(
            (r) => r.order_import_detail_id === item.order_import_detail_id
          );
          return receiveItem ? receiveItem.actual_quantity : 0;
        });
        setReceivedQuantities(initialReceivedQuantities);

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

  const updateReceivedQuantity = (index: number, value: number) => {
    setReceivedQuantities((prev) =>
      prev.map((qty, i) => (i === index ? value : qty))
    );
  };

  const handleSave = async () => {
    try {
      const items = details.map((item, index) => ({
        order_import_detail_id: item.order_import_detail_id,
        actual_quantity: receivedQuantities[index],
        order_import_id: order.order_import_id, // เพิ่ม id เพื่ออัปเดตภายนอก
      }));

      const receiveRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product_receive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiveItems: items }),
        }
      );
      if (!receiveRes.ok) throw new Error("การบันทึก Product Receive ล้มเหลว");

      alert("✅ บันทึกจำนวนที่รับจริงเรียบร้อยแล้ว");

      await refreshData(); // <-- ตรงนี้จะอัปเดต receives ให้สถานะเปลี่ยนโดยอัตโนมัติ

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
            <strong>ราคารวม:</strong>{" "}
            {order.total_price.toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}{" "}
            บาท
          </p>
          <p>
            <strong>จำนวนสินค้ารวม:</strong> {order.quantity} ชิ้น
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">
            รายการสินค้า (ดูข้อมูลและกรอกจำนวนที่ได้รับจริง)
          </h2>
          {details.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">สินค้า</th>
                    <th className="border px-2 py-1">สี</th>
                    <th className="border px-2 py-1">ขนาด</th>
                    <th className="border px-2 py-1">ราคาต่อหน่วย</th>
                    <th className="border px-2 py-1">รวม</th>
                    <th className="border px-2 py-1">จำนวนที่สั่ง</th>
                    <th className="border px-2 py-1">จำนวนที่ได้รับจริง</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="border px-2 py-1">
                        {products.find((p) => p.pro_id === item.pro_id)
                          ?.pro_name || "ไม่พบชื่อสินค้า"}
                      </td>
                      <td className="border px-2 py-1">
                        {colors.find((c) => c.color_id === item.color_id)
                          ?.color_name || "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {sizes.find((s) => s.size_id === item.size_id)
                          ?.size_name || "-"}
                      </td>
                      <td className="border px-2 py-1">{item.cost_price}</td>
                      <td className="border px-2 py-1">
                        {(
                          Number(item.quantity) * Number(item.cost_price)
                        ).toFixed(2)}
                      </td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="border rounded p-1 w-20 text-center"
                          value={receivedQuantities[i] || 0}
                          onChange={(e) =>
                            updateReceivedQuantity(i, Number(e.target.value))
                          }
                        />
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
                  📦 บันทึกจำนวนที่ได้รับจริง
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

const ProductImport = () => {
  const [orders, setOrders] = useState<OrderImport[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [receives, setReceives] = useState<ProductReceive[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderImport | null>(null);

  const fetchData = async () => {
    const [ordersRes, companyRes, receiveRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_receive`), // ดึงข้อมูลล่าสุด
    ]);

    const [ordersData, companyData, receiveData] = await Promise.all([
      ordersRes.json(),
      companyRes.json(),
      receiveRes.json(),
    ]);

    setOrders(ordersData);
    setCompany(companyData);
    setReceives(receiveData); // <-- ใช้ข้อมูลใหม่ตรงนี้
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (order: OrderImport) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const getTotalReceivedQuantity = (orderId: number) => {
    return receives
      .filter((r) => r.order_import_id === orderId)
      .reduce((sum, r) => sum + (r.actual_quantity ?? 0), 0);
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
                <th className="border px-3 py-2">ราคารวม</th>
                <th className="border px-3 py-2">จำนวนที่สั่งทั้งหมด</th>
                <th className="border px-3 py-2">จำนวนที่รับทั้งหมด</th>
                <th className="border px-3 py-2">สถานะรับสินค้า</th>
                <th className="border px-3 py-2">ดูรายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalReceived = getTotalReceivedQuantity(
                  order.order_import_id
                );
                return (
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
                    <td className="border px-3 py-1">
                      {order.total_price.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border px-3 py-1">{order.quantity}</td>
                    <td className="border px-3 py-1">{totalReceived}</td>
                    <td
                      className={`border px-3 py-1 font-semibold ${
                        totalReceived >= order.quantity
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {totalReceived >= order.quantity
                        ? "รับสินค้าแล้ว"
                        : "ยังไม่รับสินค้า"}
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>ไม่มีข้อมูลคำสั่งซื้อ</p>
      )}

      {showModal && selectedOrder && (
        <Modal
          order={selectedOrder}
          closeModal={closeModal}
          refreshData={fetchData}
        />
      )}
    </div>
  );
};

export default ProductImport;
