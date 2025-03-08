import { useState } from "react";
import Swal from "sweetalert2";

export type Employees = {
  emp_id?: number;
  name: string;
  lastname: string;
  emp_code: string; // รหัสพนักงาน
  telephone: string;
  email: string;
  position: string;
  image: string;
  username: string;
  password: string;
};

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void; // Callback function for refreshing the table
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  isOpen,
  onClose,
  onEmployeeAdded,
}) => {
  const [employeeForms, setEmployeeForms] = useState<Employees[]>([
    {
      name: "",
      lastname: "",
      emp_code: "",
      telephone: "",
      email: "",
      position: "",
      image: "",
      username: "",
      password: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleEmployeeChange = <K extends keyof Employees>(
    index: number,
    field: K,
    value: Employees[K]
  ) => {
    const newEmployeeForms = [...employeeForms];
    newEmployeeForms[index] = { ...newEmployeeForms[index], [field]: value };
    setEmployeeForms(newEmployeeForms);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ตรวจสอบว่าฟิลด์ทั้งหมดมีข้อมูลหรือไม่
      for (const employee of employeeForms) {
        if (
          !employee.name ||
          !employee.lastname ||
          !employee.emp_code ||
          !employee.telephone ||
          !employee.email ||
          !employee.position ||
          !employee.username ||
          !employee.password
        ) {
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
      for (const employee of employeeForms) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/employees`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: employee.name,
              lastname: employee.lastname,
              emp_code: employee.emp_code,
              telephone: employee.telephone,
              email: employee.email,
              position: employee.position,
              image: employee.image,
              username: employee.username,
              password: employee.password,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add employee");
        }
      }

      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มข้อมูลพนักงานลงฐานข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      setEmployeeForms([
        {
          name: "",
          lastname: "",
          emp_code: "",
          telephone: "",
          email: "",
          position: "",
          image: "",
          username: "",
          password: "",
        },
      ]);

      onEmployeeAdded(); // เรียกฟังก์ชันสำหรับรีเฟรชตาราง
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
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

  const addNewEmployeeForm = () => {
    setEmployeeForms([
      ...employeeForms,
      {
        name: "",
        lastname: "",
        emp_code: "",
        telephone: "",
        email: "",
        position: "",
        image: "",
        username: "",
        password: "",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[700px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มข้อมูลพนักงาน</h2>
        <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto h-[400px] mb-4">
          {employeeForms.map((employee, index) => (
            <div key={index} className="mb-4">
              {/* <h3 className="font-semibold">รายการที่ {index + 1}</h3> */}
              <input
                type="text"
                placeholder="ชื่อ"
                value={employee.name}
                onChange={(e) =>
                  handleEmployeeChange(index, "name", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={employee.lastname}
                onChange={(e) =>
                  handleEmployeeChange(index, "lastname", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="รหัสพนักงาน"
                value={employee.emp_code}
                onChange={(e) =>
                  handleEmployeeChange(index, "emp_code", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="เบอร์โทรศัพท์"
                value={employee.telephone}
                onChange={(e) =>
                  handleEmployeeChange(index, "telephone", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="email"
                placeholder="อีเมล"
                value={employee.email}
                onChange={(e) =>
                  handleEmployeeChange(index, "email", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="ตำแหน่ง"
                value={employee.position}
                onChange={(e) =>
                  handleEmployeeChange(index, "position", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="รูปภาพ"
                value={employee.image}
                onChange={(e) =>
                  handleEmployeeChange(index, "image", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Username"
                value={employee.username}
                onChange={(e) =>
                  handleEmployeeChange(index, "username", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={employee.password}
                onChange={(e) =>
                  handleEmployeeChange(index, "password", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
            </div>
          ))}
        </div>
        <div className="flex space-x-4">
          {/* <button
            onClick={addNewEmployeeForm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + เพิ่มรายการใหม่
          </button> */}
          <button
            onClick={handleSubmit}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "กำลังเพิ่มข้อมูล..." : "เพิ่มข้อมูลพนักงาน"}
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

export default AddEmployee;
