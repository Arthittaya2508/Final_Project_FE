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

type ProductDetails = {
  detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  stock_quantity: number;
  pro_image: string;
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
const ProductDetailPage = () => {
  const searchParams = useSearchParams();
  const pro_id = searchParams.get("pro_id");

  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [genders, setGenders] = useState<Genders[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductDetails = async () => {
    if (!pro_id) return;

    try {
      setIsLoading(true);
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/product_details?pro_id=${pro_id}`;

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);

      const data = await res.json();
      if (!data || data.length === 0) {
        setError("ไม่พบข้อมูลสินค้า");
        setProductDetails([]);
        return;
      }
      setProductDetails(data);
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
      const [colorsRes, sizesRes, gendersRes, productsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/colors`),
        fetch(`${apiBaseUrl}/sizes`),
        fetch(`${apiBaseUrl}/genders`),
        fetch(`${apiBaseUrl}/products`),
      ]);

      if (!colorsRes.ok || !sizesRes.ok || !gendersRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch additional data");
      }

      const [colorsData, sizesData, gendersData, productsData] =
        await Promise.all([
          colorsRes.json(),
          sizesRes.json(),
          gendersRes.json(),
          productsRes.json(),
        ]);

      setColors(colorsData);
      setSizes(sizesData);
      setGenders(gendersData);
      setProducts(productsData);
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
  }, [pro_id]);

  const refreshProducts = () => {
    fetchProductDetails();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <div>⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div>❌ {error}</div>;
  if (!productDetails.length) return <div>❌ ไม่พบข้อมูลสินค้า</div>;

  return (
    <div className="product-details mt-4">
      <h1 className="mb-4 text-xl font-bold">📦 รายละเอียดสินค้า</h1>

      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        ➕ เพิ่มรายการสินค้า
      </Button>

      <Table aria-label="product-details-table">
        <TableHeader>
          <TableColumn>ลำดับที่</TableColumn>
          <TableColumn>📌 รหัสสินค้า</TableColumn>
          <TableColumn>🎨 สี</TableColumn>
          <TableColumn>📏 ขนาด</TableColumn>
          <TableColumn>🚻 เพศ</TableColumn>
          <TableColumn>📦 สต็อกคงเหลือ</TableColumn>
          <TableColumn>💰 ราคาขาย</TableColumn>
          <TableColumn>💵 ราคาทุน</TableColumn>
          <TableColumn>🖼️ รูปสินค้า</TableColumn>
          <TableColumn>action</TableColumn>
        </TableHeader>

        <TableBody>
          {productDetails.map((productDetail) => {
            const colorName =
              colors.find((c) => c.color_id === productDetail.color_id)
                ?.color_name || "ไม่ระบุ";
            const sizeName =
              sizes.find((s) => s.size_id === productDetail.size_id)
                ?.size_name || "ไม่ระบุ";
            const genderName =
              genders.find((g) => g.gender_id === productDetail.gender_id)
                ?.gender_name || "ไม่ระบุ";
            const productName =
              products.find((g) => g.pro_id === productDetail.pro_id)?.sku ||
              "ไม่ระบุ";

            return (
              <TableRow key={productDetail.detail_id}>
                <TableCell>{productDetail.detail_id}</TableCell>
                <TableCell>{productName}</TableCell>
                <TableCell>{colorName}</TableCell>
                <TableCell>{sizeName}</TableCell>
                <TableCell>{genderName}</TableCell>
                <TableCell>{productDetail.stock_quantity}</TableCell>
                <TableCell>{productDetail.sale_price ?? "N/A"}</TableCell>
                <TableCell>{productDetail.cost_price ?? "N/A"}</TableCell>
                <TableCell>
                  {productDetail.pro_image ? (
                    <img
                      src={productDetail.pro_image}
                      alt="Product"
                      width={100}
                    />
                  ) : (
                    "ไม่มีรูปภาพ"
                  )}
                </TableCell>
                <TableCell>
                  {/* <SlOptionsVertical onClick={() => console.log("Edit")} />
                  <SlOptionsVertical onClick={closeModal} />
                  <SlOptionsVertical onClick={() => console.log("Delete")} /> */}
                  <SlOptionsVertical />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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

export default ProductDetailPage;
