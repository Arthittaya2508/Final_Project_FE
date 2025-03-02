import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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
  const [productDetail, setProductDetail] = useState({
    color_id: 0,
    size_id: 0,
    gender_id: 0,
    stock_quantity: 0,
    sku: "",
    sale_price: 0,
    cost_price: 0,
    pro_image: "",
  });

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

  const handleChange = (field: string, value: any) => {
    setProductDetail({ ...productDetail, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มรายละเอียดสินค้า</h2>

        <label htmlFor="color">สี</label>
        <select
          id="color"
          value={productDetail.color_id}
          onChange={(e) => handleChange("color_id", parseInt(e.target.value))}
          className="border p-2 rounded w-full mb-2"
          aria-label="เลือกสี"
        >
          <option value={0}>เลือกสี</option>
          {colors.map((color) => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name}
            </option>
          ))}
        </select>

        <label htmlFor="size">ขนาด</label>
        <select
          id="size"
          value={productDetail.size_id}
          onChange={(e) => handleChange("size_id", parseInt(e.target.value))}
          className="border p-2 rounded w-full mb-2"
          aria-label="เลือกขนาด"
        >
          <option value={0}>เลือกขนาด</option>
          {sizes.map((size) => (
            <option key={size.size_id} value={size.size_id}>
              {size.size_name}
            </option>
          ))}
        </select>

        <label htmlFor="gender">เพศ</label>
        <select
          id="gender"
          value={productDetail.gender_id}
          onChange={(e) => handleChange("gender_id", parseInt(e.target.value))}
          className="border p-2 rounded w-full mb-2"
          aria-label="เลือกเพศ"
        >
          <option value={0}>เลือกเพศ</option>
          {genders.map((gender) => (
            <option key={gender.gender_id} value={gender.gender_id}>
              {gender.gender_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="SKU"
          value={productDetail.sku}
          onChange={(e) => handleChange("sku", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <div className="flex space-x-4">
          <button
            onClick={() => alert("Submit logic here")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            เพิ่ม
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
