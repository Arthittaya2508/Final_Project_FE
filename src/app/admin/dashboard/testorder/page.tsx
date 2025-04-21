"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

type Product = {
  pro_id: number;
  sku: string;
  pro_name: string;
};

type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  pro_image: string;
};

type Color = {
  color_id: number;
  color_name: string;
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

const OrderDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [productDetailItems, setProductDetailItems] = useState<any[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const mockOrder: Order = {
      order_id: Number(id) || 1,
      user_id: 1,
      order_date: Date.now(),
      total_amount: 1500,
      shipping_date: Date.now(),
      status_id: 1,
      payment_image: null,
    };

    const mockOrderDetails: OrderDetail[] = [
      {
        order_id: mockOrder.order_id,
        order_detail_id: "od001",
        pro_id: 101,
        pro_detail_id: 1001,
        item_id: 1,
        quantity: 2,
        selling_price: 500,
        total_price: 1000,
        total_quantity: 2,
      },
      {
        order_id: mockOrder.order_id,
        order_detail_id: "od002",
        pro_id: 102,
        pro_detail_id: 1002,
        item_id: 2,
        quantity: 1,
        selling_price: 500,
        total_price: 500,
        total_quantity: 1,
      },
    ];

    const mockProducts: Product[] = [
      { pro_id: 101, sku: "sku101", pro_name: "เสื้อกีฬา A" },
      { pro_id: 102, sku: "sku102", pro_name: "เสื้อกีฬา B" },
    ];

    const mockProductDetails: ProductDetail[] = [
      {
        pro_detail_id: 1001,
        pro_id: 101,
        color_id: 1,
        size_id: 1,
        stock_quantity: 10,
        pro_image: "/images/product1.jpg",
      },
      {
        pro_detail_id: 1002,
        pro_id: 102,
        color_id: 2,
        size_id: 2,
        stock_quantity: 5,
        pro_image: "/images/product2.jpg",
      },
    ];

    const mockProductDetailItems = [
      { item_id: 1, size_name: "M" },
      { item_id: 2, size_name: "L" },
    ];

    const mockColors: Color[] = [
      { color_id: 1, color_name: "แดง" },
      { color_id: 2, color_name: "น้ำเงิน" },
    ];

    setOrder(mockOrder);
    setOrderDetails(mockOrderDetails);
    setProducts(mockProducts);
    setProductDetails(mockProductDetails);
    setProductDetailItems(mockProductDetailItems);
    setColors(mockColors);
  }, [id]);

  const getProductName = (pro_id: number) =>
    products.find((p) => p.pro_id === pro_id)?.pro_name || "ไม่พบชื่อสินค้า";

  const getProductDetail = (pro_detail_id: number) =>
    productDetails.find((p) => p.pro_detail_id === pro_detail_id);

  const getColorName = (color_id: number) =>
    colors.find((c) => c.color_id === color_id)?.color_name || "ไม่พบสี";

  const getSizeName = (item_id: number) => {
    const item = productDetailItems.find((i) => i.item_id === item_id);
    return item ? item.size_name : "ไม่พบขนาด";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        รายละเอียดคำสั่งซื้อ #{order?.order_id}
      </h1>
      <p>
        วันที่สั่งซื้อ:{" "}
        {order ? new Date(order.order_date).toLocaleDateString() : "-"}
      </p>
      <p>ยอดรวม: {order?.total_amount} บาท</p>

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
              <th className="p-2 text-left">จำนวนรวม</th>
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
                    {detailData?.pro_image ? (
                      detailData.pro_image.startsWith("data:image/") ? (
                        <img
                          src={detailData.pro_image}
                          alt="รูปสินค้า"
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() => setSelectedImage(detailData.pro_image)}
                        />
                      ) : (
                        <img
                          src={`/images/${detailData.pro_image}`}
                          alt="รูปสินค้า"
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() =>
                            setSelectedImage(`/images/${detailData.pro_image}`)
                          }
                        />
                      )
                    ) : (
                      <span className="text-gray-400">ไม่มีรูปภาพ</span>
                    )}
                  </td>
                  <td className="p-2">{getProductName(detail.pro_id)}</td>
                  <td className="p-2">
                    {getColorName(detailData?.color_id || 0)}
                  </td>
                  <td className="p-2">{getSizeName(detail.item_id)}</td>
                  <td className="p-2">{detail.quantity}</td>
                  <td className="p-2">{detail.total_quantity}</td>
                  <td className="p-2">{detail.selling_price} บาท</td>
                  <td className="p-2">{detail.total_price} บาท</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => alert("รับออเดอร์แล้ว!")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          รับออเดอร์
        </button>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="รูปสินค้า"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
