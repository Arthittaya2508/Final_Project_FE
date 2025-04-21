import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

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

type Size = {
  size_id: number;
  size_name: string;
};

export type Order = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
  payment_image?: string | null; // เพิ่ม field สำหรับรูปหลักฐาน
};

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  orderDetail: any[];
}

const OrderDetailModal: FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [productDetailItems, setProductDetailItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // สำหรับขยายรูป

  useEffect(() => {
    if (!isOpen || !order) return;

    const fetchData = async () => {
      try {
        const [orderDetailsRes, productsRes, colorsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/order_details?order_id=${order.order_id}`
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/colors`),
        ]);

        setOrderDetails(orderDetailsRes.data);
        setProducts(productsRes.data);
        setColors(colorsRes.data);

        const productDetailsRes = await Promise.all(
          orderDetailsRes.data.map((detail: OrderDetail) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/product_details?pro_id=${detail.pro_id}`
            )
          )
        );

        const productDetailItemsRes = await Promise.all(
          orderDetailsRes.data.map((detail: OrderDetail) =>
            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/product_detail_items?pro_detail_id=${detail.pro_detail_id}`
            )
          )
        );

        const allProductDetails = productDetailsRes.map((res) => res.data);
        const allProductDetailItems = productDetailItemsRes.map(
          (res) => res.data
        );
        setProductDetails(allProductDetails.flat());
        setProductDetailItems(allProductDetailItems.flat());
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, order]);

  const getProductName = (pro_id: number) => {
    return (
      products.find((p) => p.pro_id === pro_id)?.pro_name || "ไม่พบชื่อสินค้า"
    );
  };

  const getProductDetail = (pro_detail_id: number) => {
    return productDetails.find((p) => p.pro_detail_id === pro_detail_id);
  };

  const getColorName = (color_id: number) => {
    return colors.find((c) => c.color_id === color_id)?.color_name || "ไม่พบสี";
  };

  const getSizeName = (item_id: number) => {
    const productDetailItem = productDetailItems.find(
      (item) => item.item_id === item_id
    );
    return productDetailItem ? productDetailItem.size_name : "ไม่พบขนาด";
  };

  if (!isOpen || !order) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
          <ModalHeader className="text-xl font-semibold border-b pb-4">
            <h2>รายละเอียดคำสั่งซื้อ</h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700">รหัสคำสั่งซื้อ: {order.order_id}</p>
            <p className="text-gray-700">
              วันที่สั่งซื้อ: {new Date(order.order_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">ยอดรวม: {order.total_amount} บาท</p>

            {/* รูปหลักฐานการชำระเงิน */}
            {order.payment_image && (
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-1">
                  หลักฐานการชำระเงิน:
                </p>
                <img
                  src={
                    order.payment_image.startsWith("data:image/")
                      ? order.payment_image
                      : `/uploads/${order.payment_image}`
                  }
                  alt="หลักฐานการชำระเงิน"
                  className="w-40 h-auto rounded shadow cursor-pointer hover:scale-105 transition"
                  onClick={() =>
                    setSelectedImage(
                      order.payment_image!.startsWith("data:image/")
                        ? order.payment_image!
                        : `/uploads/${order.payment_image}`
                    )
                  }
                />
              </div>
            )}

            {isLoading ? (
              <p className="text-center text-gray-500 mt-4">
                กำลังโหลดข้อมูล...
              </p>
            ) : (
              <div className="overflow-y-auto max-h-80 mt-4">
                <table className="w-full border-separate border-spacing-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2">รหัสคำสั่งซื้อ</th>
                      <th className="text-left p-2">ชื่อสินค้า</th>
                      <th className="text-left p-2">สี</th>
                      <th className="text-left p-2">ขนาด</th>
                      <th className="text-left p-2">จำนวน</th>
                      <th className="text-left p-2">จำนวนรวม</th>
                      <th className="text-left p-2">ราคาสินค้า</th>
                      <th className="text-left p-2">ราคารวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.length > 0 ? (
                      orderDetails.map((detail) => {
                        const productDetail = getProductDetail(
                          detail.pro_detail_id
                        );
                        return (
                          <tr key={detail.order_detail_id}>
                            <td className="p-2">{detail.order_id}</td>
                            <td className="p-2">
                              {getProductName(detail.pro_id)}
                            </td>
                            <td className="p-2">
                              {getColorName(productDetail?.color_id ?? 0)}
                            </td>
                            <td className="p-2">
                              {getSizeName(detail.item_id)}
                            </td>
                            <td className="p-2">{detail.quantity}</td>
                            <td className="p-2">{detail.total_quantity}</td>
                            <td className="p-2">{detail.selling_price} บาท</td>
                            <td className="p-2">{detail.total_price} บาท</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center p-4 text-gray-500"
                        >
                          ไม่พบข้อมูลคำสั่งซื้อ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => alert("รับออเดอร์แล้ว!")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                รับออเดอร์
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* โมดอลแสดงรูปขยาย */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="ขยายหลักฐาน"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default OrderDetailModal;
