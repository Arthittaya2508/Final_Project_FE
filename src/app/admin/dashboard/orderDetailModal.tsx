import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

interface OrderDetail {
  order_detail_id: string;
  pro_img: string;
  pro_id: string;
  quantity: string;
  selling_price: string;
  total_price: string;
}

export type Order = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
};

export type Users = {
  user_id: number;
  name: string;
  lastname: string;
};

export type Address = {
  address_id: number;
  user_id: number;
  address_name: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
};

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  orderDetail: OrderDetail[];
}

const OrderDetailModal: FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  orderDetail,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [addresses, setAddresses] = useState<Record<number, Address | null>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`
        );
        const orderDetailsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/order_details`
        );
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`
        );

        setOrders(ordersResponse.data);
        setOrderDetails(orderDetailsResponse.data);
        setUsers(usersResponse.data);

        // Fetch user addresses
        const addressPromises = usersResponse.data.map(async (user: Users) => {
          const userAddress = await fetchAddress(user.user_id);
          return { userId: user.user_id, address: userAddress };
        });

        const addressData = await Promise.all(addressPromises);
        const addressMap = addressData.reduce((acc, { userId, address }) => {
          acc[userId] = address;
          return acc;
        }, {} as Record<number, Address | null>);

        setAddresses(addressMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAddress = async (userId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/address?user_id=${userId}`
      );
      return response.data[0] || null;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  // Get user full name by userId
  const getUserFullName = (userId: number) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้";
  };

  // Get user address
  const getUserAddress = (userId: number) => {
    const address = addresses[userId];
    return address
      ? `${address.address_name}, ${address.district}, ${address.amphoe}, ${address.province} ${address.zipcode}`
      : "-";
  };

  // Mock order details
  const mockOrderDetail: OrderDetail[] = [
    {
      order_detail_id: "1",
      pro_img: "/images/WAblue.jpg",
      pro_id: "เสื้อกีฬา",
      quantity: "2",
      selling_price: "250",
      total_price: "500",
    },
    {
      order_detail_id: "2",
      pro_img: "/images/WAblue.jpg",
      pro_id: "กางเกงกีฬา",
      quantity: "1",
      selling_price: "350",
      total_price: "350",
    },
    {
      order_detail_id: "3",
      pro_img: "/images/WAblue.jpg",
      pro_id: "ลูกบอล",
      quantity: "3",
      selling_price: "150",
      total_price: "450",
    },
    {
      order_detail_id: "4",
      pro_img: "/images/WAblue.jpg",
      pro_id: "รองเท้ากีฬา",
      quantity: "1",
      selling_price: "500",
      total_price: "500",
    },
  ];

  const orderData = order || mockOrderDetail;
  const orderDetailData =
    orderDetail.length > 0 ? orderDetail : mockOrderDetail;

  // Calculate total price of items
  const totalPrice = orderDetailData.reduce(
    (total, item) => total + parseFloat(item.total_price),
    0
  );

  if (!isOpen || !orderData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <ModalHeader className="text-xl font-semibold border-b pb-4">
          <h2>รายละเอียดคำสั่งซื้อ</h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-700">รหัสคำสั่งซื้อ: {orderData.order_id}</p>
          <p className="text-gray-700">
            ชื่อลูกค้า: {getUserFullName(orderData.user_id)}
          </p>
          <p className="text-gray-700">
            ที่อยู่ที่จัดส่ง: {getUserAddress(orderData.user_id)}
          </p>
          <p className="text-gray-700">
            วันที่สั่งซื้อ:{" "}
            {new Date(orderData.order_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">ยอดรวม: {orderData.total_amount} บาท</p>

          <div className="overflow-y-auto max-h-80 mt-4">
            <table className="w-full border-separate border-spacing-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">รหัสสินค้า</th>
                  <th className="text-left p-2">รูปสินค้า</th>
                  <th className="text-left p-2">ชื่อสินค้า</th>
                  <th className="text-left p-2">ราคาสินค้า</th>
                  <th className="text-left p-2">จำนวน</th>
                  <th className="text-left p-2">ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                {orderDetailData.map((detail) => (
                  <tr key={detail.order_detail_id}>
                    <td className="p-2">{detail.order_detail_id}</td>
                    <td className="p-2">
                      <img
                        src={detail.pro_img}
                        alt={detail.pro_id}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-2">{detail.pro_id}</td>
                    <td className="p-2">{detail.selling_price} บาท</td>
                    <td className="p-2">{detail.quantity}</td>
                    <td className="p-2">{detail.total_price} บาท</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 text-right mt-4">
            <span className="font-semibold">ยอดรวมทั้งหมด:</span> {totalPrice}{" "}
            บาท
          </p>

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
  );
};

export default OrderDetailModal;
