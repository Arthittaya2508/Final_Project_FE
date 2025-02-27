import ProductListSec from "../../components/common/ProductListSec";
import Brands from "../../components/homepage/Brands";
import DressStyle from "../../components/homepage/DressStyle";
import Header from "../../components/homepage/Header";
import { Product } from "../../types/product.types";
import { Review } from "../../types/review.types";

// ฟังก์ชันที่ใช้ในการแสดงราคาภาษาไทย
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "เสื้อแขนยาวกีฬา",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png", "/images/pic16.png", "/images/pic16.png"],
    price: 250, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "เสื้อแขนยาวที่เหมาะสำหรับการออกกำลังกาย",
  },
  {
    id: 2,
    title: "กางเกงกีฬา SkinFit",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 290, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
    description: "กางเกงกีฬา SkinFit ใส่สบายทั้งในและนอกฟิตเนส",
  },
  {
    id: 3,
    title: "เสื้อยืดกีฬา",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 199, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "เสื้อยืดกีฬาเหมาะสำหรับการฝึกซ้อมและการออกกำลังกาย",
  },
  {
    id: 4,
    title: "เสื้อวิ่งแขนสั้น",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png", "/images/pic17.png", "/images/pic17.png"],
    price: 279, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.5,
    description: "เสื้อวิ่งแขนสั้นสำหรับกิจกรรมกลางแจ้ง",
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "เสื้อวิ่งแขนยาว",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 299, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 5.0,
    description: "เสื้อวิ่งแขนยาวสวมใส่สบายในทุกสภาพอากาศ",
  },
  {
    id: 6,
    title: "กางเกงวิ่งกีฬา",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 290, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.0,
    description: "กางเกงวิ่งที่มีความยืดหยุ่นสูงและสะดวกสบาย",
  },
  {
    id: 7,
    title: "รองเท้ากีฬาเบาๆ",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 299, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 5,
    },
    rating: 4.0,
    description: "รองเท้ากีฬาที่มีน้ำหนักเบาและเหมาะสำหรับการวิ่งระยะสั้น",
  },
  {
    id: 8,
    title: "กางเกงขาสั้นกีฬา",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 279, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "กางเกงขาสั้นกีฬาเหมาะสำหรับการออกกำลังกายกลางแจ้ง",
  },
];

export const relatedProductData: Product[] = [
  {
    id: 9,
    title: "ชุดกีฬาเซ็ท",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 299, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.8,
    description: "ชุดกีฬาเซ็ทที่เหมาะสำหรับการออกกำลังกายที่ทุกคนต้องการ",
  },
  {
    id: 10,
    title: "เสื้อกีฬาแขนสั้น",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 249, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.2,
    description: "เสื้อกีฬาแขนสั้นที่ให้ความสบายระหว่างการเล่นกีฬา",
  },
  {
    id: 11,
    title: "รองเท้ากีฬาแบบใหม่",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 299, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 25,
    },
    rating: 4.6,
    description: "รองเท้ากีฬาสไตล์ใหม่สำหรับการวิ่งและการฝึกซ้อม",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="สินค้ามาใหม่"
          data={newArrivalsData}
          viewAllLink="/user/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="สินค้าขายดี"
            data={topSellingData}
            viewAllLink="/user/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
      </main>
    </>
  );
}
