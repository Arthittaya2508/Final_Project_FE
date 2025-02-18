"use client";
import Button from "../../components/Buttons";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Text from "../../components/Text";
import { TooltipIcon } from "../../components/Tooltip/tooltipicons";
import { product, productData } from "../../../../lib/data";
import {
  Selection,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { FC, useMemo, useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Link from "next/link";  // เพิ่มการใช้งาน Link

const ProductTable: FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [orders, setOrders] = useState<any[]>([]); // ข้อมูล orders ใช้ productData แทน
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(false);  // เพิ่มสถานะการแสดงปุ่มลบ

  // ใช้ productData แทน
  useEffect(() => {
    setOrders(productData);
    setIsLoading(false);
  }, []);

  // ฟังก์ชันลบข้อมูลหลายรายการ
  const handleMultipleDelete = () => {
    if (selectedKeys === "all") {
      setOrders([]);
    } else {
      const selectedID = Array.from(selectedKeys);
      setOrders((prev) =>
        prev.filter(
          (order) => !selectedID.includes(order.id.toString())
        )
      );
    }
    setSelectedKeys(new Set());
    setShowDeleteButton(false); // ซ่อนปุ่มหลังจากการลบ
  };

  // แสดงปุ่มลบเมื่อมีการเลือกสินค้า
  useEffect(() => {
    if (selectedKeys === "all" || selectedKeys.size > 0) {
      setShowDeleteButton(true);
    } else {
      setShowDeleteButton(false);
    }
  }, [selectedKeys]);

  const isEmpty = orders.length === 0;
  const [rowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(orders.length / rowsPerPage);

  // แบ่งข้อมูลตาม Pagination
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [page, rowsPerPage, orders]);

  // แสดง Loading ระหว่างดึงข้อมูล
  if (isLoading) {
    return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  }

  // ฟังก์ชันเพื่อป้องกันการเลือกเมื่อคลิกที่ row
  const handleRowClick = (id: string) => {
    // ส่งผู้ใช้ไปยังหน้ารายละเอียดของสินค้า
    window.location.href = `/admin/page/product-details?id=${id}`;
  };

  return (
 
      <div className="mt-4">
        <Table
          topContent={
            showDeleteButton ? (
              <div className="flex w-full items-center justify-between bg-red-100 p-2 px-4 rounded-lg">
                <Text variant="text-table" className="text-red-600">
                  {selectedKeys === "all"
                    ? "เลือกทั้งหมด"
                    : `เลือกแล้ว ${selectedKeys.size} รายการ`}
                </Text>
                <div className="flex justify-end">
                  <Button
                    size="icon"
                    isIconOnly={true}
                    className="text-red-600"
                    onClick={handleMultipleDelete}
                  >
                    <TooltipIcon icon={<FaRegTrashCan />} tooltip="ลบ" />
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )
          }
          aria-label="table"
          selectionMode="multiple"
          emptyWrapper={isEmpty}
          bottomContentPlacement="outside"
          bottomContent={
            isEmpty ? (
              <div className="text-center text-gray-500 py-10">
                ไม่มีข้อมูลคำสั่งซื้อ
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
          onSelectionChange={setSelectedKeys}
          selectedKeys={selectedKeys}
        >
          <TableHeader columns={product}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>

          <TableBody>
            {items.map((product) => (
              <TableRow
                key={product.id}
                onClick={(e) => {
                  // หากคลิกที่แถวไม่ใช่ที่ checkbox, ไปยังหน้า product-details
                  if (!(e.target instanceof HTMLInputElement)) {
                    e.stopPropagation(); // หยุดการส่งเหตุการณ์ไปยัง checkbox selection
                    handleRowClick(product.id);
                  }
                }}  // คลิกเพื่อไปยังหน้า product-details
                className="cursor-pointer"  // เพิ่มลูกเล่นให้มีการคลิก
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  {/* ใช้ Link เพื่อสร้างลิงก์ไปยังหน้า product-details */}
                  <Link href={`/admin/page/product-details?id=${product.id}`}>
                    {product.detail}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

  );
};

export default ProductTable;

