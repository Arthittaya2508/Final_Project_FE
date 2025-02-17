import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  types: Type[];
  bands: Band[];
  onSave: (product: Product) => void;
}

export interface Type {
  type_id: number;
  type_name: string;
}

export interface Band {
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

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  types,
  bands,
  onSave,
}) => {
  const [proName, setProName] = useState<string>("");
  const [descrip, setDescrip] = useState<string>("");
  const [typeId, setTypeId] = useState<number>(0);
  const [bandId, setBandId] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setProName(product.pro_name);
      setDescrip(product.pro_des);
      setTypeId(product.type_id);
      setBandId(product.band_id);
    }
  }, [product]);

  const handleSave = async () => {
    if (product?.pro_id) {
      try {
        await fetch(`/api/products/${product.pro_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pro_name: proName,
            pro_des: descrip,
            type_id: typeId,
            band_id: bandId,
          }),
        });
        onSave({
          ...product,
          pro_name: proName,
          pro_des: descrip,
          type_id: typeId,
          band_id: bandId,
        });
        onClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product updated successfully!",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update the product.",
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <AiOutlineClose className="h-8 w-8" />
        </button>
        <h2 className="text-2xl font-bold mb-6">แก้ไขสินค้า</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              value={proName}
              onChange={(e) => setProName(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำอธิบายสินค้า
            </label>
            <input
              type="text"
              value={descrip}
              onChange={(e) => setDescrip(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภท
            </label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(Number(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select Type</option>
              {types.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Band
            </label>
            <select
              value={bandId}
              onChange={(e) => setBandId(Number(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select Band</option>
              {bands.map((band) => (
                <option key={band.band_id} value={band.band_id}>
                  {band.band_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
