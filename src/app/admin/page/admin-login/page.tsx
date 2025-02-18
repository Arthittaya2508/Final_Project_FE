"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // แสดงข้อความว่า login สำเร็จ
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Redirecting to admin dashboard...",
          timer: 1500,
        }).then(() => {
          router.push("/admin/admin-dash");
        });
      } else {
        // แสดงข้อความแตกต่างกันไปตาม status code
        let errorMessage = "Invalid username or password.";
        if (res.status === 400) {
          errorMessage = "Username and password are required.";
        } else if (res.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            <div
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEye size={24} />
              ) : (
                <AiFillEyeInvisible size={24} />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
