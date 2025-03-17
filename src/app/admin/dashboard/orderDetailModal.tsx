import React, { FC, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

interface OrderDetail {
  order_detail_id: string;
  pro_id: string;
  quantity: string;
  selling_price: string;
  total_price: string;
}

interface Order {
  order_id: string;
  customerName: string;
  customerAddress: string;
  order_date: string;
}

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
  // Mock data as strings
  const mockOrder: Order = {
    order_id: "ORD12345",
    customerName: "John Doe",
    customerAddress: "123 Main St, Cityville",
    order_date: "2025-03-15T12:34:56Z",
  };

  const mockOrderDetail: OrderDetail[] = [
    {
      order_detail_id: "1",
      pro_id: "เสื้อกีฬา",
      quantity: "2",
      selling_price: "250",
      total_price: "500",
    },
    {
      order_detail_id: "2",
      pro_id: "กางเกงกีฬา",
      quantity: "1",
      selling_price: "350",
      total_price: "350",
    },
    {
      order_detail_id: "1",
      pro_id: "ลูกบอล",
      quantity: "3",
      selling_price: "150",
      total_price: "450",
    },
  ];

  // If no `order` prop is passed, use mock data
  const orderData = order || mockOrder;
  const orderDetailData =
    orderDetail.length > 0 ? orderDetail : mockOrderDetail;

  if (!isOpen || !orderData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="w-[600px]">
        <ModalHeader>
          <h2>รายละเอียดคำสั่งซื้อ</h2>
        </ModalHeader>
        <ModalBody>
          <p>ชื่อลูกค้า: {orderData.customerName}</p>
          <p>ที่อยู่: {orderData.customerAddress}</p>
          <p>
            วันที่สั่งซื้อ:{" "}
            {new Date(orderData.order_date).toLocaleDateString()}
          </p>

          <table className="w-full mt-4">
            <thead>
              <tr>
                <th>ลำดับที่</th>
                <th>ชื่อสินค้า</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              {orderDetailData.map((detail) => (
                <tr key={detail.order_detail_id}>
                  <td>{detail.order_detail_id}</td>
                  <td>{detail.pro_id}</td>
                  <td>{detail.quantity}</td>
                  <td>{detail.selling_price}</td>
                  <td>{detail.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;
