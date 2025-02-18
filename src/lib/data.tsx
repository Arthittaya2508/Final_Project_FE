import { AiOutlineEye } from "react-icons/ai";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { CiBookmark, CiCircleInfo, CiEdit, CiTrash } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
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

export const navbarItems = [
  {
    category: "typography",
    path: "/sandbox",
  },
  {
    category: "button",
    path: "/sandbox",
  },
  {
    category: "input",
    path: "/sandbox",
  },
  {
    category: "checkbox",
    path: "/sandbox",
  },
  {
    category: "dropdown",
    path: "/sandbox",
  },
  {
    category: "tooltip",
    path: "/sandbox",
  },
  {
    category: "filter",
    path: "/sandbox",
  },
  {
    category: "tabs",
    path: "/sandbox",
  },
  {
    category: "spinner",
    path: "/sandbox",
  },

  {
    category: "navbar",
    path: "/sandbox",
  },
];

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ชื่อลูกค้า", uid: "name", sortable: true },
  { name: "ที่อยู่ที่จัดส่ง", uid: "address", sortable: true },
  { name: "วันเวลาสั่งซื้อ", uid: "dmy", sortable: true },
  { name: "ราคารวม", uid: "total" },
  { name: "วันที่จัดส่ง", uid: "datetime" },
  { name: "สถานะคำสั่งซื้อ", uid: "status" },
  { name: "รายละเอียด", uid: "detail" },
];
export const product = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ชื่อสินค้า", uid: "name", sortable: true },
  { name: "คำอธิบาย", uid: "description", sortable: true },
  { name: "ประเภท", uid: "category", sortable: true },
  { name: "แบรนด์", uid: "brand" },
  { name: "รายละเอียด", uid: "detail" },
];
export const productData = [
  {
    id: 1,
    name: "เสื้อฟุตบอลทีมชาติ",
    description: "เสื้อฟุตบอลทีมชาติคุณภาพสูง สวมใส่สบาย ระบายอากาศดี",
    category: "เสื้อผ้า",
    brand: "Nike",
    detail: "รายละเอียด",
  },
  {
    id: 2,
    name: "รองเท้าวิ่ง Air Max",
    description: "รองเท้าวิ่งน้ำหนักเบา รองรับแรงกระแทกได้ดี",
    category: "รองเท้า",
    brand: "Nike",
    detail: "รายละเอียด",
  },
  {
    id: 3,
    name: "ถุงมือฟิตเนส",
    description: "ถุงมือสำหรับออกกำลังกาย ป้องกันการเสียดสี",
    category: "อุปกรณ์กีฬา",
    brand: "Adidas",
    detail: "รายละเอียด",
  },
  {
    id: 4,
    name: "เสื้อวิ่งระบายอากาศ",
    description: "เสื้อวิ่งออกกำลังกาย เนื้อผ้าบางเบา ระบายอากาศดีเยี่ยม",
    category: "เสื้อผ้า",
    brand: "Under Armour",
    detail: "รายละเอียด",
  },
  {
    id: 5,
    name: "ลูกฟุตบอลหนังแท้",
    description: "ลูกฟุตบอลมาตรฐาน แข็งแรงทนทานต่อการใช้งาน",
    category: "อุปกรณ์กีฬา",
    brand: "Adidas",
    detail: "รายละเอียด",
  },
  {
    id: 6,
    name: "กางเกงวิ่งขาสั้น",
    description: "กางเกงวิ่งน้ำหนักเบา ระบายเหงื่อได้ดี",
    category: "เสื้อผ้า",
    brand: "Puma",
    detail: "รายละเอียด",
  },
  {
    id: 7,
    name: "หมวกแก๊ปกันแดด",
    description: "หมวกแก๊ปกันแดด ระบายอากาศ ไม่ร้อน",
    category: "อุปกรณ์กีฬา",
    brand: "Nike",
    detail: "รายละเอียด",
  },
  {
    id: 8,
    name: "กระเป๋าเป้สะพายหลัง",
    description: "กระเป๋าเป้สำหรับออกกำลังกาย กันน้ำ น้ำหนักเบา",
    category: "อุปกรณ์กีฬา",
    brand: "Adidas",
    detail: "รายละเอียด",
  },
  {
    id: 9,
    name: "เสื้อฮู้ดดี้",
    description: "เสื้อฮู้ดดี้ใส่สบาย มีความยืดหยุ่นสูง",
    category: "เสื้อผ้า",
    brand: "Under Armour",
    detail: "รายละเอียด",
  },
  {
    id: 10,
    name: "รองเท้าฟุตซอล",
    description: "รองเท้าฟุตซอลน้ำหนักเบา ยึดเกาะพื้นได้ดี",
    category: "รองเท้า",
    brand: "Puma",
    detail: "รายละเอียด",
  },
];

// export const columnstable = [
//   { name: "Document Code", uid: "document_code", sortable: true },
//   { name: "Name", uid: "names" },
//   { name: "Package", uid: "package" },
//   { name: "Remaining Days", uid: "package_remaining_days" },
//   { name: "Expire", uid: "is_expire" },
//   { name: "Package End Date", uid: "package_enddate" },
//   { name: "Total Candidate Quota", uid: "total_candidate_quota" },
//   { name: "Total Candidate Use", uid: "total_candidate_use" },
//   { name: "Exceed Candidate Use", uid: "is_exceed_candidate_quota" },
//   { name: "Created At", uid: "created_at" },
//   { name: "Creator Name", uid: "creator_name" },
//   { name: "Creator Email", uid: "creator_email" },
//   { name: "Last Login Date", uid: "latest_login_date" },
//   { name: "Contact Person Name", uid: "contact_person_name" },
//   { name: "Contact Person Phone", uid: "contact_person_phone_number" },
//   { name: "Contact Person Email", uid: "contact_person_email" },
//   { name: " ", uid: "actions" },
// ];

export const users = [
  {
    id: 1,
    name: "NextGen Coders 1",
    abbreviate: "CEO",
    email: "tony.reichert@example.com",
    phone: "1234567890",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 2,
    name: "NextGen Coders 2",
    abbreviate: "Tech Lead",
    email: "zoey.lang@example.com",
    phone: "1234567890",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 3,
    name: "NextGen Coders 3",
    abbreviate: "Sr. Dev",
    email: "jane.fisher@example.com",
    phone: "1234567890",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 4,
    name: "NextGen Coders 4",
    abbreviate: "C.M.",
    phone: "1234567890",
    email: "william.howard@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 5,
    name: "NextGen Coders 5",
    abbreviate: "S. Manager",
    phone: "1234567890",
    email: "kristen.cooper@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 6,
    name: "NextGen Coders 6",
    abbreviate: "P. Manager",
    phone: "1234567890",
    email: "brian.kim@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 7,
    name: "NextGen Coders 7",
    abbreviate: "Designer",
    phone: "1234567890",
    email: "michael.hunt@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 8,
    name: "NextGen Coders 8",
    abbreviate: "HR Manager",
    phone: "1234567890",
    email: "samantha.brooks@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 9,
    name: "NextGen Coders 9",
    abbreviate: "F. Manager",
    phone: "1234567890",
    email: "frank.harrison@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 10,
    name: "NextGen Coders 10",
    abbreviate: "Ops Manager",
    phone: "1234567890",
    email: "emma.adams@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 11,
    name: "NextGen Coders 11",
    abbreviate: "Jr. Dev",
    phone: "1234567890",
    email: "brandon.stevens@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 12,
    name: "NextGen Coders 12",
    abbreviate: "P. Manager",
    phone: "1234567890",
    email: "megan.richards@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 13,
    name: "NextGen Coders 13",
    abbreviate: "S. Manager",
    phone: "1234567890",
    email: "oliver.scott@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 14,
    name: "NextGen Coders 14",
    abbreviate: "M. Specialist",
    phone: "1234567890",
    email: "grace.allen@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 15,
    name: "NextGen Coders 15",
    abbreviate: "IT Specialist",
    phone: "1234567890",
    email: "noah.carter@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 16,
    name: "NextGen Coders 16",
    abbreviate: "Manager",
    phone: "1234567890",
    email: "ava.perez@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 17,
    name: "NextGen Coders 14",
    abbreviate: "Data Analyst",
    phone: "1234567890",
    email: "liam.johnson@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 18,
    name: "NextGen Coders 18",
    abbreviate: "QA Analyst",
    phone: "1234567890",
    email: "sophia.taylor@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 19,
    name: "NextGen Coders 19",
    abbreviate: "Administrator",
    phone: "1234567890",
    email: "lucas.harris@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
  {
    id: 20,
    name: "NextGen Coders 20",
    abbreviate: "Coordinator",
    phone: "1234567890",
    email: "mia.robinson@example.com",
    total: "100",
    remaining: "50",
    pending: "50",
  },
];
