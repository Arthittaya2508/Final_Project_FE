import React, { useState } from "react";
import NotificationModal from "../noti-modal/noti-modal";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notifications = [
    "Order #1234 has been shipped",
    "New message from customer",
    "Payment for Order #5678 is confirmed",
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* ชื่อหน้า */}
        <div className="text-white text-xl ml-10 font-bold">
          เฟื่องฟู สปอร์ต
        </div>

        {/* ไอคอนแจ้งเตือน */}
        <div className="relative">
          <svg
            onClick={() => setIsModalOpen(true)}
            className="w-6 h-6 mr-8 text-white cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a7.002 7.002 0 00-5-6.709V4a2 2 0 10-4 0v.291C7.67 5.099 6 7.388 6 10v4.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 21h-2v-2h2v2z"
            />
          </svg>
          {/* จุดแจ้งเตือน */}
          <span className="absolute top-0 right-8 block h-2 w-2 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
      />
    </nav>
  );
};

export default Navbar;
