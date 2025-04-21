"use client";
import { useState, useEffect } from "react";

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

const UserProfile = () => {
  const [user, setUser] = useState<Users | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Users | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/user?user_id=3`
        );
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData!,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save changes to API
    console.log("Saving user data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user); // รีเซ็ตข้อมูลผู้ใช้กลับมา
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center ">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8">
        {user && (
          <>
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 mr-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center bg-gray-300 rounded-full">
                    <span className="text-3xl text-gray-600">👤</span>
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="image-upload"
                  className="text-blue-500 cursor-pointer font-medium"
                >
                  {user.image ? "แก้ไขรูปโปรไฟล์" : "เพิ่มรูปโปรไฟล์"}
                </label>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-gray-700">ชื่อ</label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">นามสกุล</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData?.lastname || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">เบอร์โทร</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData?.telephone || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  name="username"
                  value={formData?.username || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  {isEditing ? "ยกเลิก" : "แก้ไขข้อมูล"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                  >
                    ยืนยันการแก้ไข
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
