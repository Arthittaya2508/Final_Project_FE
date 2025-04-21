import { AiOutlineEye } from "react-icons/ai";

import { CiBookmark, CiCircleInfo, CiEdit, CiTrash } from "react-icons/ci";

//Tabbar

export const tabs = [
  { id: 1, label: "ข้อมูลสี", content: "This is the General tab content." },
  {
    id: 2,
    label: "ข้อมูลขนาด",
    content: "This is the View Package tab content.",
  },
  { id: 3, label: "ข้อมูลประเภท", content: "This is the HR List tab content." },
  {
    id: 4,
    label: "ข้อมูลแบรนด์",
    content: "This is the HR List tab content.",
  },
  { id: 5, label: "ข้อมูลเพศ", content: "This is the HR List tab content." },
];
// *********************************************
export const menuHr = [
  // Table hr
  {
    items: [
      {
        key: "view",
        label: "View Detail",
        icon: <AiOutlineEye className="text-xl" />,
      },
    ],
  },
  {
    items: [
      {
        key: "organization",
        label: "Organization",
        icon: <CiEdit className="text-xl" />,
      },
    ],
  },
  {
    items: [
      {
        key: "delete",
        label: "Delete",
        icon: <CiTrash className="text-xl" />,
      },
    ],
  },
];

//filter org
export const filters = [
  { name: "Document Code", uid: "document_code", sortable: true },
  { name: "Name", uid: "names" },
  { name: "Package", uid: "package" },
  { name: "Remaining Days", uid: "package_remaining_days" },
  { name: "Expire", uid: "is_expire" },
  { name: "Package End Date", uid: "package_enddate" },
  { name: "Total Candidate Quota", uid: "total_candidate_quota" },
  { name: "Total Candidate Use", uid: "total_candidate_use" },
  { name: "Exceed Candidate Use", uid: "is_exceed_candidate_quota" },
  { name: "Created At", uid: "created_at" },
  { name: "Creator Name", uid: "creator_name" },
  { name: "Creator Email", uid: "creator_email" },
  { name: "Last Login Date", uid: "latest_login_date" },
  { name: "Contact Person Name", uid: "contact_person_name" },
  { name: "Contact Person Phone", uid: "contact_person_phone_number" },
  { name: "Contact Person Email", uid: "contact_person_email" },
];
//filter Hr
export const filterHr = [
  { name: "ID", uid: "id", sortable: true },
  { name: "First Name", uid: "firstname", sortable: true },
  { name: "Last Name", uid: "lastname", sortable: true },
  { name: "Nickname", uid: "nickname" },
  { name: "Email", uid: "email", sortable: true },
  { name: "Phone", uid: "phone" },
  { name: "Employee ID", uid: "employeeId" },
];
//Tabbar

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ชื่อลูกค้า", uid: "name", sortable: true },
  { name: "ที่อยู่ที่จัดส่ง", uid: "address", sortable: true },
  { name: "วันเวลาสั่งซื้อ", uid: "dmy", sortable: true },
  { name: "ราคารวม", uid: "total" },
  // { name: "วันที่จัดส่ง", uid: "datetime" },
  { name: "สถานะคำสั่งซื้อ", uid: "status" },
  // { name: "ขนส่งที่จัดส่ง", uid: "transport" },
  { name: "รายละเอียด", uid: "detail" },
];
export const product = [
  { name: "ลำดับที่", uid: "id", sortable: true },
  { name: "รหัสสินค้า", uid: "sku", sortable: true },
  { name: "ชื่อสินค้า", uid: "name", sortable: true },
  { name: "คำอธิบาย", uid: "description", sortable: true },
  { name: "ประเภท", uid: "category", sortable: true },
  { name: "แบรนด์", uid: "brand" },
  { name: "ประเภทเพศ", uid: "gender" },
  { name: "รายละเอียด", uid: "detail" },
];
export const transport = [
  { name: "ลำดับที่", uid: "id", sortable: true },
  { name: "ชื่อขนส่ง", uid: "sku", sortable: true },
  // { name: "ค่าส่ง", uid: "name", sortable: true },
  // { name: "รายละเอียด", uid: "detail" },
];
export const user = [
  { name: "ลำดับที่", uid: "id", sortable: true },
  { name: "ชื่อลูกค้า", uid: "name", sortable: true },
  { name: "เบอรโทร", uid: "phoneNumber", sortable: true },
  { name: "อีเมล", uid: "email" },
  { name: "ที่อยู่", uid: "address" },
  { name: "Username", uid: "username" },
  { name: "", uid: "detail" },
];
export const employee = [
  { name: "ลำดับที่", uid: "emp_id", sortable: true },
  { name: "ชื่อ", uid: "name", sortable: true },
  { name: "นามสกุล", uid: "lastname", sortable: true },
  { name: "รหัสพนักงาน", uid: "emp_code", sortable: true },
  { name: "เบอร์โทรศัพท์", uid: "telephone", sortable: true },
  { name: "อีเมล", uid: "email" },
  { name: "ตำแหน่ง", uid: "position" },
  { name: "Username", uid: "username" },
  { name: "", uid: "detail" },
];

export const products = [
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
