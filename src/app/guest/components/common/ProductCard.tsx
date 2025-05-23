import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../../../types/product.types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link
      href={`/guest/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
      {/* เพิ่มรายละเอียดสินค้า */}
      <div className="text-sm text-gray-600 mt-2">
        <p>{data.description}</p>
      </div>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        {/* แสดงราคาโดยไม่แปลงจาก USD */}
        {data.discount.percentage > 0 ? (
          <span className="font-bold text-black text-xl xl:text-2xl">
            {formatPrice(
              data.price - (data.price * data.discount.percentage) / 100
            )}
          </span>
        ) : data.discount.amount > 0 ? (
          <span className="font-bold text-black text-xl xl:text-2xl">
            {formatPrice(data.price - data.discount.amount)}
          </span>
        ) : (
          <span className="font-bold text-black text-xl xl:text-2xl">
            {formatPrice(data.price)}
          </span>
        )}
        {data.discount.percentage > 0 && (
          <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            {formatPrice(data.price)}
          </span>
        )}
        {data.discount.amount > 0 && (
          <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            {formatPrice(data.price)}
          </span>
        )}
        {data.discount.percentage > 0 ? (
          <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
            {`-${data.discount.percentage}%`}
          </span>
        ) : (
          data.discount.amount > 0 && (
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              {`-${data.discount.amount}`}
            </span>
          )
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
