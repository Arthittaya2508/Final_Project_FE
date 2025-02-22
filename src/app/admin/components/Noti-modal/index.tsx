import React from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: string[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-md p-6 transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          การแจ้งเตือน
        </h2>
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={index}
                className="bg-gray-100 p-3 rounded-lg text-gray-700 shadow-sm hover:bg-gray-200 transition"
              >
                {notification}
              </li>
            ))
          ) : (
            <li className="text-gray-500">ไม่มีการแจ้งเตือนใหม่</li>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
