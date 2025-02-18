import Link from "next/link";
import React from "react";

interface OrderDetailsProps {
  orderNumber: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => {
  // ข้อมูลออเดอร์ตัวอย่าง
  const order = {
    orderNumber: orderNumber,
    customerName: "John Doe",
    deliveryAddress: "123 Main St, Bangkok",
    totalPrice: 500,
    orderStatus: "จัดส่งแล้ว",
    productDetails: "Product A, Product B",
    additionalDetails:
      "Here you can display more detailed information about the order.",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p>
        <strong>เลขที่ออเดอร์:</strong> {order.orderNumber}
      </p>
      <p>
        <strong>ชื่อลูกค้า:</strong> {order.customerName}
      </p>
      <p>
        <strong>ที่อยู่ที่จัดส่ง:</strong> {order.deliveryAddress}
      </p>
      <p>
        <strong>ราคารวม:</strong> {order.totalPrice} บาท
      </p>
      <p>
        <strong>สถานะการสั่ง:</strong> {order.orderStatus}
      </p>
      <p>
        <strong>รายละเอียดสินค้า:</strong> {order.productDetails}
      </p>
      <p>
        <strong>รายละเอียดเพิ่มเติม:</strong> {order.additionalDetails}
      </p>

      {/* ลิงก์กลับไปยังหน้ารายการออเดอร์ */}
      <Link href="/admin/admin-dash/dashboard">
        <button className="text-blue-500 hover:underline mt-4 inline-block">
          กลับไปยังหน้ารายการออเดอร์
        </button>
      </Link>
    </div>
  );
};

export default OrderDetails;
