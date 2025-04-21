// import Button from "@/components/ui/Buttons";
import Pagination from "@/components/ui/Pagination/index";
import Table from "@/components/ui/Table";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { FC, useMemo, useState, useEffect } from "react";
import { user } from "../../../lib/data"; // Import user for columns

export type Users = {
  user_id: number;
  name: string;
  lastname: string;
  telephone: string;
  email: string;
  address: string;
  username: string;
};

const UsersTable: FC = () => {
  const [users, setUsers] = useState<Users[]>([]); // เปลี่ยนจาก orders เป็น users
  const [isLoading, setIsLoading] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชัน fetchData สำหรับดึงข้อมูลผู้ใช้
  const fetchData = async () => {
    try {
      const [usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/userAdmin`), // ดึงข้อมูลผู้ใช้แทน
      ]);

      if (!usersRes.ok) {
        throw new Error("Failed to fetch users data");
      }

      const usersData = await usersRes.json();

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isEmpty = users.length === 0;
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, rowsPerPage, users]);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  // const refreshUsers = () => {
  //   setIsLoading(true);
  //   fetchData(); // เรียกใช้ฟังก์ชัน fetchData ที่ย้ายมาจาก useEffect
  // };

  if (isLoading) {
    return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="mt-4">
      {/* <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          เพิ่มข้อมูลผู้ใช้
        </button>
      </div> */}
      <Table
        aria-label="table"
        emptyWrapper={isEmpty}
        bottomContentPlacement="outside"
        bottomContent={
          isEmpty ? (
            <div className="text-center text-gray-500 py-10">
              ไม่มีข้อมูลผู้ใช้
            </div>
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
        {/* TableHeader using the imported user for columns */}
        <TableHeader columns={user}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        <TableBody>
          {items.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.telephone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>รายละเอียด</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
