import {
  newArrivalsData,
  relatedProductData,
  topSellingData,
} from "@/app/user/page";
import ProductListSec from "../../../../../components/common/ProductListSec";
import BreadcrumbProduct from "../../../../../components/product-page/BreadcrumbProduct";
import Header from "../../../../../components/product-page/Header";
import Tabs from "../../../../../components/product-page/Tabs";
import { Product } from "../../../../../types/product.types";
import { notFound } from "next/navigation";

// ฟังก์ชันนี้ใช้แสดงราคาภาษาไทย (THB)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

const data: Product[] = [
  ...newArrivalsData,
  ...topSellingData,
  ...relatedProductData,
];

export default function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const productData = data.find(
    (product) => product.id === Number(params.slug[0])
  );

  if (!productData?.title) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.title ?? "product"} />
        <section className="mb-11">
          <Header
            data={{
              ...productData,
              // เก็บราคาเป็น number และแสดงผลด้วย formatPrice
              price: productData.price,
              discount: {
                ...productData.discount,
                amount: productData.discount.amount,
              },
            }}
          />
        </section>
        <Tabs />
      </div>
      <div className="mb-[50px] sm:mb-20 mt-36">
        <ProductListSec
          title="สินค้าที่คล้ายกัน"
          data={relatedProductData.map((product) => ({
            ...product,
            // เก็บราคาเป็น number และแสดงผลด้วย formatPrice
            price: product.price,
            discount: {
              ...product.discount,
              amount: product.discount.amount,
            },
          }))}
        />
      </div>
    </main>
  );
}
