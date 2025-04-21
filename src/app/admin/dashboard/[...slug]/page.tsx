"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderDetail {
  order_id: number;
  order_detail_id: string;
  pro_id: number;
  pro_detail_id: number;
  item_id: number;
  quantity: number;
  selling_price: number;
  total_price: number;
  total_quantity: number;
}
type ItemProductDetails = {
  item_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
  detail_id: number;
};
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

type Product = {
  pro_id: number;
  sku: string;
  pro_name: string;
};

type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  stock_quantity: number;
  pro_image: string;
};

type Color = {
  color_id: number;
  color_name: string;
};

type Sizes = {
  size_id: number;
  size_name: string;
};

type Order = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
  payment_image?: string | null;
};

const orderStatuses = [
  {
    label: "ที่ยังไม่ได้รับ",
    status_id: 1,
    bgColor: "bg-yellow-400",
    buttonText: "รับออเดอร์",
  },
  {
    label: "ที่กำลังจัดเตรียม",
    status_id: 2,
    bgColor: "bg-orange-400",
    buttonText: "จัดเตรียมเสร็จแล้ว",
  },
  {
    label: "รอขนส่งมารับ",
    status_id: 3,
    bgColor: "bg-blue-400",
    buttonText: "ขนส่งมารับแล้ว",
  },
  {
    label: "ที่จัดส่งแล้ว",
    status_id: 4,
    bgColor: "bg-indigo-400",
    buttonText: "จัดส่งแล้ว",
  },
  {
    label: "ที่ส่งเรียบร้อย",
    status_id: 5,
    bgColor: "bg-green-400",
    buttonText: "สิ้นสุดคำสั่งซื้อ",
  },
  { label: "ที่ยกเลิก", status_id: 6, bgColor: "bg-red-400", buttonText: "" },
];

const OrderDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const [users, setUsers] = useState<Users[]>([]);
  const [address, setAddress] = useState<Record<number, Address | null>>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [itemProductDetails, setItemProductDetails] = useState<
    ItemProductDetails[]
  >([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ เพิ่ม state นี้
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const id = order_id ? parseInt(order_id) : null;

    if (!id) return;

    const fetchData = async () => {
      try {
        const [
          orderRes,
          orderDetailsRes,
          productsRes,
          colorsRes,
          sizesRes,
          usersRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/orders/${id}`).then((res) => res.json()),
          fetch(`${baseUrl}/order_details?order_id=${id}`).then((res) =>
            res.json()
          ),
          fetch(`${baseUrl}/products`).then((res) => res.json()),
          fetch(`${baseUrl}/colors`).then((res) => res.json()),
          fetch(`${baseUrl}/sizes`).then((res) => res.json()),
          fetch(`${baseUrl}/userAdmin`).then((res) => res.json()),
        ]);

        setOrder(orderRes);
        setOrderDetails(orderDetailsRes);
        setProducts(productsRes);
        setColors(colorsRes);
        setSizes(sizesRes);
        setUsers(usersRes);

        const productDetailsRes = await Promise.all(
          orderDetailsRes.map((detail: OrderDetail) =>
            fetch(`${baseUrl}/product_details?pro_id=${detail.pro_id}`).then(
              (res) => res.json()
            )
          )
        );
        const productDetailItemsRes = await Promise.all(
          orderDetailsRes.map((detail: OrderDetail) =>
            fetch(
              `${baseUrl}/product_detail_items?pro_detail_id=${detail.pro_detail_id}`
            ).then((res) => res.json())
          )
        );
        setItemProductDetails(productDetailItemsRes.flatMap((res) => res));
        setProductDetails(productDetailsRes.flatMap((res) => res));

        const addressData = await Promise.all(
          usersRes.map(async (user: Users) => {
            const res = await fetch(
              `${baseUrl}/address?user_id=${user.user_id}`
            );
            const data = await res.json();
            return { userId: user.user_id, address: data[0] || null };
          })
        );

        setAddress(
          Object.fromEntries(
            addressData.map(({ userId, address }) => [userId, address])
          )
        );
      } catch (err) {
        console.error("❌ Error loading order data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [order_id]);

  const getProductName = (pro_id: number) =>
    products.find((p) => p.pro_id === pro_id)?.pro_name || "ไม่พบชื่อสินค้า";

  const getProductDetail = (pro_detail_id: number) =>
    productDetails.find((p) => p.pro_detail_id === pro_detail_id);

  const getColorName = (color_id: number) =>
    colors.find((c) => c.color_id === color_id)?.color_name || "ไม่พบสี";

  const getSizeName = (item_id: number): string => {
    const sizeId = itemProductDetails.find(
      (item) => item.item_id === item_id
    )?.size_id;
    return sizes.find((s) => s.size_id === sizeId)?.size_name || "ไม่พบขนาด";
  };

  const renderProductImage = (pro_image?: string | null) => {
    if (!pro_image) return <span className="text-gray-400">ไม่มีรูปภาพ</span>;
    const isBase64 = pro_image.startsWith("data:image/");
    const src = isBase64 ? pro_image : `/images/${pro_image}`;
    return (
      <img
        src={src}
        alt="รูปสินค้า"
        className="w-16 h-16 object-cover rounded cursor-pointer"
        onClick={() => setSelectedImage(src)}
      />
    );
  };

  const handleUpdateStatus = async () => {
    if (!order || isUpdating) return;

    const currentIndex = orderStatuses.findIndex(
      (s) => s.status_id === order.status_id
    );
    const nextStatus = orderStatuses[currentIndex + 1];

    if (!nextStatus) {
      alert("ไม่สามารถอัปเดตสถานะถัดไปได้ เพราะเป็นสถานะสุดท้าย");
      return;
    }

    if (nextStatus.status_id === 6) {
      alert("ไม่สามารถอัปเดตสถานะได้เนื่องจากคำสั่งซื้อถูกยกเลิก");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status_id: nextStatus.status_id }),
        }
      );

      if (response.ok) {
        // รีเฟรชข้อมูลหลังจากอัปเดตสถานะ
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        alert("อัปเดตสถานะสำเร็จ");
      } else {
        throw new Error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      }
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    } finally {
      setIsUpdating(false);
    }
  };
  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.selling_price * detail.quantity,
    0
  );
  const totalQuantity = orderDetails.reduce(
    (sum, detail) => sum + detail.quantity,
    0
  );
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ← ย้อนกลับ
      </button>

      {order && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            รายละเอียดคำสั่งซื้อ #{order.order_id}
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* ซ้าย: รายละเอียดคำสั่งซื้อ */}
            <div className="flex-1">
              <p>
                <b>สถานะ: </b>
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    orderStatuses.find((s) => s.status_id === order.status_id)
                      ?.bgColor
                  }`}
                >
                  {
                    orderStatuses.find((s) => s.status_id === order.status_id)
                      ?.label
                  }
                </span>
              </p>
              <p>
                <b>ชื่อลูกค้า:</b>
                {users.find((u) => u.user_id === order.user_id)?.name ||
                  "ไม่ระบุ"}{" "}
                {users.find((u) => u.user_id === order.user_id)?.lastname || ""}
              </p>
              <p>
                <b>ที่อยู่จัดส่ง: </b>
                {address[order.user_id]
                  ? `${address[order.user_id]?.address_name}, ${
                      address[order.user_id]?.district
                    }, ${address[order.user_id]?.amphoe}, ${
                      address[order.user_id]?.province
                    } ${address[order.user_id]?.zipcode}`
                  : "ไม่ระบุ"}
              </p>
              <p>
                <b>เบอร์โทร: </b>
                {users.find((u) => u.user_id === order.user_id)?.telephone ||
                  "ไม่ระบุ"}
              </p>
              <p>
                <b>วันที่สั่งซื้อ: </b>
                {new Date(order.order_date).toLocaleDateString("th-TH")}
              </p>
            </div>

            {/* ขวา: รูปหลักฐานการชำระเงิน */}
            <div className="mr-48">
              <div className="flex flex-row ">
                <p className="mb-32 mr-2 font-bold ">หลักฐานการชำระเงิน:</p>
                {order.payment_image ? (
                  <img
                    src={
                      order.payment_image.startsWith("data:image/")
                        ? order.payment_image
                        : `/images/${order.payment_image}`
                    }
                    alt="หลักฐานการชำระเงิน"
                    className="w-20 h-auto rounded border shadow cursor-pointer transition hover:scale-105"
                    onClick={() =>
                      setSelectedImage(order.payment_image || null)
                    }
                  />
                ) : (
                  <span className="text-gray-400">ไม่มีหลักฐานการชำระเงิน</span>
                )}
              </div>
            </div>
          </div>

          {/* Modal แสดงรูปภาพแบบเต็ม */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="bg-white p-4 rounded shadow-lg max-w-full max-h-full">
                <img
                  src={
                    selectedImage.startsWith("data:image/")
                      ? selectedImage
                      : `/images/${selectedImage}`
                  }
                  alt="ภาพขยาย"
                  className="max-w-[90vw] max-h-[80vh] rounded"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ลำดับ</th>
              <th className="p-2 text-left">รูปสินค้า</th>
              <th className="p-2 text-left">ชื่อสินค้า</th>
              <th className="p-2 text-left">สี</th>
              <th className="p-2 text-left">ขนาด</th>
              <th className="p-2 text-left">จำนวน</th>
              {/* <th className="p-2 text-left">จำนวนรวม</th> */}
              <th className="p-2 text-left">ราคาสินค้า</th>
              <th className="p-2 text-left">ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail) => {
              const detailData = getProductDetail(detail.pro_detail_id);
              return (
                <tr key={detail.order_detail_id} className="border-t">
                  <td className="p-2">{detail.order_detail_id}</td>
                  <td className="p-2">
                    {renderProductImage(detailData?.pro_image)}
                  </td>
                  <td className="p-2">{getProductName(detail.pro_id)}</td>
                  <td className="p-2">
                    {getColorName(detailData?.color_id || 0)}
                  </td>
                  <td className="p-2">{getSizeName(detail.item_id)}</td>
                  <td className="p-2">{detail.quantity}</td>
                  {/* <td className="p-2">{detail.total_quantity}</td> */}
                  <td className="p-2">{detail.selling_price} บาท</td>
                  <td className="p-2">{detail.total_price} บาท</td>
                </tr>
              );
            })}
            <tr className="border-t">
              <td colSpan={7} className=" text-right font-bold">
                จำนวนสินค้าทั้งหมด:
              </td>
              <td className=" font-bold text-right text-blue-600">
                {totalQuantity} ชิ้น
              </td>
            </tr>
            <tr className="">
              <td colSpan={7} className=" text-right font-bold">
                ราคารวมทั้งหมด:
              </td>
              <td className=" font-bold text-right text-green-600">
                {totalAmount.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {order && order.status_id < 5 && order.status_id !== 6 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className={`px-6 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 ${
              orderStatuses.find((s) => s.status_id === order.status_id)
                ?.bgColor || "bg-gray-400"
            }`}
          >
            {isUpdating
              ? "กำลังอัปเดต..."
              : orderStatuses.find((s) => s.status_id === order.status_id)
                  ?.buttonText || "อัปเดตสถานะ"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
