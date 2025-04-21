"use client";
import { Button } from "../../../../components/ui/button";
import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("bank");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [amount, setAmount] = useState(""); // State to track the amount
  const [paymentDate, setPaymentDate] = useState(""); // State to track payment date
  const [paymentTime, setPaymentTime] = useState(""); // State to track payment time
  const [file, setFile] = useState<File | null>(null); // State to track file upload

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as "bank" | "qr");
  };

  const handleConfirmPayment = () => {
    // Show the modal when payment is confirmed
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the uploaded file
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (amount && paymentDate && paymentTime && file) {
      // Here you can handle the file and form data, e.g., uploading to the server
      alert(
        `อัพโหลดไฟล์: ${file.name}, จำนวนเงิน: ${amount}, วันที่: ${paymentDate}, เวลา: ${paymentTime}`
      );
      closeModal(); // Close modal after form submission
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
    }
  };

  // Function to copy account number to clipboard
  const copyToClipboard = () => {
    const accountNumber = "123-456-7890";
    navigator.clipboard.writeText(accountNumber).then(() => {
      alert("เลขที่บัญชีได้ถูกคัดลอกแล้ว");
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          เลือกวิธีการชำระเงิน
        </h2>

        {/* Radio buttons for payment methods */}
        <div className="mb-6">
          <div className="flex items-center space-x-6">
            <label className="flex items-center text-lg text-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={handlePaymentChange}
                className="mr-3"
              />
              โอนผ่านธนาคาร
            </label>
            <label className="flex items-center text-lg text-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="qr"
                checked={paymentMethod === "qr"}
                onChange={handlePaymentChange}
                className="mr-3"
              />
              สแกนจ่าย
            </label>
          </div>
        </div>

        {/* Conditional render for payment details */}
        {paymentMethod === "bank" ? (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ข้อมูลการโอนเงิน
            </h3>
            <p className="text-gray-700 mb-2">
              กรุณาโอนเงินตามข้อมูลบัญชีด้านล่าง:
            </p>
            <p className="text-gray-700 mb-2">ธนาคาร: กรุงไทย</p>
            <div className="flex items-center space-x-4 mb-4">
              <p className="font-semibold text-gray-800">เลขที่บัญชี:</p>
              <input
                type="text"
                value="123-456-7890"
                readOnly
                className="p-3 border border-gray-300 rounded-lg text-gray-700 w-full"
              />
              <Button
                onClick={copyToClipboard}
                className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                คัดลอก
              </Button>
            </div>
            <p className="text-gray-700">
              ชื่อบัญชี: บริษัท เฟื่องฟู สปอร์ต จำกัด
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              สแกนจ่ายด้วย QR Code
            </h3>
            <p className="text-gray-700 mb-2">
              กรุณาสแกน QR Code ด้านล่างเพื่อทำการชำระเงิน:
            </p>
            <div className="w-full h-[500px] bg-gray-200 flex justify-center items-center text-gray-500 border border-gray-300 rounded-lg">
              <img
                src="/images/qr1.jpg"
                alt="QR Code"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between space-x-4 mt-8">
          <Button
            onClick={() => window.history.back()}
            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-white rounded-lg py-2"
          >
            ย้อนกลับ
          </Button>

          <Button
            onClick={handleConfirmPayment}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
          >
            ยืนยันการชำระเงิน
          </Button>
        </div>
      </div>

      {/* Modal for file upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              อัพโหลดหลักฐานการชำระเงิน
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="amount">
                  จำนวนเงิน
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="paymentDate"
                >
                  วันที่ชำระเงิน
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="paymentTime"
                >
                  เวลา
                </label>
                <input
                  type="time"
                  id="paymentTime"
                  value={paymentTime}
                  onChange={(e) => setPaymentTime(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="proofFile">
                  รูปหลักฐานการชำระเงิน
                </label>
                <input
                  type="file"
                  id="proofFile"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg py-2"
                >
                  ปิด
                </Button>
                <Link href="/user/history">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                  >
                    อัพโหลด
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
