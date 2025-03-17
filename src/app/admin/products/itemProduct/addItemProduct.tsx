import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export type ItemProductDetails = {
  item_id: number;
  color_id: number;
  size_id: number;
  stock_quantity: number;
  sale_price: number;
  cost_price: number;
  detail_id: number;
};

interface AddItemProductProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  pro_detail_id: number;
}

const AddItemProduct: React.FC<AddItemProductProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  pro_detail_id,
}) => {
  const [itemProductDetails, setItemProductDetails] = useState<
    ItemProductDetails[]
  >([
    {
      item_id: 0,
      color_id: 0,
      size_id: 0,
      stock_quantity: 0,
      sale_price: 0,
      cost_price: 0,
      detail_id: 0,
    },
  ]);

  const [colors, setColors] = useState<
    { color_id: number; color_name: string }[]
  >([]);
  const [sizes, setSizes] = useState<{ size_id: number; size_name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const [colorsRes, sizesRes] = await Promise.all([
          fetch(`${apiBase}/colors`),
          fetch(`${apiBase}/sizes`),
        ]);

        if (!colorsRes.ok || !sizesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        setColors(await colorsRes.json());
        setSizes(await sizesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleChange = (
    index: number,
    field: keyof ItemProductDetails,
    value: any
  ) => {
    const updatedItems = [...itemProductDetails];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItemProductDetails(updatedItems);
  };

  const addNewProductForm = () => {
    setItemProductDetails([
      ...itemProductDetails,
      {
        item_id: 0,
        color_id: 0,
        size_id: 0,
        stock_quantity: 0,
        sale_price: 0,
        cost_price: 0,
        detail_id: 0,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const dataToSend = itemProductDetails.map((item) => ({
        ...item,
        pro_detail_id,
      }));
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBase}/product_detail_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Failed to add product");

      Swal.fire("Success", "เพิ่มรายละเอียดสินค้าสำเร็จ", "success");
      onProductAdded();
      onClose();
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire("Error", "เกิดข้อผิดพลาด", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มรายละเอียดสินค้า</h2>
        {itemProductDetails.map((item, index) => (
          <div key={index}>
            <label>สี</label>
            <select
              value={item.color_id}
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
            </select>

            <label>ขนาด</label>
            <select
              value={item.size_id}
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
            </select>

            <label>จำนวนสินค้า</label>
            <input
              type="number"
              value={item.stock_quantity}
              onChange={(e) =>
                handleChange(index, "stock_quantity", parseInt(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            />
            <label>ราคาขาย</label>
            <input
              type="number"
              value={item.sale_price}
              onChange={(e) =>
                handleChange(index, "sale_price", parseFloat(e.target.value))
              }
              className="border p-2 rounded w-full mb-2"
            />
            <label>ราคาทุน</label>
            <input
              type="number"
              value={item.cost_price}
              onChange={(e) =>
                handleChange(index, "cost_price", parseFloat(e.target.value))
              }
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
            เพิ่มสินค้า
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

export default AddItemProduct;
