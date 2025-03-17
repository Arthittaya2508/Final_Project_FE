import React, { FC, useMemo, useState, useEffect } from "react";
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
import axios from "axios";

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

export type status_orders = {
  status_id: number;
  status_name: string;
};

export type Order = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
};

const orderStatuses = [
  { label: "ที่ยังไม่ได้รับ", status_id: 1, bgColor: "bg-yellow-400" },
  { label: "ที่กำลังจัดเตรียม", status_id: 2, bgColor: "bg-orange-400" },
  { label: "รอขนส่งมารับ", status_id: 3, bgColor: "bg-blue-400" },
  { label: "ที่จัดส่งแล้ว", status_id: 4, bgColor: "bg-indigo-400" },
  { label: "ที่ส่งเรียบร้อย", status_id: 5, bgColor: "bg-green-400" },
  { label: "ที่ยกเลิก", status_id: 6, bgColor: "bg-red-400" },
];

const TableSection: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [address, setAddress] = useState<Record<number, Address | null>>({});
  const [statusOrders, setStatusOrders] = useState<status_orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(1); // Set default status to "ที่ยังไม่ได้รับ" (status_id = 1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`
        );
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`
        );
        const statusOrdersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/status_orders`
        );

        setOrders(ordersResponse.data);
        setUsers(usersResponse.data);
        setStatusOrders(statusOrdersResponse.data);

        const addressPromises = usersResponse.data.map(async (user: Users) => {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStatus !== null) {
      const filtered = orders.filter(
        (order) => order.status_id === selectedStatus
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [selectedStatus, orders]);

  const getUserFullName = (userId: number) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้";
  };

  const getStatusName = (statusId: number) => {
    const status = statusOrders.find((status) => status.status_id === statusId);
    return status ? status.status_name : "ไม่ระบุ";
  };

  const formatAddress = (userAddress: Address | null) => {
    return userAddress
      ? `${userAddress.address_name}, ${userAddress.district}, ${userAddress.amphoe}, ${userAddress.province} ${userAddress.zipcode}`
      : "-";
  };

  const handleViewOrderDetails = async (orderId: number) => {
    const orderDetailData = await fetchOrderDetail(orderId);
    setOrderDetail(orderDetailData);

    const selectedOrder = orders.find((order) => order.order_id === orderId);
    setSelectedOrder(selectedOrder);

    setIsModalOpen(true);
  };

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

  const fetchOrderDetail = async (orderId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order_detail?order_id=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return [];
    }
  };

  const handleStatusChange = (statusId: number) => {
    setSelectedStatus(statusId);
  };

  const isEmpty = filteredOrders.length === 0;
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(filteredOrders.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredOrders]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-2">
      <div className=" mb-6">
        <div className="flex items-center min-w-[800px]">
          {orderStatuses.map((status, index) => (
            <React.Fragment key={status.label}>
              <div
                className="flex flex-col items-center cursor"
                onClick={() => handleStatusChange(status.status_id)}
              >
                <div
                  className={`${
                    status.bgColor
                  } w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base cursor-pointer ${
                    selectedStatus === status.status_id
                      ? "ring-4 ring-indigo-500"
                      : "" // เพิ่มวงกลมรอบสถานะที่เลือก
                  }`}
                  onClick={() => handleStatusChange(status.status_id)} // เพิ่มการคลิกเพื่อเลือกสถานะ
                >
                  {orders.filter(
                    (order) => order.status_id === status.status_id
                  ).length || 0}
                </div>
                <span className="text-xs lg:text-sm mt-2 text-center w-20 lg:w-24 cursor">
                  {status.label}
                </span>
              </div>
              {index < orderStatuses.length - 1 && (
                <div className="h-[2px] bg-gray-300 flex-grow mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

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
          {items.map((order, index) => (
            <TableRow key={order.order_id}>
              <TableCell>{index + 1}</TableCell>
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
              <TableCell>{getStatusName(order.status_id)}</TableCell>
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
