"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export interface ProductDetails {
  pro_id?: number;
  color_id: number;
  size_id: number;
  gender_id: number;
  stock_quantity: string;
  sku: string;
  pro_image: string; // This will now be a URL
  sale_price: string;
  cost_price: string;
}

export interface Product {
  pro_id: number;
  pro_name: string;
}

export interface Color {
  color_id: number;
  color_name: string;
}

export interface Gender {
  gender_id: number;
  gender_name: string;
}

export interface Size {
  size_id: number;
  size_name: string;
}

const ProductDetails = ({ onRequestClose }: { onRequestClose: () => void }) => {
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([
    {
      pro_id: 0,
      color_id: 0,
      size_id: 0,
      gender_id: 0,
      stock_quantity: "",
      sku: "",
      pro_image: "",
      sale_price: "",
      cost_price: "",
    },
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, colorRes, sizeRes, genderRes] = await Promise.all([
          fetch("/api/products").then((res) => res.json()),
          fetch("/api/colors").then((res) => res.json()),
          fetch("/api/sizes").then((res) => res.json()),
          fetch("/api/genders").then((res) => res.json()),
        ]);

        setProducts(productRes);
        setColors(colorRes);
        setSizes(sizeRes);
        setGenders(genderRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProductDetailsChange = (
    index: number,
    field: keyof ProductDetails,
    value: ProductDetails[keyof ProductDetails]
  ) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setProductDetails(updatedDetails);
  };

  const addProductDetailForm = () => {
    setProductDetails([
      ...productDetails,
      {
        pro_id: 0,
        color_id: 0,
        size_id: 0,
        gender_id: 0,
        stock_quantity: "",
        sku: "",
        pro_image: "",
        sale_price: "",
        cost_price: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      if (productDetails.length === 0) {
        Swal.fire("Error", "No product details to add.", "error");
        return;
      }

      const response = await fetch("/api/product_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ details: productDetails }), // ส่งเป็น JSON โดยมีคีย์ `details`
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData.error);
        throw new Error(
          `Failed to add product details: ${errorData.error || "Unknown error"}`
        );
      }

      Swal.fire(
        "Success",
        "Product details added successfully",
        "success"
      ).then(() => {
        onRequestClose(); // ปิดโมดัลเมื่อสำเร็จ
      });
    } catch (error) {
      console.error("Error adding product details:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[900px] max-w-full relative">
        <h2 className="text-2xl font-bold mb-4">เพิ่มรายละเอียดสินค้า</h2>
        <div className="overflow-y-auto max-h-[70vh]">
          {productDetails.map((detail, index) => (
            <div
              key={index}
              className="border p-4 mb-4 rounded-lg shadow-md bg-gray-50"
            >
              {/* Product Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อสินค้า
                </label>
                <select
                  value={detail.pro_id}
                  onChange={(e) =>
                    handleProductDetailsChange(
                      index,
                      "pro_id",
                      parseInt(e.target.value)
                    )
                  }
                  className="border p-2 rounded mb-2 w-full"
                >
                  <option value={0}>ชื่อสินค้า</option>
                  {products.map((product) => (
                    <option key={product.pro_id} value={product.pro_id}>
                      {product.pro_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* SKU */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={detail.sku}
                    onChange={(e) =>
                      handleProductDetailsChange(index, "sku", e.target.value)
                    }
                    className="border p-2 rounded mb-2 w-full"
                  />
                </div>
                {/* Image URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    รูปภาพสินค้า
                  </label>
                  <input
                    type="text"
                    placeholder="URL รูปภาพสินค้า"
                    value={detail.pro_image}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "pro_image",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    สี
                  </label>
                  <select
                    value={detail.color_id}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "color_id",
                        parseInt(e.target.value)
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  >
                    <option value={0}>เลือกสี</option>
                    {colors.map((color) => (
                      <option key={color.color_id} value={color.color_id}>
                        {color.color_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Size Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    ขนาด
                  </label>
                  <select
                    value={detail.size_id}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "size_id",
                        parseInt(e.target.value)
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  >
                    <option value={0}>เลือกขนาด</option>
                    {sizes.map((size) => (
                      <option key={size.size_id} value={size.size_id}>
                        {size.size_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Gender Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    เพศ
                  </label>
                  <select
                    value={detail.gender_id}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "gender_id",
                        parseInt(e.target.value)
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  >
                    <option value={0}>เลือกเพศ</option>
                    {genders.map((gender) => (
                      <option key={gender.gender_id} value={gender.gender_id}>
                        {gender.gender_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Stock Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    จำนวนในสต็อก
                  </label>
                  <input
                    type="number"
                    placeholder="จำนวนในสต็อก"
                    value={detail.stock_quantity}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "stock_quantity",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  />
                </div>
                {/* Sale Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    ราคา (ขาย)
                  </label>
                  <input
                    type="text"
                    placeholder="ราคา (ขาย)"
                    value={detail.sale_price}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "sale_price",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  />
                </div>
                {/* Cost Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    ราคา (ต้นทุน)
                  </label>
                  <input
                    type="text"
                    placeholder="ราคา (ต้นทุน)"
                    value={detail.cost_price}
                    onChange={(e) =>
                      handleProductDetailsChange(
                        index,
                        "cost_price",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded mb-2 w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={addProductDetailForm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            เพิ่มรายละเอียดสินค้า
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
