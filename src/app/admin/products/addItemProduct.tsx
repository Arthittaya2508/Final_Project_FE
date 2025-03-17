import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export type Products = {
  pro_id?: number;
  pro_name: string;
  pro_des: string;
  category_id: number;
  brand_id: number;
};

interface AddProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  pro_id: number;
}

const AddProductDetail: React.FC<AddProductDetailProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  pro_id,
}) => {
  const [productDetails, setProductDetails] = useState([
    {
      pro_id: 0,
      color_id: 0,
      size_id: 0,
      gender_id: 0,
      stock_quantity: 0,
      sale_price: 0,
      cost_price: 0,
      pro_image: "",
    },
  ]);

  const [colors, setColors] = useState<
    { color_id: number; color_name: string }[]
  >([]);
  const [sizes, setSizes] = useState<{ size_id: number; size_name: string }[]>(
    []
  );
  const [genders, setGenders] = useState<
    { gender_id: number; gender_name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const addNewProductForm = () => {
    setProductDetails([
      ...productDetails,
      {
        pro_id: 0,
        color_id: 0,
        size_id: 0,
        gender_id: 0,
        stock_quantity: 0,
        sale_price: 0,
        cost_price: 0,
        pro_image: "",
      },
    ]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const [colorsRes, sizesRes, gendersRes] = await Promise.all([
          fetch(`${apiBase}/colors`),
          fetch(`${apiBase}/sizes`),
          fetch(`${apiBase}/genders`),
        ]);

        if (!colorsRes.ok || !sizesRes.ok || !gendersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        setColors(await colorsRes.json());
        setSizes(await sizesRes.json());
        setGenders(await gendersRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleChange = (index: number, field: string, value: any) => {
    const updatedProductDetails = [...productDetails];

    let parsedValue = value;
    if (
      ["color_id", "size_id", "gender_id", "stock_quantity"].includes(field)
    ) {
      parsedValue = value ? parseInt(value, 10) || 0 : 0;
    } else if (["sale_price", "cost_price"].includes(field)) {
      parsedValue = value ? parseFloat(value) || 0 : 0;
    }

    updatedProductDetails[index] = {
      ...updatedProductDetails[index],
      [field]: parsedValue,
    };

    setProductDetails(updatedProductDetails);
  };

  const handleImageChange = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const updatedProductDetails = [...productDetails];
      updatedProductDetails[index] = {
        ...updatedProductDetails[index],
        pro_image: file.name, // Save only the filename
      };
      setProductDetails(updatedProductDetails);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = { ...productDetails[0], pro_id };
      console.log("ส่งข้อมูล:", dataToSend);

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBase}/product_details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage || "Failed to add product");
      }

      const result = await response.json();
      console.log("Response จาก API:", result);
      Swal.fire("Success", "เพิ่มรายละเอียดสินค้าสำเร็จ", "success");
      onProductAdded();
      onClose();
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire(
        "Error",
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มรายละเอียดสินค้า</h2>

        {productDetails.map((product, index) => (
          <div key={index}>
            {/* <label htmlFor={`color-${index}`}>สี</label>
            <select
              id={`color-${index}`}
              value={product.color_id}
              onChange={(e) =>
                handleChange(index, "color_id", parseInt(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value={0}>เลือกสี</option>
              {colors.map((color) => (
                <option key={color.color_id} value={color.color_id}>
                  {color.color_name}
                </option>
              ))}
            </select> */}

            {/* <label htmlFor={`size-${index}`}>ขนาด</label>
            <select
              id={`size-${index}`}
              value={product.size_id}
              onChange={(e) =>
                handleChange(index, "size_id", parseInt(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value={0}>เลือกขนาด</option>
              {sizes.map((size) => (
                <option key={size.size_id} value={size.size_id}>
                  {size.size_name}
                </option>
              ))}
            </select> */}

            <label htmlFor={`gender-${index}`}>เพศ</label>
            <select
              id={`gender-${index}`}
              value={product.gender_id}
              onChange={(e) =>
                handleChange(index, "gender_id", parseInt(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value={0}>เลือกเพศ</option>
              {genders.map((gender) => (
                <option key={gender.gender_id} value={gender.gender_id}>
                  {gender.gender_name}
                </option>
              ))}
            </select>

            {/* <label htmlFor={`stock_quantity-${index}`}>จำนวนสินค้า</label>
            <input
              id={`stock_quantity-${index}`}
              type="number"
              value={product.stock_quantity}
              onChange={(e) =>
                handleChange(index, "stock_quantity", parseInt(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            /> */}

            {/* <label htmlFor={`sale_price-${index}`}>ราคาขาย</label>
            <input
              id={`sale_price-${index}`}
              type="number"
              value={product.sale_price}
              onChange={(e) =>
                handleChange(index, "sale_price", parseFloat(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            />
            <label htmlFor={`cost_price-${index}`}>ราคาทุน</label>
            <input
              id={`cost_price-${index}`}
              type="number"
              value={product.cost_price}
              onChange={(e) =>
                handleChange(index, "cost_price", parseFloat(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
              aria-label="กรอกราคาทุน"
            /> */}
            <label htmlFor={`pro_image-${index}`}>รูปภาพสินค้า</label>
            <input
              id={`pro_image-${index}`}
              type="file"
              onChange={(e) => handleImageChange(index, e.target.files)}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            onClick={addNewProductForm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + เพิ่มรายการใหม่
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "กำลังเพิ่มสินค้า..." : "เพิ่มสินค้า"}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductDetail;
