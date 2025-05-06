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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

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
    let ordersToFilter = orders;

    if (selectedStatus !== null) {
      ordersToFilter = ordersToFilter.filter(
        (order) => order.status_id === selectedStatus
      );
    }

    if (selectedMonth !== null && selectedYear !== null) {
      ordersToFilter = ordersToFilter.filter((order) => {
        const date = new Date(order.order_date);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
    }

    setFilteredOrders(ordersToFilter);
  }, [selectedStatus, selectedMonth, selectedYear, orders]);

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

  const handleStatusChange = (statusId: number) => {
    setSelectedStatus(statusId);
  };

  const isEmpty = filteredOrders.length === 0;
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

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    orders.forEach((order) => {
      const year = new Date(order.order_date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  return (
    <div className="mb-6">
      {/* Filter by status */}
      <div className="flex items-center min-w-[800px] overflow-x-auto pb-4 mt-4">
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
                    : ""
                }`}
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

      {/* Sorting and filter by month/year */}
      <div className="flex justify-end p-2 gap-4 flex-wrap">
        <div className="flex items-center space-x-2 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-sm font-medium text-gray-700">
            เรียงตามวันที่:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="desc">ใหม่ → เก่า</option>
            <option value="asc">เก่า → ใหม่</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-sm font-medium text-gray-700">เดือน:</label>
          <select
            value={selectedMonth || ""}
            onChange={(e) => setSelectedMonth(Number(e.target.value) || null)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">ทั้งหมด</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("th-TH", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex items-center space-x-2 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-sm font-medium text-gray-700">ปี:</label>
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">ทั้งหมด</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year + 543}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Table */}
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
