"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { format, parseISO } from "date-fns";

type Users = {
  user_id: number;
  name: string;
  lastname: string;
  telephone: string;
  email: string;
  address: string;
  username: string;
};

type Address = {
  address_id: number;
  user_id: number;
  address_name: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
};

// ส่วนของ modal
interface OrderDetailModalProps {
  selectedOrderId: number | null;
  orderDetails: any[];
  products: any[];
  productDetails: any[];
  colors: any[];
  sizes: any[];
  users: Users[]; // เพิ่มประเภทข้อมูลของ users
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  selectedOrderId,
  orderDetails,
  products,
  productDetails,
  colors,
  sizes,
  users,
  onClose,
}) => {
  if (!selectedOrderId) return null;

  const order = orderDetails[0]; // สมมติว่าคำสั่งซื้อนี้มีแค่หนึ่งรายการใน orderDetails

  const totalQuantity = orderDetails.reduce(
    (sum, detail) => sum + detail.quantity,
    0
  );
  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.total_price,
    0
  );

  // หาข้อมูลของลูกค้าที่ทำการสั่งซื้อ
  const user = users.find((user) => user.user_id === order.user_id);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          รายละเอียดคำสั่งซื้อ
        </h2>

        {/* ซ้าย: รายละเอียดคำสั่งซื้อ */}
        <div className="flex-1">
          <div className="space-y-2">
            {/* แสดงข้อมูลของลูกค้า */}
            {user && (
              <>
                <p>
                  <b>ชื่อลูกค้า:</b> {user.name} {user.lastname}
                </p>
                <p>
                  <b>ที่อยู่จัดส่ง: </b> {user.address || "ไม่ระบุ"}
                </p>
                <p>
                  <b>เบอร์โทร: </b> {user.telephone || "ไม่ระบุ"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ขวา: ตารางแสดงสินค้า */}
        <div className="flex-1">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b text-left">ชื่อสินค้า</th>
                <th className="p-2 border-b text-left">สี</th>
                <th className="p-2 border-b text-left">ขนาด</th>
                <th className="p-2 border-b text-left">จำนวน</th>
                <th className="p-2 border-b text-left">ราคาขาย</th>
                <th className="p-2 border-b text-left">ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail) => {
                const product = products.find(
                  (p) => p.pro_id === detail.pro_id
                );

                // ตรวจสอบว่า productDetails เป็นอาร์เรย์หรือไม่ก่อนที่จะใช้ .find()
                const productDetail = Array.isArray(productDetails)
                  ? productDetails.find(
                      (pd) => pd.pro_detail_id === detail.pro_detail_id
                    )
                  : null;

                const color = colors.find(
                  (c) => c.color_id === productDetail?.color_id
                );
                const size = sizes.find(
                  (s) => s.size_id === productDetail?.size_id
                );

                return (
                  <tr key={detail.order_detail_id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{product?.pro_name}</td>
                    <td className="p-2 border-b">{color?.color_name}</td>
                    <td className="p-2 border-b">{size?.size_name}</td>
                    <td className="p-2 border-b">{detail.quantity}</td>
                    <td className="p-2 border-b text-right">
                      {detail.selling_price.toLocaleString()} บาท
                    </td>
                    <td className="p-2 border-b text-right">
                      {detail.total_price.toLocaleString()} บาท
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t">
                <td colSpan={5} className="text-right font-bold">
                  จำนวนสินค้าทั้งหมด:
                </td>
                <td className="font-bold text-right text-blue-600">
                  {totalQuantity} ชิ้น
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right font-bold">
                  ราคารวมทั้งหมด:
                </td>
                <td className="font-bold text-right text-green-600">
                  {totalAmount.toLocaleString()} บาท
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ปุ่มปิด */}
      <div className="mt-4 text-center">
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

// ส่วนของหน้าหลัก (รายงานการขาย)
const MonthlySalesReport = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [users, setUsers] = useState<Users[]>([]); // เพิ่มการเก็บข้อมูลผู้ใช้
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          ordersRes,
          productsRes,
          productDetailsRes,
          colorsRes,
          sizesRes,
          usersRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orderAdmin`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_details`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/userAdmin`).then((res) =>
            res.json()
          ),
        ]);

        setOrders(ordersRes);
        setProducts(productsRes);
        setProductDetails(productDetailsRes);
        setColors(colorsRes);
        setSizes(sizesRes);
        setUsers(usersRes); // เก็บข้อมูลผู้ใช้

        const detailPromises = ordersRes.map((order: any) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/order_details?order_id=${order.order_id}`
          ).then((res) => res.json())
        );
        const detailResults = await Promise.all(detailPromises);
        const mergedDetails = detailResults.flat();
        setOrderDetails(mergedDetails);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันเปิด modal
  const openModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  // 🟡 Filter orders ตามเดือนที่เลือก
  const filteredOrders =
    selectedMonth === "all"
      ? orders
      : orders.filter((order) => {
          const orderDate = parseISO(order.order_date);
          const monthString = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
          return monthString === selectedMonth;
        });

  const orderSummaryMap = new Map<number, { quantity: number }>();
  orderDetails.forEach((detail) => {
    const current = orderSummaryMap.get(detail.order_id) || { quantity: 0 };
    orderSummaryMap.set(detail.order_id, {
      quantity: current.quantity + (detail.total_quantity || detail.quantity),
    });
  });

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + Math.round(Number(order.total_amount)),
    0
  );
  const totalOrders = filteredOrders.length;
  const totalItemsSold = filteredOrders.reduce((sum, order) => {
    const orderSummary = orderSummaryMap.get(order.order_id);
    return sum + (orderSummary ? orderSummary.quantity : 0);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">รายงานการขายประจำเดือน</h1>

      {/* ✅ Dropdown เลือกเดือน */}
      <div className="mb-4">
        <label className="mr-2 font-medium">เลือกเดือน:</label>
        <select
          className="border px-3 py-1 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          {Array.from(
            new Set(
              orders.map((order) => {
                const orderDate = parseISO(order.order_date);
                return `${orderDate.getFullYear()}-${String(
                  orderDate.getMonth() + 1
                ).padStart(2, "0")}`; // เก็บเฉพาะปี-เดือน
              })
            )
          ).map((monthString) => {
            const monthDate = parseISO(`${monthString}-01`);
            return (
              <option key={monthString} value={monthString}>
                {format(monthDate, "MMMM yyyy")}
              </option>
            );
          })}
        </select>
      </div>

      {/* แสดงข้อมูลยอดขาย, จำนวนคำสั่งซื้อ, และจำนวนสินค้าที่ขายได้ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-100">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">ยอดขายรวม</h2>
            <p className="text-2xl font-bold text-green-700">
              {totalSales.toLocaleString()} บาท
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">จำนวนออเดอร์ทั้งหมด</h2>
            <p className="text-2xl font-bold text-blue-700">
              {totalOrders} รายการ
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-100">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">จำนวนสินค้าที่ขายได้</h2>
            <p className="text-2xl font-bold text-yellow-700">
              {totalItemsSold} ชิ้น
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ตารางแสดงคำสั่งซื้อ */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">หมายเลขคำสั่งซื้อ</th>
              <th className="p-2 text-left">วันที่สั่งซื้อ</th>
              <th className="p-2 text-left">จำนวนสินค้า</th>
              <th className="p-2 text-left">ยอดขาย</th>
              <th className="p-2 text-left">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const orderDate = parseISO(order.order_date);
              const orderSummary = orderSummaryMap.get(order.order_id);

              return (
                <tr key={order.order_id}>
                  <td className="p-2 border-b">00000{order.order_id}</td>
                  <td className="p-2 border-b">
                    {format(orderDate, "dd/MM/yyyy")}
                  </td>
                  <td className="p-2 border-b">
                    {orderSummary?.quantity || 0}
                  </td>
                  <td className="p-2 border-b">
                    {Math.round(Number(order.total_amount)).toLocaleString()}{" "}
                  </td>
                  <td className="p-2 border-b">
                    <button
                      className="text-blue-500"
                      onClick={() => openModal(order.order_id)}
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

      {/* แสดง Modal เมื่อเลือกคำสั่งซื้อ */}
      {isModalOpen && (
        <OrderDetailModal
          selectedOrderId={selectedOrderId}
          orderDetails={orderDetails.filter(
            (detail) => detail.order_id === selectedOrderId
          )}
          products={products}
          productDetails={productDetails}
          colors={colors}
          sizes={sizes}
          users={users} // ส่งข้อมูลผู้ใช้
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MonthlySalesReport;
