"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

export interface Type {
  id: number;
  type_id: number;
  type_name: string;
}

export interface Band {
  id: number;
  band_id: number;
  band_name: string;
}

export type Product = {
  pro_id?: number;
  pro_name: string;
  pro_des: string;
  type_id: number;
  band_id: number;
};

const AddProduct = () => {
  const [productForms, setProductForms] = useState<Product[]>([
    {
      pro_name: "",
      pro_des: "",
      type_id: 0,
      band_id: 0,
    },
  ]);

  const [types, setTypes] = useState<Type[]>([]);
  const [bands, setBands] = useState<Band[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, bandsResponse] = await Promise.all([
          fetch("/api/types"),
          fetch("/api/bands"),
        ]);

        if (!typesResponse.ok || !bandsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        setTypes(await typesResponse.json());
        setBands(await bandsResponse.json());
      } catch (error) {
        console.error("Failed to fetch data", error);
        Swal.fire("Error", "Failed to load data", "error");
      }
    };

    fetchData();
  }, []);

  const handleProductChange = <K extends keyof Product>(
    index: number,
    field: K,
    value: Product[K]
  ) => {
    const newProductForms = [...productForms];
    newProductForms[index] = { ...newProductForms[index], [field]: value };
    setProductForms(newProductForms);
  };

  const handleSubmit = async () => {
    try {
      // ส่งข้อมูลทั้งหมดในครั้งเดียว
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForms),
      });

      if (!productRes.ok) {
        const errorData = await productRes.json();
        throw new Error(
          `Failed to add products: ${errorData.error || "Unknown error"}`
        );
      }

      // แจ้งเตือนความสำเร็จ
      Swal.fire("Success", "Products added successfully", "success");
    } catch (error) {
      console.error("Error adding products:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const addNewProductForm = () => {
    setProductForms([
      ...productForms,
      {
        pro_name: "",
        pro_des: "",
        type_id: 0,
        band_id: 0,
      },
    ]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <Link
          href="./admin-add-details"
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          เพิ่มรายละเอียดสินค้า
        </Link>
      </div>

      <div className="border rounded-lg p-4 max-h-[600px] overflow-y-auto h-[600px] mb-4">
        {productForms.map((product, index) => (
          <div
            key={index}
            className="mb-4 p-6 border rounded-lg shadow-lg bg-white"
          >
            <div className="mb-4">
              <span>ชื่อสินค้า</span>
              <input
                type="text"
                placeholder="ชื่อสินค้า"
                value={product.pro_name}
                onChange={(e) =>
                  handleProductChange(index, "pro_name", e.target.value)
                }
                className="border p-2 rounded mb-2 w-full"
              />
              <span>คำอธิบาย</span>
              <input
                type="text"
                placeholder="คำอธิบาย"
                value={product.pro_des}
                onChange={(e) =>
                  handleProductChange(index, "pro_des", e.target.value)
                }
                className="border p-2 rounded mb-2 w-full"
              />
              <span>ประเภทสินค้า</span>
              <select
                value={product.type_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "type_id",
                    parseInt(e.target.value)
                  )
                }
                className="border p-2 rounded mb-2 w-full"
              >
                <option value={0}>เลือกประเภทสินค้า</option>
                {types.map((type) => (
                  <option key={type.id} value={type.type_id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
              <span>แบนด์สินค้า</span>
              <select
                value={product.band_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "band_id",
                    parseInt(e.target.value)
                  )
                }
                className="border p-2 rounded mb-2 w-full"
              >
                <option value={0}>เลือกแบนด์สินค้า</option>
                {bands.map((band) => (
                  <option key={band.id} value={band.band_id}>
                    {band.band_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={addNewProductForm}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          เพิ่มสินค้าหลายรายการ
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          เพิ่มสินค้า
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
