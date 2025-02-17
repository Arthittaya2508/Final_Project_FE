import React, { Suspense, useEffect, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/nav/nav";
import ProductDetailsPage, { ProductDetails } from "./product-details/[pro_id]"; // Import ProductDetails type
import { useRouter } from "next/router";

export default function AdminLayoutPage() {
  const router = useRouter();
  const { pro_id } = router.query; // ดึง pro_id จาก query

  const [initialProductDetails, setInitialProductDetails] = useState<
    ProductDetails[]
  >([]); // Set as an array

  useEffect(() => {
    if (pro_id) {
      const fetchInitialProductDetails = async () => {
        const res = await fetch(`/api/product_details/${pro_id}`); // เรียก API เพื่อดึงรายละเอียดผลิตภัณฑ์
        const data = await res.json();
        setInitialProductDetails([data]); // Wrap data in an array
      };

      fetchInitialProductDetails();
    }
  }, [pro_id]);

  return (
    <div className="flex">
      <Sidebar /> {/* แสดง Sidebar */}
      <div className="flex-grow">
        <Navbar /> {/* แสดง Navbar */}
        <Suspense fallback={<>Loading...</>}>
          {initialProductDetails.length > 0 ? ( // Check if there are product details
            <ProductDetailsPage initialProductDetails={initialProductDetails} />
          ) : (
            <div>Loading product details...</div> // แสดงข้อความขณะรอข้อมูล
          )}
        </Suspense>
      </div>
    </div>
  );
}
