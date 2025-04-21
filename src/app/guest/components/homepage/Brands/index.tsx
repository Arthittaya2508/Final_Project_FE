import Image from "next/image";
import React from "react";

const brandsData: { id: string; srcUrl: string }[] = [
  { id: "poligan", srcUrl: "/icons/poligan.png" },
  { id: "lugust", srcUrl: "/icons/lugust.png" },
  { id: "grand", srcUrl: "/icons/grand.png" },
  { id: "warrix", srcUrl: "/icons/warrix.png" },
  { id: "ryu", srcUrl: "/icons/ryu.png" },
];

const Brands = () => {
  return (
    <div className="bg-te-papa-green-900">
      <div className="max-w-frame mx-auto flex flex-wrap items-center justify-center md:justify-between py-5 md:py-0 sm:px-4 xl:px-0 gap-7">
        {brandsData.map((brand) => (
          <div
            key={brand.id}
            className="w-[120px] h-[ุ80px] flex items-center justify-center"
          >
            <Image
              priority
              src={brand.srcUrl}
              width={120} // กำหนดขนาดให้เท่ากัน
              height={40}
              alt={brand.id}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
