import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export interface Categories {
  category_id: number;
  category_name: string;
}

export interface Brands {
  brand_id: number;
  brand_name: string;
}

export type Products = {
  pro_id?: number;
  pro_name: string;
  pro_des: string;
  category_id: number;
  brand_id: number;
};

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void; // Callback function for refreshing the table
}

const AddProduct: React.FC<AddProductProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [productForms, setProductForms] = useState<Products[]>([
    {
      pro_name: "",
      pro_des: "",
      category_id: 0,
      brand_id: 0,
    },
  ]);

  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`),
        ]);

        if (categoriesResponse.ok && brandsResponse.ok) {
          setCategories(await categoriesResponse.json());
          setBrands(await brandsResponse.json());
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProductChange = <K extends keyof Products>(
    index: number,
    field: K,
    value: Products[K]
  ) => {
    const newProductForms = [...productForms];
    newProductForms[index] = { ...newProductForms[index], [field]: value };
    setProductForms(newProductForms);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ตรวจสอบว่าฟิลด์ทั้งหมดมีข้อมูลหรือไม่
      for (const product of productForms) {
        if (
          !product.pro_name ||
          !product.pro_des ||
          product.category_id === 0 ||
          product.brand_id === 0
        ) {
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบถ้วน",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
          return;
        }
      }

      // ส่งข้อมูลทีละรายการ
      for (const product of productForms) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pro_name: product.pro_name,
              pro_des: product.pro_des,
              category_id: product.category_id,
              brand_id: product.brand_id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product");
        }
      }

      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มสินค้าลงฐานข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      setProductForms([
        {
          pro_name: "",
          pro_des: "",
          category_id: 0,
          brand_id: 0,
        },
      ]);

      onProductAdded(); // Call the callback to refresh the table
      onClose();
    } catch (error) {
      console.error("Error adding products:", error);
      Swal.fire({
        title: "ผิดพลาด!",
        text: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
        icon: "error",
        confirmButtonText: "ลองอีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewProductForm = () => {
    setProductForms([
      ...productForms,
      {
        pro_name: "",
        pro_des: "",
        category_id: 0,
        brand_id: 0,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[700px]">
        <h2 className="text-2xl font-bold mb-4">เพิ่มสินค้า</h2>
        <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto h-[400px] mb-4">
          {productForms.map((product, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">รายการที่ {index + 1}</h3>
              <input
                type="text"
                placeholder="ชื่อสินค้า"
                value={product.pro_name}
                onChange={(e) =>
                  handleProductChange(index, "pro_name", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="คำอธิบาย"
                value={product.pro_des}
                onChange={(e) =>
                  handleProductChange(index, "pro_des", e.target.value)
                }
                className="border p-2 rounded w-full mb-2"
              />
              <select
                value={product.category_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "category_id",
                    parseInt(e.target.value)
                  )
                }
                className="border p-2 rounded w-full mb-2"
                aria-label="เลือกประเภทสินค้า"
              >
                <option value={0}>เลือกประเภทสินค้า</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>

              <select
                value={product.brand_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "brand_id",
                    parseInt(e.target.value)
                  )
                }
                className="border p-2 rounded w-full mb-2"
                aria-label="เลือกแบรนด์สินค้า"
              >
                <option value={0}>เลือกแบรนด์สินค้า</option>
                {brands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
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

export default AddProduct;
