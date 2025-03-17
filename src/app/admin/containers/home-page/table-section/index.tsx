import Button from "@/components/ui/Buttons";
import Pagination from "@/components/ui/Pagination/index";
import Table from "@/components/ui/Table";
import OrderDetailModal from "@/app/admin/dashboard/orderDetailModal";
import { columns } from "../../../../../lib/data";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { FC, useMemo, useState, useEffect } from "react";

interface Users {
  user_id: number;
  name: string;
  lastname: string;
}

export type Address = {
  address_id: number;
  user_id: number;
  address_name: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
};

const fetchOrders = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const fetchAddress = async (userId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/address?user_id=${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

const fetchOrderDetail = async (orderId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order_detail?order_id=${orderId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching order details:", error);
    return [];
  }
};

const TableSection: FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [address, setAddress] = useState<Record<number, Address | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const getData = async () => {
      const ordersData = await fetchOrders();
      const usersData = await fetchUsers();
      setOrders(ordersData);
      setUsers(usersData);

      const addressPromises = usersData.map(async (user: Users) => {
        const userAddress = await fetchAddress(user.user_id);
        return { userId: user.user_id, address: userAddress };
      });

      const addressData = await Promise.all(addressPromises);
      const addressMap = addressData.reduce((acc, { userId, address }) => {
        acc[userId] = address;
        return acc;
      }, {} as Record<number, Address | null>);

      setAddress(addressMap);
      setIsLoading(false);
    };

    getData();
  }, []);

  const isEmpty = orders.length === 0;
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return orders.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, orders]);

  const getUserFullName = (userId: number) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้";
  };

  const formatAddress = (userAddress: Address | null) => {
    return userAddress
      ? `${userAddress.address_name}, ${userAddress.district}, ${userAddress.amphoe}, ${userAddress.province} ${userAddress.zipcode}`
      : "-";
  };

  const handleViewOrderDetails = async (orderId: number) => {
    // ดึงข้อมูลคำสั่งซื้อ
    const orderDetailData = await fetchOrderDetail(orderId);
    setOrderDetail(orderDetailData);

    // ตั้งค่าคำสั่งซื้อที่เลือกเพื่อส่งไปยัง modal
    const selectedOrder = orders.find((order) => order.order_id === orderId);
    setSelectedOrder(selectedOrder);

    // เปิด modal
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-2">
      <Table
        aria-label="table"
        color="danger"
        radius="lg"
        emptyWrapper={isEmpty}
        bottomContentPlacement="outside"
        bottomContent={
          isEmpty ? null : (
            <Pagination
              showControls
              page={page}
              total={pages}
              variant="light"
              onChange={setPage}
              className="flex justify-center"
            />
          )
        }
        classNames={{
          wrapper: "p-0 !gap-0",
          th: "p-4",
          td: "p-4",
          tbody: "!p-0",
        }}
      >
        <TableHeader className="bg-primary-300" columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        <TableBody>
          {items.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell>{order.order_id}</TableCell>
              <TableCell>{getUserFullName(order.user_id)}</TableCell>
              <TableCell>{formatAddress(address[order.user_id])}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.total_amount ?? "ไม่ระบุ"}</TableCell>
              <TableCell>
                {order.shipping_date
                  ? new Date(order.shipping_date).toLocaleDateString()
                  : "ไม่ระบุ"}
              </TableCell>
              <TableCell>{order.order_status}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleViewOrderDetails(order.order_id)}
                  className="text-blue-500 underline"
                >
                  รายละเอียด
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        orderDetail={orderDetail}
      />
    </div>
  );
};

export default TableSection;
