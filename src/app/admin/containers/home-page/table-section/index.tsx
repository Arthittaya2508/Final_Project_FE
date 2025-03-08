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

const fetchAddress = async (userId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/address?user_id=${userId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data[0] || null; // ถ้ามีที่อยู่ให้ส่งคืนที่อยู่ตัวแรก
  } catch (error) {
    console.error("Error fetching address:", error);
    return null; // ถ้าไม่พบที่อยู่ให้ส่งคืน null
  }
};

const TableSection: FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<Users[]>([]); // กำหนดประเภทเป็น User
  const [address, setAddress] = useState<Record<number, Address | null>>({}); // เปลี่ยนเป็น Record
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const ordersData = await fetchOrders();
      const usersData = await fetchUsers();
      setOrders(ordersData);
      setUsers(usersData);

      // ดึงที่อยู่สำหรับทุกผู้ใช้
      const addressPromises = usersData.map(async (users: Users) => {
        const address = await fetchAddress(users.user_id); // เช็ค user_id ของผู้ใช้ที่กำลังดึง
        return { userId: users.user_id, address };
      });

      const addressData = await Promise.all(addressPromises);
      const addressMap = addressData.reduce((acc, { userId, address }) => {
        acc[userId] = address; // กำหนดที่อยู่ของแต่ละ user_id
        return acc;
      }, {} as Record<number, Address | null>);

      setAddress(addressMap);
      setIsLoading(false);
    };

    getData();
  }, []); // ใช้ [] เพื่อให้ effect นี้ทำงานครั้งเดียว

  const isEmpty = orders.length === 0;
  const [rowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [page, rowsPerPage, orders]);

  const getUserFullName = (userId: number) => {
    const user = users.find((user) => user.user_id === userId);
    return user ? `${user.name} ${user.lastname}` : "ไม่พบข้อมูลผู้ใช้";
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return "-"; // ถ้าไม่มีที่อยู่ให้แสดงข้อความ "-"
    return `${address.address_name}, ${address.district}, ${address.amphoe}, ${address.province} ${address.zipcode}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-2">
      <Table
        topContent={<></>}
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
              <TableCell>{order.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSection;
