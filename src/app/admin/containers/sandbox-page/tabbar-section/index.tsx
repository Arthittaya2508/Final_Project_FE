import { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
}

interface Color {
  color_id: number;
  color_name: string;
}

interface Size {
  size_id: number;
  size_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface Gender {
  gender_id: number;
  gender_name: string;
}

const tabs = [
  { id: 1, label: "ข้อมูลสี", api: "/colors" },
  { id: 2, label: "ข้อมูลขนาด", api: "/sizes" },
  { id: 3, label: "ข้อมูลประเภท", api: "/categories" },
  { id: 4, label: "ข้อมูลแบรนด์", api: "/brands" },
  { id: 5, label: "ข้อมูลเพศ", api: "/genders" },
];

const fetchData = async (api: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${api}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    switch (api) {
      case "/colors":
        return data.map((item: Color) => ({
          id: item.color_id,
          name: item.color_name,
        }));
      case "/sizes":
        return data.map((item: Size) => ({
          id: item.size_id,
          name: item.size_name,
        }));
      case "/categories":
        return data.map((item: Category) => ({
          id: item.category_id,
          name: item.category_name,
        }));
      case "/brands":
        return data.map((item: Brand) => ({
          id: item.brand_id,
          name: item.brand_name,
        }));
      case "/genders":
        return data.map((item: Gender) => ({
          id: item.gender_id,
          name: item.gender_name,
        }));
      default:
        return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default function Tabbar() {
  // ดึงค่า openTab จาก localStorage หากมี
  const savedTab = localStorage.getItem("openTab");
  const [openTab, setOpenTab] = useState<number>(savedTab ? parseInt(savedTab) : 1); // ถ้าไม่มีจะใช้ค่า default เป็น 1
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;
    fetchData(tab.api).then(setData);

    // บันทึก openTab ลง localStorage ทุกครั้งที่มีการเลือกแท็บ
    localStorage.setItem("openTab", openTab.toString());
  }, [openTab]);

  // ฟังก์ชันที่ทำงานเมื่อคลิกปุ่มเพิ่มข้อมูล
  const handleAddData = () => {
    alert(`เพิ่มข้อมูลในแท็บ ${tabs.find((tab) => tab.id === openTab)?.label}`);
  };

  return (
    <div className="w-full p-6">
      <ul className="flex border-b relative">
        {tabs.map((tab) => (
          <li key={tab.id} onClick={() => setOpenTab(tab.id)} className="cursor-pointer">
            <a
              className={`inline-block px-10 py-3 font-semibold border-b-2 transition ${
                openTab === tab.id ? "border-blue-500 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </a>
          </li>
        ))}
        {/* ปุ่มเพิ่มข้อมูล */}
        <button
          onClick={handleAddData}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded"
        >
          เพิ่มข้อมูล
        </button>
      </ul>
      <div className="mt-4">
        <table className="w-[1200px] border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ชื่อ</th>
              <th className="border p-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border p-2 text-black">
                    {item.name ? item.name : 'ไม่มีชื่อ'}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">แก้ไข</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">ลบ</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-4 text-gray-500">ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
