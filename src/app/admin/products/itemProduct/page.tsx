"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import AddItemProduct from "@/app/admin/products/itemProduct/addItemProduct";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Button } from "@/components/ui/button";

// Define Types
type ItemProductDetails = {
  item_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
  detail_id: number;
};

const ItemProductDetailsPage = () => {
  const searchParams = useSearchParams();
  const pro_detail_id = searchParams.get("pro_detail_id");

  const [itemProductDetails, setItemProductDetails] = useState<
    ItemProductDetails[]
  >([]);
  const [colors, setColors] = useState<
    { color_id: number; color_name: string }[]
  >([]);
  const [sizes, setSizes] = useState<{ size_id: number; size_name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductDetail = async () => {
    if (!pro_detail_id) return;
    try {
      setIsLoading(true);
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/product_detail_items?pro_detail_id=${pro_detail_id}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);
      const data = await res.json();
      setItemProductDetails(data.length > 0 ? data : []);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const [colorsRes, sizesRes] = await Promise.all([
        fetch(`${apiBaseUrl}/colors`),
        fetch(`${apiBaseUrl}/sizes`),
      ]);
      if (!colorsRes.ok || !sizesRes.ok)
        throw new Error("Failed to fetch additional data");
      setColors(await colorsRes.json());
      setSizes(await sizesRes.json());
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลเสริม");
    }
  };

  const fetchData = async () => {
    await fetchAdditionalData();
    await fetchProductDetail();
  };

  useEffect(() => {
    fetchData();
  }, [pro_detail_id]);

  const closeModal = () => setIsModalOpen(false);
  const refreshProducts = () => fetchProductDetail();

  if (isLoading) return <div>⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div>❌ {error}</div>;

  return (
    <div className="product-details mt-4">
      <h1 className="mb-4 text-xl font-bold">📦 รายละเอียดสินค้า</h1>

      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        ➕ เพิ่มรายการสินค้า
      </Button>

      {itemProductDetails.length === 0 ? (
        <div>❌ ยังไม่มีรายการสินค้า</div>
      ) : (
        <Table aria-label="product-details-table">
          <TableHeader>
            <TableColumn>ลำดับที่</TableColumn>
            {/* <TableColumn>🖼️ สี</TableColumn> */}
            <TableColumn>🚻 ขนาด</TableColumn>
            <TableColumn>จำนวน</TableColumn>
            <TableColumn>ราคาขาย</TableColumn>
            <TableColumn>ราคาทุน</TableColumn>
          </TableHeader>

          <TableBody>
            {itemProductDetails.map((item, index) => {
              const colorName =
                colors.find((c) => c.color_id === item.color_id)?.color_name ||
                "ไม่ระบุ";
              const sizeName =
                sizes.find((s) => s.size_id === item.size_id)?.size_name ||
                "ไม่ระบุ";

              return (
                <TableRow key={item.detail_id}>
                  <TableCell>{index + 1}</TableCell>
                  {/* <TableCell>{colorName}</TableCell> */}
                  <TableCell>{sizeName}</TableCell>
                  <TableCell>{item.stock_quantity}</TableCell>
                  <TableCell>{item.sale_price}</TableCell>
                  <TableCell>{item.cost_price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {isModalOpen && (
        <AddItemProduct
          isOpen={isModalOpen}
          onClose={closeModal}
          onProductAdded={refreshProducts}
          pro_detail_id={Number(pro_detail_id)}
        />
      )}
    </div>
  );
};

export default ItemProductDetailsPage;
