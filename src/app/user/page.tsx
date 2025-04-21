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
    title: "Warrix เสื้อโปโล รุ่น คลาสสิค สีทีมชาติ ผู้ชาย ผู้หญิง",
    srcUrl: "/images/wrblue.jpg",
    gallery: [
      "/images/wrgreen.png",
      "/images/wrred.jpg",
      "/images/wrwhite.jpg",
    ],
    price: 449,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description:
      "เสื้อโปโลยอดนิยม ที่ครองใจลูกค้ามายาวนาน สามารถตอบโจทย์ได้ทุกสถานการณ์ โดดเด่นด้วยการใช้เส้นด้าย 2 ชนิด คือ ด้ายเงาและด้าน มาถักทอจนได้เนื้อผ้าลายย",
  },
  {
    id: 2,
    title:
      "กางเกงฟุตบอล เด็ก WARRIX 1509K 202FBKCL00 KIDS ขาสั้น เอวยางยืด พร้อมเชือก",
    srcUrl: "/images/whitewr.jpg",
    gallery: ["/images/blue.jpg", "/images/bwr.jpg", "/images/red.jpg"],
    price: 149,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description:
      "WARRIX กางเกงฟุตบอล ขาสั้นเด็กใส่สบายระบายเหงื่อได้ดี แห้งเร็ว น้ำหนักเบาด้วยเนื้อผ้า 100% Micro Polyester ",
  },

  {
    id: 3,
    title: "ลูกบอล Molten F5A2810 ของแท้ เบอร์5 ลูกฟุตบอลหนัง PU",
    srcUrl: "/images/ball.jpg",
    gallery: ["/images/ball.jpg"],
    price: 699, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 5.0,
    description:
      "ของแท้ 100% ลูกฟุตบอล ลูกบอล Molten F5A2810 หนัง PU เย็บด้วยมือ เบอร์ 5ฟุตบอลหนัง PU เย็บด้วยมือ  ยางในชนิดพิเศษ Latex จำนวน 32 แผ่นน้ำหนักลูกบอล 410-450gเส้นรอบวง 68-70cm",
  },
  {
    id: 4,
    title:
      "Super sales !! VIVA ไม้แบดมินตัน VIVA รุ่น Draco 1 คู่ พร้อมกระเป๋าใส่",
    srcUrl: "/images/viva.jpg",
    gallery: ["/images/viva.jpg"],
    price: 279, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.5,
    description:
      "ลูกแบดมินตัน ทำจากขนตรง ไม่เสียรูปทรง หัวลูกขนไก่ทำด้วยไม้ แต่หุ้มด้วยวัสดุทีมีความอ่อนนุ่ม ทนทาน ใช้ได้นาน",
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "แกรนด์สปอร์ตเสื้อฟุตบอลพิมพ์ลาย รหัสสินค้า:011494 (สีขาว)",
    srcUrl: "/images/v.jpg",
    gallery: ["/images/v1.png", "/images/v2.jpg"],
    price: 449,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description:
      "ประเภทสินค้า : แกรนด์สปอร์ตเสื้อฟุตบอลพิมพ์ลาย วัสดุ :  100% โพลีเอสเตอร์ (SOFTEXT)",
  },
  {
    id: 6,
    title: "แกรนด์สปอร์ตเสื้อฟุตบอลทีมชาติไทย(เอเชียนเกมส์ 2022)",
    srcUrl: "/images/v4.jpg",
    gallery: ["/images/v4.jpg"],
    price: 459,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    description:
      "WARRIX กางเกงฟุตบอล ขาสั้นเด็กใส่สบายระบายเหงื่อได้ดี แห้งเร็ว น้ำหนักเบาด้วยเนื้อผ้า 100% Micro Polyester ",
  },

  {
    id: 7,
    title: "ลูกบอล Molten F5A2810 ของแท้ เบอร์5 ลูกฟุตบอลหนัง PU",
    srcUrl: "/images/ball.jpg",
    gallery: ["/images/ball.jpg"],
    price: 699, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 5.0,
    description:
      "ของแท้ 100% ลูกฟุตบอล ลูกบอล Molten F5A2810 หนัง PU เย็บด้วยมือ เบอร์ 5ฟุตบอลหนัง PU เย็บด้วยมือ  ยางในชนิดพิเศษ Latex จำนวน 32 แผ่นน้ำหนักลูกบอล 410-450gเส้นรอบวง 68-70cm",
  },
  {
    id: 8,
    title:
      "Super sales !! VIVA ไม้แบดมินตัน VIVA รุ่น Draco 1 คู่ พร้อมกระเป๋าใส่",
    srcUrl: "/images/viva.jpg",
    gallery: ["/images/viva.jpg"],
    price: 279, // ราคาเป็นเงินบาทโดยตรง
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.5,
    description:
      "ลูกแบดมินตัน ทำจากขนตรง ไม่เสียรูปทรง หัวลูกขนไก่ทำด้วยไม้ แต่หุ้มด้วยวัสดุทีมีความอ่อนนุ่ม ทนทาน ใช้ได้นาน",
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
