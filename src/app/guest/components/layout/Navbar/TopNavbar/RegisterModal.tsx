import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

// interface Address {
//   district: string;
//   amphoe: string;
//   province: string;
//   zipcode: number;
// }

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
  const [usernameError, setUsernameError] = useState<string>(""); // Track username error

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch("/json/address.json");
        // const data: Address[] = await response.json();
        // setAddressOptions(data);
      } catch (error) {
        console.error("Failed to fetch address data:", error);
      }
    };

    fetchAddressData();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
      // Check if the username already exists
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/exists?username=${value}`
        );
        const data = await response.json();
        if (data.exists) {
          setUsernameError("Username is already taken.");
        } else {
          setUsernameError(""); // Clear error if username is available
        }
      } catch (error) {
        // console.error("Error checking username:", error);
        // setUsernameError("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If there is a username error, do not submit the form
    if (usernameError) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the errors before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Send user data to API
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            telephone: formData.telephone,
          }),
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to register user.");
      }

      const userData = await userResponse.json();
      const userId = userData.id; // Get userId from API response

      Swal.fire({
        title: "สำเร็จ!",
        text: "การลงทะเบียนเสร็จสมบูรณ์แล้ว!",
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        onClose();
      });
    } catch (error) {
      Swal.fire({
        title: "ข้อผิดพลาด!",
        text: "การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง.",
        icon: "error",
        confirmButtonText: "ตกลง",
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
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900 text-left">ชื่อ</label>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-900">หมายเลขโทรศัพท์</label>
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
                className={`w-full p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  usernameError ? "border-red-500" : ""
                }`}
                required
              />
              {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
              )}
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
                  className="absolute top-4 right-3 z-10 text-gray-900"
                >
                  {isPasswordVisible ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full md:w-1/2"
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
