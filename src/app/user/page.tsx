import ProductListSec from "../../components/common/ProductListSec";
import Brands from "../../components/homepage/Brands";
import DressStyle from "../../components/homepage/DressStyle";
import Header from "../../components/homepage/Header";
import { Product } from "../../types/product.types";
import { Review } from "../../types/review.types";

// อัตราแลกเปลี่ยน (USD -> THB)
const exchangeRate = 35;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "เสื้อแขนยาว",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png", "/images/pic16.png", "/images/pic16.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "เสื้อแขนยาวที่มีดีไซน์เรียบง่ายและสวยงาม",
  },
  {
    id: 2,
    title: "กางเกงยีนส์ Skinny Fit",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
    description: "กางเกงยีนส์ Skinny Fit ที่เหมาะกับทุกลุค",
  },
  {
    id: 3,
    title: "เชิ้ตลายสก๊อต",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "เชิ้ตลายสก๊อตที่ใส่ได้ทุกโอกาส",
  },
  {
    id: 4,
    title: "เสื้อยืดแขนยาวลายทาง",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png", "/images/pic17.png", "/images/pic17.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 4.5,
    description: "เสื้อยืดแขนยาวลายทางสุดเท่",
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "เสื้อเชิ้ตลายทางตั้ง",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 5.0,
    description: "เสื้อเชิ้ตลายทางตั้งสุดเท่",
  },
  {
    id: 6,
    title: "เสื้อยืดกราฟิก",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.0,
    description: "เสื้อยืดลายกราฟิกที่เน้นความกล้า",
  },
  {
    id: 7,
    title: "กางเกงขาสั้น Bermuda",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.0,
    description: "กางเกงขาสั้น Bermuda สบายๆ สำหรับหน้าร้อน",
  },
  {
    id: 8,
    title: "ยีนส์ Skinny ฟอกสี",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description: "ยีนส์ Skinny ฟอกสีสุดเก๋",
  },
];

export const relatedProductData: Product[] = [
  {
    id: 9,
    title: "ชุดเดรสลายดอกไม้",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.8,
    description: "ชุดเดรสลายดอกไม้เหมาะสำหรับทุกโอกาส",
  },
  {
    id: 10,
    title: "แจ็คเก็ตยีนส์",
    srcUrl: "/images/pic16.png",
    gallery: ["/images/pic16.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.2,
    description: "แจ็คเก็ตยีนส์ที่ดูดีและเหมาะสำหรับทุกฤดูกาล",
  },
  {
    id: 11,
    title: "รองเท้าผ้าใบ",
    srcUrl: "/images/pic17.png",
    gallery: ["/images/pic17.png"],
    price: 7.42,  // ราคาเป็นเงินบาทไทย (THB)
    discount: {
      amount: 0,
      percentage: 25,
    },
    rating: 4.6,
    description: "รองเท้าผ้าใบสบายๆ เหมาะสำหรับใส่ทุกวัน",
  },
];


export default function Home() {
  return (
    <>
      <Header />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="สินค้ามาใหม่"
          data={newArrivalsData.map(product => ({
            ...product,
            price: product.price * exchangeRate,
            discount: {
              ...product.discount,
              amount: product.discount.amount * exchangeRate,
            },
          }))}
          viewAllLink="/user/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="สินค้าขายดี"
            data={topSellingData.map(product => ({
              ...product,
              price: product.price * exchangeRate,
              discount: {
                ...product.discount,
                amount: product.discount.amount * exchangeRate,
              },
            }))}
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
