//RegisterModal
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

interface Address {
  district: string; // ตำบล
  amphoe: string; // อำเภอ
  province: string; // จังหวัด
  zipcode: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    address: "",
    province: "",
    amphoe: "",
    district: "",
    postalCode: "",
    telephone: "",
    email: "",
    username: "",
    password: "",
    image: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch("/json/address.json");
        const data: Address[] = await response.json();
        setAddressOptions(data);
      } catch (error) {
        console.error("Failed to fetch address data:", error);
      }
    };

    fetchAddressData();
  }, []);

  const provinces = [
    ...new Set(addressOptions.map((address) => address.province)),
  ].sort((a, b) => a.localeCompare(b, "th"));

  const amphoes = formData.province
    ? [
        ...new Set(
          addressOptions
            .filter((address) => address.province === formData.province)
            .map((address) => address.amphoe)
        ),
      ].sort((a, b) => a.localeCompare(b, "th"))
    : [];

  const districts = formData.amphoe
    ? [
        ...new Set(
          addressOptions
            .filter((address) => address.amphoe === formData.amphoe)
            .map((address) => address.district)
        ),
      ].sort((a, b) => a.localeCompare(b, "th"))
    : [];

  useEffect(() => {
    const address = addressOptions.find(
      (addr) =>
        addr.province === formData.province &&
        addr.amphoe === formData.amphoe &&
        addr.district === formData.district
    );
    if (address) {
      setFormData((prev) => ({
        ...prev,
        postalCode: address.zipcode.toString(),
      }));
    }
  }, [formData.province, formData.amphoe, formData.district, addressOptions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Register user and address in the database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          address: formData.address,
          telephone: formData.telephone,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          image: formData.image,
          district: formData.district,
          amphoe: formData.amphoe,
          province: formData.province,
          zipcode: formData.postalCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user and address.");
      }

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Registration and address saved successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        onClose(); // Close the modal
      });
    } catch (error) {
      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Registration failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Registration failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">ชื่อ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-900">นามสกุล</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Lastname"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-900">ที่อยู่</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="address"
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">จังหวัด</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">เลือกจังหวัด</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-900">อำเภอ</label>
              <select
                name="amphoe"
                value={formData.amphoe}
                onChange={handleChange}
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.province}
              >
                <option value="">เลือกอำเภอ</option>
                {amphoes.map((amphoe, index) => (
                  <option key={index} value={amphoe}>
                    {amphoe}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">ตำบล</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.amphoe}
              >
                <option value="">เลือกตำบล</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-900">รหัสไปรษณีย์</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                readOnly
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">เบอร์โทร</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Telephone"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-900">อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-900">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {isPasswordVisible ? (
                    <AiOutlineEye size={24} />
                  ) : (
                    <AiOutlineEyeInvisible size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-900">รูปภาพ</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
