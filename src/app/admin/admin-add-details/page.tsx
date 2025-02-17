"use client";
import React, { Suspense } from "react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/nav/nav";
import ProductDetails from "./pro-details/pro-details";

export default function AdminLayoutPage() {
  const handleRequestClose = () => {
    // Implement logic to close modal or navigate away
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow">
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <div className=" h-screen">
            <ProductDetails onRequestClose={handleRequestClose} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
