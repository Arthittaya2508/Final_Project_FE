"use client";
import { useState, useEffect } from "react";

export type Products = {
  pro_id: number;
  sku: string;
  pro_name: string;
  pro_des: string;
  category_id: number;
  brand_id: number;
};

export type ProductDetail = {
  pro_detail_id: number;
  pro_id: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  stock_quantity: number;
  pro_image: string;
};

export type ItemProductDetails = {
  item_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
  detail_id: number;
};

const ProductCard = ({ pro_id }: { pro_id: number }) => {
  const [product, setProduct] = useState<Products | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const [itemDetails, setItemDetails] = useState<ItemProductDetails[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        const productData = await productRes.json();
        console.log("Product Data:", productData); // ตรวจสอบข้อมูลที่ได้รับ
        setProduct(productData || null);

        if (productData) {
          // Fetch product detail data
          const detailRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product_details/${pro_id}`
          );
          const detailData = await detailRes.json();
          console.log("Detail Data:", detailData); // ตรวจสอบข้อมูลที่ได้รับ
          setProductDetail(detailData || null);

          if (detailData) {
            // Fetch product item data
            const itemRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/product_detail_items/${detailData.pro_detail_id}`
            );
            const itemData = await itemRes.json();
            console.log("Item Data:", itemData); // ตรวจสอบข้อมูลที่ได้รับ
            setItemDetails(itemData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [pro_id]);

  // Calculate min and max sale price
  const minPrice =
    itemDetails.length > 0
      ? Math.min(...itemDetails.map((item) => item.sale_price))
      : 0;
  const maxPrice =
    itemDetails.length > 0
      ? Math.max(...itemDetails.map((item) => item.sale_price))
      : 0;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {productDetail && product && (
        <>
          {/* Display product image */}
          <img
            className="w-full"
            src={productDetail.pro_image}
            alt={product.pro_name}
          />

          <div className="px-6 py-4">
            {/* Display product name */}
            <div className="font-bold text-xl mb-2">{product.pro_name}</div>

            {/* Display product description */}
            <p className="text-gray-700 text-base">{product.pro_des}</p>
          </div>

          <div className="px-6 py-4">
            {/* Display price range */}
            <div className="text-lg font-semibold">
              {minPrice === maxPrice
                ? `Price: $${minPrice}`
                : `Price: $${minPrice} - $${maxPrice}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
