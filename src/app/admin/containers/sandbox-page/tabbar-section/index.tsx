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
  const [openTab, setOpenTab] = useState<number>(1);
  const [data, setData] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("openTab");
      if (savedTab) {
        setOpenTab(parseInt(savedTab));
      }
    }
  }, []);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;
    fetchData(tab.api).then(setData);
    if (typeof window !== "undefined") {
      localStorage.setItem("openTab", openTab.toString());
    }
  }, [openTab]);

  const handleAddData = async () => {
    if (!newItemName) return;

    // Get the API endpoint based on the current tab
    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;

    try {
      // Send a POST request to add the new data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${tab.api}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newItemName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add data");
      }

      const newData = await response.json();

      // Add the new item to the list
      setData((prevData) => [...prevData, newData]);
      setIsModalOpen(false);
      setNewItemName(""); // Reset the input field

      // Show alert on successful addition
      alert("เพิ่มข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleEditData = async (id: number) => {
    const updatedName = prompt("กรุณากรอกชื่อใหม่");

    if (!updatedName) return;

    const tab = tabs.find((t) => t.id === openTab);
    if (!tab) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${tab.api}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const updatedData = await response.json();

      // Update the list with the edited item
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, name: updatedData.name } : item
        )
      );

      alert("ข้อมูลถูกแก้ไขเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error editing data:", error);
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
        throw new Error("Failed to delete data");
      }

      // Remove the deleted item from the list
      setData((prevData) => prevData.filter((item) => item.id !== id));

      alert("ข้อมูลถูกลบเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const currentTab = tabs.find((tab) => tab.id === openTab);

  return (
    <div className="w-full p-6">
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
                      onClick={() => handleEditData(item.id)}
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
              เพิ่ม{currentTab.label}
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
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
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
                onClick={handleAddData}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                เพิ่ม{currentTab.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
