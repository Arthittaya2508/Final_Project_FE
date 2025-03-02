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
import Link from "next/link";
import AddProduct from "./addProduct";
import { product } from "../../../lib/data"; // Import product for columns

export type Products = {
  pro_id: number;
  sku: string;
  pro_name: string;
  pro_des: string;
  category_id: number;
  brand_id: number;
};

export type Categories = {
  category_id: number;
  category_name: string;
};

export type Brands = {
  brand_id: number;
  brand_name: string;
};

const ProductTable: FC = () => {
  const [orders, setOrders] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชัน fetchData ที่สามารถเรียกใช้ได้จากที่อื่น
  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`),
      ]);

      if (!productsRes.ok || !categoriesRes.ok || !brandsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [productsData, categoriesData, brandsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        brandsRes.json(),
      ]);

      setOrders(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
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

  const refreshProducts = () => {
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
          เพิ่มข้อมูลสินค้า
        </button>
      </div>

      <Table
        aria-label="table"
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
      >
        {/* TableHeader using the imported product for columns */}
        <TableHeader columns={product}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        <TableBody>
          {items.map((product) => {
            const categoryName =
              categories.find((c) => c.category_id === product.category_id)
                ?.category_name || "ไม่ระบุ";
            const brandName =
              brands.find((b) => b.brand_id === product.brand_id)?.brand_name ||
              "ไม่ระบุ";

            return (
              <TableRow key={product.pro_id}>
                <TableCell>{product.pro_id}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.pro_name}</TableCell>
                <TableCell>{product.pro_des}</TableCell>
                <TableCell>{categoryName}</TableCell>
                <TableCell>{brandName}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/products/product_details?pro_id=${product.pro_id}`}
                  >
                    <u>รายละเอียด</u>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal for adding product */}
      {isModalOpen && (
        <AddProduct
          isOpen={isModalOpen}
          onClose={closeModal}
          onProductAdded={refreshProducts}
        />
      )}
    </div>
  );
};

export default ProductTable;
