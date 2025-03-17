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
import { useRouter } from "next/navigation"; // Import useRouter hook

type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  stock_quantity: number;
  pro_image: string;
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
  const router = useRouter(); // Initialize router

  const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [genders, setGenders] = useState<Genders[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductDetail = async () => {
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
        setProductDetail([]);
        return;
      }
      setProductDetail(data);
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
    await fetchProductDetail();
  };

  useEffect(() => {
    fetchData();
  }, [pro_id]);

  const refreshProducts = () => {
    fetchProductDetail();
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
      {productDetail.length === 0 ? (
        <div>❌ ยังไม่มีรายการสินค้า</div>
      ) : (
        <Table aria-label="product-details-table">
          <TableHeader>
            <TableColumn>ลำดับที่</TableColumn>
            <TableColumn>📌 รหัสสินค้า</TableColumn>
            <TableColumn>🖼️ รูปสินค้า</TableColumn>
            <TableColumn>สี</TableColumn>
            {/* <TableColumn>🚻 เพศ</TableColumn> */}
            <TableColumn>รายละเอียด</TableColumn>
            <TableColumn>action</TableColumn>
          </TableHeader>

          <TableBody>
            {productDetail.map((productDetail) => {
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
                <TableRow key={productDetail.pro_detail_id}>
                  <TableCell>{productDetail.pro_detail_id}</TableCell>
                  <TableCell>{productName}</TableCell>
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
                  <TableCell>{colorName}</TableCell>

                  {/* <TableCell>{genderName}</TableCell> */}
                  <TableCell
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push(
                        `/admin/products/itemProduct?pro_detail_id=${productDetail.pro_detail_id}`
                      )
                    } // Navigate to itemProduct
                  >
                    รายละเอียด
                  </TableCell>
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

export default ProductDetailPage;
