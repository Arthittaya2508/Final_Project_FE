import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

interface Item {
  id: number;
  name: string;
}

interface Colors {
  color_id: number;
  color_name: string;
}

interface Sizes {
  size_id: number;
  size_name: string;
}

interface Categories {
  category_id: number;
  category_name: string;
}

interface Brands {
  brand_id: number;
  brand_name: string;
}

interface Genders {
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
        return data.map((item: Colors) => ({
          id: item.color_id,
          name: item.color_name,
        }));
      case "/sizes":
        return data.map((item: Sizes) => ({
          id: item.size_id,
          name: item.size_name,
        }));
      case "/categories":
        return data.map((item: Categories) => ({
          id: item.category_id,
          name: item.category_name,
        }));
      case "/brands":
        return data.map((item: Brands) => ({
          id: item.brand_id,
          name: item.brand_name,
        }));
      case "/genders":
        return data.map((item: Genders) => ({
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
  const [openTab, setOpenTab] = useState<number>(1);
  const [data, setData] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>(""); // ใช้สำหรับการเพิ่มข้อมูลใหม่
  const [editItemId, setEditItemId] = useState<number | null>(null); // ใช้สำหรับการแก้ไขข้อมูล
  const [editItemName, setEditItemName] = useState<string>(""); // ใช้สำหรับแสดงชื่อข้อมูลในระหว่างแก้ไข
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("openTab");
      if (savedTab) {
        setOpenTab(parseInt(savedTab));
      }
    }
  }, []);

  useEffect(() => {
    refreshTab(); // เรียกใช้ refreshTab เมื่อ openTab เปลี่ยนแปลง
  }, [openTab]);

  const refreshTab = async () => {
    setIsLoading(true); // ตั้งค่า isLoading เป็น true เพื่อแสดงสถานะการโหลด
    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;

    try {
      const newData = await fetchData(tab.api); // ดึงข้อมูลใหม่จาก API
      setData(newData); // อัพเดท state data
    } catch (error) {
      console.error("Error refreshing data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถรีเฟรชข้อมูลได้ โปรดลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จ
    }
  };

  const handleAddData = async () => {
    if (!newItemName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อ!",
        text: "ชื่อข้อมูลไม่สามารถเป็นค่าว่างได้",
      });
      return;
    }

    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${tab.api}`;
      console.log("Sending POST request to:", apiUrl);

      // กำหนด request body ตาม endpoint
      let requestBody = {};
      switch (tab.api) {
        case "/colors":
          requestBody = { color_name: newItemName }; // สำหรับ /colors
          break;
        case "/sizes":
          requestBody = { size_name: newItemName }; // สำหรับ /sizes
          break;
        case "/categories":
          requestBody = { category_name: newItemName }; // สำหรับ /categories
          break;
        case "/brands":
          requestBody = { brand_name: newItemName }; // สำหรับ /brands
          break;
        case "/genders":
          requestBody = { gender_name: newItemName }; // สำหรับ /genders
          break;
        default:
          requestBody = { name: newItemName }; // ค่าเริ่มต้น
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // ส่ง request body ที่ถูกต้อง
      });

      if (!response.ok) {
        const errorData = await response.json(); // ดึงข้อความผิดพลาดจากเซิร์ฟเวอร์
        console.error("Error details:", errorData);
        throw new Error(`Failed to add data. Status: ${response.status}`);
      }

      const newData = await response.json();
      console.log("New Data Added:", newData);

      // เพิ่มข้อมูลใหม่ลงใน list
      setData((prevData) => [...prevData, newData]);
      setIsModalOpen(false);
      setNewItemName("");

      // เรียกใช้ refreshTab เพื่อดึงข้อมูลใหม่
      await refreshTab();

      Swal.fire({
        icon: "success",
        title: "เพิ่มข้อมูลสำเร็จ!",
        text: `${tab.label} ถูกเพิ่มเรียบร้อยแล้ว`,
      });
    } catch (error) {
      console.error("Error adding data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถเพิ่มข้อมูลได้ โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleEditData = (item: Item) => {
    setEditItemId(item.id);
    setEditItemName(item.name);
    setIsModalOpen(true);
  };

  const handleSaveEditData = async () => {
    if (!editItemName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อ!",
        text: "ชื่อข้อมูลไม่สามารถเป็นค่าว่างได้",
      });
      return;
    }

    const tab = tabs.find((t) => t.id === openTab);
    if (!tab || editItemId === null) return;

    try {
      let requestBody = {};
      switch (tab.api) {
        case "/colors":
          requestBody = { color_name: editItemName };
          break;
        case "/sizes":
          requestBody = { size_name: editItemName };
          break;
        case "/categories":
          requestBody = { category_name: editItemName };
          break;
        case "/brands":
          requestBody = { brand_name: editItemName };
          break;
        case "/genders":
          requestBody = { gender_name: editItemName };
          break;
        default:
          requestBody = { name: editItemName };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${tab.api}/${editItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error(`Failed to update data. Status: ${response.status}`);
      }

      const updatedData = await response.json();

      // Update the list with the edited item
      setData((prevData) =>
        prevData.map((item) =>
          item.id === editItemId ? { ...item, name: updatedData.name } : item
        )
      );

      setIsModalOpen(false);
      setEditItemName(""); // Clear the input field after saving

      Swal.fire({
        icon: "success",
        title: "ข้อมูลถูกแก้ไขเรียบร้อยแล้ว!",
        text: "ชื่อข้อมูลถูกอัพเดทแล้ว",
      });
    } catch (error) {
      console.error("Error editing data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถแก้ไขข้อมูลได้ โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const handleDeleteData = async (id: number) => {
    const confirmation = window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?");
    if (!confirmation) return;

    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${tab.api}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error(`Failed to delete data. Status: ${response.status}`);
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
      await refreshTab();

      Swal.fire({
        icon: "success",
        title: "ข้อมูลถูกลบเรียบร้อยแล้ว!",
        text: "ข้อมูลของคุณถูกลบออกจากระบบแล้ว",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  const currentTab = tabs.find((tab) => tab.id === openTab);

  return (
    <div className="w-full p-6">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}
      <ul className="flex border-b relative">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            onClick={() => setOpenTab(tab.id)}
            className="cursor-pointer"
          >
            <a
              className={`inline-block px-10 py-3 font-semibold border-b-2 transition ${
                openTab === tab.id
                  ? "border-blue-500 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </a>
          </li>
        ))}
        <li className="ml-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            เพิ่มข้อมูล
          </button>
        </li>
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
                    {item.name || "ไม่มีชื่อ"}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEditData(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteData(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-4 text-gray-500">
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentTab && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {editItemId
                ? `แก้ไข${currentTab.label}`
                : `เพิ่ม${currentTab.label}`}
            </h2>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="itemName"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="itemName"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={editItemId ? editItemName : newItemName}
                onChange={(e) =>
                  editItemId
                    ? setEditItemName(e.target.value)
                    : setNewItemName(e.target.value)
                }
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={editItemId ? handleSaveEditData : handleAddData}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editItemId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
