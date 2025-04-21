import Button from "@/components/ui/Buttons";
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
import AddTransport from "./addTransport";
import { transport } from "../../../lib/data"; // Import transport for columns

export type Transports = {
  transport_id: number;
  transport_name: string;
  transport_cost: number;
};

const TransportsTable: FC = () => {
  const [orders, setOrders] = useState<Transports[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชัน fetchData ที่สามารถเรียกใช้ได้จากที่อื่น
  const fetchData = async () => {
    try {
      const [transportsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/transports`),
      ]);

      if (!transportsRes.ok) {
        throw new Error("Failed to fetch transports data");
      }

      const transportsData = await transportsRes.json();

      setOrders(transportsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isEmpty = orders.length === 0;
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [page, rowsPerPage, orders]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshTransports = () => {
    setIsLoading(true);
    fetchData(); // เรียกใช้ฟังก์ชัน fetchData ที่ย้ายมาจาก useEffect
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
          เพิ่มข้อมูลขนส่ง
        </button>
      </div>
      <Table
        aria-label="table"
        emptyWrapper={isEmpty}
        bottomContentPlacement="outside"
        bottomContent={
          isEmpty ? (
            <div className="text-center text-gray-500 py-10">
              ไม่มีข้อมูลขนส่ง
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
        {/* TableHeader using the imported transport for columns */}
        <TableHeader columns={transport}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        <TableBody>
          {items.map((transport) => (
            <TableRow key={transport.transport_id}>
              <TableCell>{transport.transport_id}</TableCell>
              <TableCell>{transport.transport_name}</TableCell>
              {/* <TableCell>{transport.transport_cost}</TableCell> */}
              {/* <TableCell>รายละเอียด</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <AddTransport
          isOpen={isModalOpen}
          onClose={closeModal}
          onTransportAdded={refreshTransports}
        />
      )}
    </div>
  );
};

export default TransportsTable;
