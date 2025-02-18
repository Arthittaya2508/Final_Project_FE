"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

// ประกาศ type สำหรับ ProductDetails
export type ProductDetails = {
  pro_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  stock_quantity: number;
  sku: string;
  pro_image: string;
};

interface Color {
  color_id: number;
  color_name: string;
}
interface Size {
  size_id: number;
  size_name: string;
}
interface Gender {
  gender_id: number;
  gender_name: string;
}

const ProductDetailsPage = ({
  initialProductDetails,
}: {
  initialProductDetails: ProductDetails[] | null; // เปลี่ยนให้สามารถเป็น null ได้
}) => {
  const router = useRouter();
  const { pro_id } = router.query;
  const [productDetails, setProductDetails] = useState<ProductDetails[]>(
    initialProductDetails || []
  );
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pro_id && !initialProductDetails) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [productDetailsRes, colorsRes, sizesRes, gendersRes] =
            await Promise.all([
              fetch(`/api/product_details/${pro_id}`),
              fetch("/api/colors"),
              fetch("/api/sizes"),
              fetch("/api/genders"),
            ]);

          const productDetailsData = await productDetailsRes.json();
          const colorsData = await colorsRes.json();
          const sizesData = await sizesRes.json();
          const gendersData = await gendersRes.json();

          setProductDetails(productDetailsData);
          setColors(colorsData);
          setSizes(sizesData);
          setGenders(gendersData);
        } catch (error) {
          setError("Failed to fetch data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [pro_id, initialProductDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (productDetails.length === 0) {
    return <div>No product details found.</div>; // แสดงข้อความเมื่อไม่มีข้อมูล
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Product Details</h1>
      <div className="overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Color</th>
              <th className="py-2">Size</th>
              <th className="py-2">Gender</th>
              <th className="py-2">Stock Quantity</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.map((detail) => (
              <tr key={detail.sku} className="border-t">
                <td className="py-2 px-4">
                  {
                    colors.find((c) => c.color_id === detail.color_id)
                      ?.color_name
                  }
                </td>
                <td className="py-2 px-4">
                  {sizes.find((s) => s.size_id === detail.size_id)?.size_name}
                </td>
                <td className="py-2 px-4">
                  {
                    genders.find((g) => g.gender_id === detail.gender_id)
                      ?.gender_name
                  }
                </td>
                <td className="py-2 px-4">{detail.stock_quantity}</td>
                <td className="py-2 px-4">{detail.sku}</td>
                <td className="py-2 px-4">
                  <img
                    src={detail.pro_image}
                    alt={`Product ${detail.sku}`}
                    className="h-16 w-16 object-cover"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin/admin-products" passHref>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Back to Products
        </button>
      </Link>
    </div>
  );
};

// ฟังก์ชัน server-side เพื่อดึงรายละเอียดผลิตภัณฑ์เริ่มต้น
export async function getServerSideProps(context: {
  params: { pro_id: string };
}) {
  const { pro_id } = context.params;

  const res = await fetch(
    `http://localhost:3000/api/product_details/${pro_id}`
  );
  const initialProductDetails = await res.json();

  return { props: { initialProductDetails } };
}

export default ProductDetailsPage;
