"use client";

import Button from "@/components/ui/Buttons";
import Pagination from "@/components/ui/Pagination/index";
import Table from "@/components/ui/Table";
import Text from "@/components/ui/Text";
import TooltipIcon from "@/components/ui/Tooltip";
import { columns } from "../../../../../lib/data";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { FC, useMemo, useState, useEffect } from "react";

// ฟังก์ชันเพื่อดึงข้อมูลจาก API /orders
const fetchOrders = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// ฟังก์ชันเพื่อดึงข้อมูลจาก API /users
const fetchUsers = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const TableSection: FC = () => {
  const [orders, setOrders] = useState<any[]>([]); // เก็บข้อมูลจาก API
  const [users, setUsers] = useState<any[]>([]); // เก็บข้อมูลผู้ใช้จาก API
  const [isLoading, setIsLoading] = useState(true); // การแสดงสถานะการโหลด

  // ดึงข้อมูลจาก API เมื่อ Component โหลด
  useEffect(() => {
    const getData = async () => {
      const ordersData = await fetchOrders();
      const usersData = await fetchUsers();
      setOrders(ordersData); // เก็บข้อมูลคำสั่งซื้อ
      setUsers(usersData); // เก็บข้อมูลผู้ใช้
      setIsLoading(false);
    };

    getData();
  }, []);

  const isEmpty = orders.length === 0; // ตรวจสอบว่าข้อมูลว่างหรือไม่
  const [rowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage); // คำนวณจำนวนหน้า

  // คำนวณข้อมูลที่จะแสดงในตาราง
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end); // ตัดข้อมูลเพื่อแสดงในหน้าปัจจุบัน
  }, [page, rowsPerPage, orders]);

  // ฟังก์ชันเพื่อหา user ที่ตรงกับ user_id
  const getUserFullName = (userId: number) => {
    const user = users.find((user) => user.user_id === userId); // เปลี่ยนจาก user_id เป็น user.user_id
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้"; // ใช้ user.name และ user.lastname
  };

  // แสดงข้อความโหลดขณะดึงข้อมูล
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-2">
      <Table
        topContent={<></>} // ไม่ต้องการแสดงส่วนของการเลือกหลายรายการ
        aria-label="table"
        color="danger"
        radius="lg"
        emptyWrapper={isEmpty}
        bottomContentPlacement="outside"
        bottomContent={
          isEmpty ? (
            <></>
          ) : (
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
              {/* แสดงชื่อและนามสกุลของผู้ใช้ */}
              <TableCell>{order.address}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.total_amount}</TableCell>
              <TableCell>
                {new Date(order.shipping_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.order_status}</TableCell>
              <TableCell>{order.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSection;
