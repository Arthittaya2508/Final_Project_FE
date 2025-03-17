"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Button } from "@/components/ui/button";
import AddProductDetail from "@/app/admin/products/addProductDetail";
import { SlOptionsVertical } from "react-icons/sl";

type ItemProductDetail = {
  item_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
};

export type Colors = {
  color_id: number;
  color_name: string;
};

export type Genders = {
  gender_id: number;
  gender_name: string;
};

export type Sizes = {
  size_id: number;
  size_name: string;
};
export type Products = {
  pro_id: number;
  sku: string;
};
const ItemProductDetailPage = () => {
  const searchParams = useSearchParams();
  const pro_detail_id = searchParams.get("pro_detail_id");

  const [ItemProductDetail, setItemProductDetail] = useState<
    ItemProductDetail[]
  >([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [genders, setGenders] = useState<Genders[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductDetails = async () => {
    if (!pro_detail_id) return;

    try {
      setIsLoading(true);
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/product_detail_items?pro_detail_id=${pro_detail_id}`;

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);

      const data = await res.json();
      if (!data || data.length === 0) {
        setError("ไม่พบข้อมูลสินค้า");
        setItemProductDetail([]);
        return;
      }
      setItemProductDetail(data);
      // } catch (error) {
      //   setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const [colorsRes, sizesRes, gendersRes] = await Promise.all([
        fetch(`${apiBaseUrl}/colors`),
        fetch(`${apiBaseUrl}/sizes`),
        fetch(`${apiBaseUrl}/products`),
      ]);

      if (!colorsRes.ok || !sizesRes.ok || !gendersRes.ok) {
        throw new Error("Failed to fetch additional data");
      }

      const [colorsData, sizesData, gendersData] = await Promise.all([
        colorsRes.json(),
        sizesRes.json(),
        gendersRes.json(),
        // productsRes.json(),
      ]);

      setColors(colorsData);
      setSizes(sizesData);
      setGenders(gendersData);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลเสริม");
    }
  };

  const fetchData = async () => {
    await fetchAdditionalData();
    await fetchProductDetails();
  };

  useEffect(() => {
    fetchData();
  }, [pro_detail_id]);

  const refreshProducts = () => {
    fetchProductDetails();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <div>⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div>❌ {error}</div>;

  return (
    <div className="product-details mt-4">
      <h1 className="mb-4 text-xl font-bold">📦 รายละเอียดสินค้า</h1>

      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        ➕ เพิ่มรายการสินค้า
      </Button>

      {/* Check if no product details */}
      {itemProductDetail.length === 0 ? (
        <div>❌ ยังไม่มีรายการสินค้า</div>
      ) : (
        <Table aria-label="product-details-table">
          <TableHeader>
            <TableColumn>ลำดับที่</TableColumn>
            <TableColumn>📌 รหัสสินค้า</TableColumn>
            <TableColumn>🖼️ รูปสินค้า</TableColumn>
            <TableColumn>🚻 เพศ</TableColumn>
            {/* <TableColumn>รายละเอียด</TableColumn> */}
            <TableColumn>action</TableColumn>
          </TableHeader>

          <TableBody>
            {itemProductDetail.map((itemProductDetail) => {
              const colorName =
                colors.find((c) => c.color_id === itemProductDetail.color_id)
                  ?.color_name || "ไม่ระบุ";
              const sizeName =
                sizes.find((s) => s.size_id === itemProductDetail.size_id)
                  ?.size_name || "ไม่ระบุ";
              const genderName =
                genders.find((g) => g.gender_id === itemProductDetail.gender_id)
                  ?.gender_name || "ไม่ระบุ";
              const productName =
                products.find((g) => g.pro_id === itemProductDetail.pro_id)
                  ?.sku || "ไม่ระบุ";

              return (
                <TableRow key={itemProductDetail.detail_id}>
                  <TableCell>{itemProductDetail.detail_id}</TableCell>
                  <TableCell>{productName}</TableCell>
                  <TableCell>
                    {itemProductDetail.pro_image ? (
                      <img
                        src={itemProductDetail.pro_image}
                        alt="Product"
                        width={100}
                      />
                    ) : (
                      "ไม่มีรูปภาพ"
                    )}
                  </TableCell>

                  <TableCell>{genderName}</TableCell>
                  {/* <TableCell>
                    <u>รายละเอียด</u>
                  </TableCell> */}
                  <TableCell>
                    <SlOptionsVertical />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {isModalOpen && (
        <AddProductDetail
          isOpen={isModalOpen}
          onClose={closeModal}
          onProductAdded={refreshProducts}
          pro_id={pro_id ? Number(pro_id) : 0}
        />
      )}
    </div>
  );
};

export default ItemProductDetailPage;
