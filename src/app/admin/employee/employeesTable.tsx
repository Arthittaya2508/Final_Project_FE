// src/components/ui/EmployeesTable.tsx
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
import AddEmployees from "./addEmployees";
// นำเข้าข้อมูลคอลัมน์จาก @/lib/data
import { employee } from "@/lib/data";

// ประเภทข้อมูลพนักงาน (Employee)
export type Employees = {
  emp_id: number;
  name: string;
  lastname: string;
  emp_code: string;
  telephone: string;
  email: string;
  position: string;
  image: string;
  username: string;
  password: string;
};

const EmployeesTable: FC = () => {
  const [employees, setEmployees] = useState<Employees[]>([]); // เปลี่ยนจาก users เป็น employees
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // การตั้งค่า modal state

  // ฟังก์ชัน fetchData สำหรับดึงข้อมูลพนักงาน
  const fetchData = async () => {
    try {
      const employeesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees`
      );
      if (!employeesRes.ok) {
        throw new Error("Failed to fetch employees data");
      }

      const employeesData = await employeesRes.json();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isEmpty = employees.length === 0;
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(employees.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return employees.slice(start, end);
  }, [page, rowsPerPage, employees]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshEmployees = () => {
    setIsLoading(true);
    fetchData(); // เรียกใช้ฟังก์ชัน fetchData ใหม่
  };

  if (isLoading) {
    return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          เพิ่มข้อมูลพนักงาน
        </button>
      </div>

      <Table
        aria-label="table"
        emptyWrapper={isEmpty}
        bottomContentPlacement="outside"
        bottomContent={
          isEmpty ? (
            <div className="text-center text-gray-500 py-10">
              ไม่มีข้อมูลพนักงาน
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
        {/* ใช้ข้อมูลคอลัมน์จาก @/lib/data */}
        <TableHeader>
          {employee.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {items.map((employee) => (
            <TableRow key={employee.emp_id}>
              <TableCell>{employee.emp_id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.lastname}</TableCell>
              <TableCell>{employee.emp_code}</TableCell>
              <TableCell>{employee.telephone}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>รายละเอียด</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* แสดง Modal เมื่อ `isModalOpen` เป็น true */}
      {isModalOpen && (
        <AddEmployees
          isOpen={isModalOpen}
          onClose={closeModal}
          onEmployeeAdded={refreshEmployees}
        />
      )}
    </div>
  );
};

export default EmployeesTable;
