import React, { FC, useMemo, useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination/index";
import Table from "@/components/ui/Table";
import { columns } from "../../../../../lib/data";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import Link from "next/link";

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

export type StatusOrders = {
  status_id: number;
  status_name: string;
};

export type Transports = {
  transport_id: number;
  transport_name: string;
};

export type Order = {
  order_id: number;
  user_id: number;
  order_date: number;
  total_amount: number;
  shipping_date: number;
  status_id: number;
  transport_id: number;
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
  const [statusOrders, setStatusOrders] = useState<StatusOrders[]>([]);
  const [transports, setTransports] = useState<Transports[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orderAdmin`
        );
        const usersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userAdmin`
        );
        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/status_orders`
        );
        const transportsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transports`
        );

        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        const statusData = await statusRes.json();
        const transportsData = await transportsRes.json();

        const sortedOrders = ordersData.sort(
          (a: Order, b: Order) => b.order_date - a.order_date
        );

        setOrders(sortedOrders);
        setUsers(usersData);
        setStatusOrders(statusData);
        setTransports(transportsData);

        const addressData = await Promise.all(
          usersData.map(async (user: Users) => ({
            userId: user.user_id,
            address: await fetchAddress(user.user_id),
          }))
        );

        setAddress(
          Object.fromEntries(
            addressData.map(({ userId, address }) => [userId, address])
          )
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      selectedStatus !== null
        ? orders.filter((order) => order.status_id === selectedStatus)
        : orders
    );
  }, [selectedStatus, orders]);

  const getUserFullName = (userId: number) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้";
  };

  const getTransportName = (transportId: number) => {
    const transport = transports.find((t) => t.transport_id === transportId);
    return transport ? transport.transport_name : "ไม่ระบุ";
  };

  const formatAddress = (userAddress: Address | null) => {
    return userAddress
      ? `${userAddress.address_name}, ${userAddress.district}, ${userAddress.amphoe}, ${userAddress.province} ${userAddress.zipcode}`
      : "-";
  };

  const handleViewOrderDetails = async (orderId: number) => {
    const order = orders.find((o) => o.order_id === orderId);
    setSelectedOrder(order || null);
    setOrderDetail(order ? await fetchOrderDetail(orderId) : []);
    setIsModalOpen(true);
  };

  const fetchAddress = async (userId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/address?user_id=${userId}`
      );
      const data = await res.json();
      return data[0] || null;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const fetchOrderDetail = async (orderId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order_details?order_id=${orderId}`
      );
      const data = await res.json();
      return data;
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

  const sortedFilteredOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
        : new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
    );
  }, [filteredOrders, sortOrder]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedFilteredOrders.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, sortedFilteredOrders]);

  return (
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
                {orders.filter((order) => order.status_id === status.status_id)
                  .length || 0}
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

      {/* 🔽 ตัวเลือกเรียงวันที่ */}
      <div className="flex justify-end p-2 ">
        <div className="flex items-center space-x-2 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-sm font-medium text-gray-700">
            เรียงตามวันที่:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="desc">ใหม่ → เก่า</option>
            <option value="asc">เก่า → ใหม่</option>
          </select>
        </div>
      </div>
      {/* ตาราง */}
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
                {(() => {
                  const status = orderStatuses.find(
                    (s) => s.status_id === order.status_id
                  );
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        status?.bgColor || "bg-gray-400"
                      }`}
                    >
                      {status?.label || "ไม่ระบุ"}
                    </span>
                  );
                })()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/dashboard/order_details?order_id=${order.order_id}`}
                >
                  <button className="text-blue-600 underline">
                    ดูรายละเอียด
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSection;
