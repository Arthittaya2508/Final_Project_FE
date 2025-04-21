"use client";
import { useEffect, useState } from "react";

type Users = {
  user_id: number;
  name: string;
  lastname: string;
  telephone: string;
  email: string;
  address: string;
  username: string;
  image: string | null;
};

export type Address = {
  address_id: number;
  user_id: number;
  address_name: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
};

const AddressPage = () => {
  const [user, setUser] = useState<Users | null>(null);
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);

  // Fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/user?user_id=3`
        );
        const data = await res.json();
        setUser(data);
        fetchAddressData(data.user_id); // ดึงที่อยู่ของผู้ใช้ที่มี user_id = 3
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch address data for user_id 3
  const fetchAddressData = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/address?user_id=${userId}` // ปรับ URL ตาม API ที่ใช้
      );
      const data: Address[] = await response.json();
      setAddressOptions(data); // เก็บที่อยู่ทั้งหมด
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ที่อยู่ของฉัน
        </h1>

        {user && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                ข้อมูลผู้ใช้
              </h2>
              <p className="text-gray-600">
                <strong>ชื่อ:</strong> {user.name} {user.lastname}
              </p>
              <p className="text-gray-600">
                <strong>เบอร์โทร:</strong> {user.telephone}
              </p>
              {/* <p className="text-gray-600">
                <strong>Email:</strong> {user.email}
              </p> */}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">
                ข้อมูลที่อยู่
              </h3>
              {addressOptions.length > 0 ? (
                addressOptions.map((address) => (
                  <div
                    key={address.address_id}
                    className="border-b border-gray-300 py-4 mb-4"
                  >
                    <p className="text-gray-700">
                      <strong>ชื่อที่อยู่:</strong> {address.address_name}
                    </p>
                    <p className="text-gray-600">
                      <strong>ตำบล:</strong> {address.district}
                    </p>
                    <p className="text-gray-600">
                      <strong>อำเภอ:</strong> {address.amphoe}
                    </p>
                    <p className="text-gray-600">
                      <strong>จังหวัด:</strong> {address.province}
                    </p>
                    <p className="text-gray-600">
                      <strong>รหัสไปรษณีย์:</strong> {address.zipcode}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ยังไม่มีที่อยู่</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
