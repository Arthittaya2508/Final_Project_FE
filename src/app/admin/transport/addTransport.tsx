import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export type Transports = {
  transport_id?: number;
  transport_name: string;
  transport_cost: number;
};

interface AddTransportProps {
  isOpen: boolean;
  onClose: () => void;
  onTransportAdded: () => void; // Callback function for refreshing the table
}

const AddTransport: React.FC<AddTransportProps> = ({
  isOpen,
  onClose,
  onTransportAdded,
}) => {
  const [transportForms, setTransportForms] = useState<Transports[]>([
    {
      transport_name: "",
      transport_cost: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleTransportChange = <K extends keyof Transports>(
    index: number,
    field: K,
    value: Transports[K]
  ) => {
    const newTransportForms = [...transportForms];
    newTransportForms[index] = { ...newTransportForms[index], [field]: value };
    setTransportForms(newTransportForms);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ตรวจสอบว่าฟิลด์ทั้งหมดมีข้อมูลหรือไม่
      for (const transport of transportForms) {
        if (!transport.transport_name || transport.transport_cost === 0) {
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบถ้วน",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
          return;
        }
      }

      // ส่งข้อมูลทีละรายการ
      for (const transport of transportForms) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transport_name: transport.transport_name,
              transport_cost: transport.transport_cost,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add transport");
        }
      }

      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มข้อมูลขนส่งลงฐานข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      setTransportForms([
        {
          transport_name: "",
          transport_cost: 0,
        },
      ]);

      onTransportAdded(); // Call the callback to refresh the table
      onClose();
    } catch (error) {
      console.error("Error adding transports:", error);
      Swal.fire({
        title: "ผิดพลาด!",
        text: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
        icon: "error",
        confirmButtonText: "ลองอีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewTransportForm = () => {
    setTransportForms([
      ...transportForms,
      {
        transport_name: "",
        transport_cost: 0,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[700px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มข้อมูลขนส่ง</h2>
        <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto h-[400px] mb-4">
          {transportForms.map((transport, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">รายการที่ {index + 1}</h3>
              <input
                type="text"
                placeholder="ชื่อขนส่ง"
                value={transport.transport_name}
                onChange={(e) =>
                  handleTransportChange(index, "transport_name", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="ค่าขนส่ง"
                value={transport.transport_cost}
                onChange={(e) =>
                  handleTransportChange(
                    index,
                    "transport_cost",
                    parseFloat(e.target.value)
                  )
                }
                className="border p-2 rounded w-full mb-2"
              />
            </div>
          ))}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={addNewTransportForm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + เพิ่มรายการใหม่
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "กำลังเพิ่มข้อมูล..." : "เพิ่มข้อมูลขนส่ง"}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransport;
