// pages/admin-login.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // นำเข้า sweetalert2

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // แสดง SweetAlert สำหรับล้อกอินสำเร็จ
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You will be redirected to the dashboard.",
        }).then(() => {
          router.push("/admin/admin-dash"); // เมื่อกด OK แล้วจะทำการเปลี่ยนเส้นทาง
        });
      } else {
        setError(result.message || "Login failed");

        // แสดง SweetAlert สำหรับล้อกอินล้มเหลว
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: result.message || "Invalid username or password.",
        });
      }
    } catch (error) {
      // แสดง SweetAlert สำหรับ error อื่น ๆ
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while logging in. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <Image
          src="/images/bghome.jpg" // Path should start from the root
          alt="Admin Login"
          width={600}
          height={800}
          className="object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
