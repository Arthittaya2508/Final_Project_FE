"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Type {
  type_id: number;
  type_name: string;
}

const TypeForm: React.FC = () => {
  const [typeName, setTypeName] = useState("");
  const [types, setTypes] = useState<Type[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/types");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTypes(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type_name: typeName }),
      });
      setTypeName("");
      setIsModalOpen(false);
      fetchTypes(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding type:", error);
    }
  };

  const handleEdit = async (typeId: number, newName: string) => {
    try {
      await fetch("/api/types", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type_id: typeId, type_name: newName }),
      });
      fetchTypes(); // Refresh the list after editing
    } catch (error) {
      console.error("Error editing type:", error);
    }
  };

  const handleDelete = async (typeId: number) => {
    try {
      await fetch("/api/types", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type_id: typeId }),
      });
      fetchTypes(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting type:", error);
    }
  };

  const confirmEdit = (typeId: number, currentName: string) => {
    Swal.fire({
      title: "Edit Product Type",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleEdit(typeId, result.value);
        Swal.fire("Saved!", "The product type has been updated.", "success");
      }
    });
  };

  const confirmDelete = (typeId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(typeId);
        Swal.fire("Deleted!", "The product type has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Product Type</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="typeName" className="block mb-1">
                  Name
                </label>
                <input
                  id="typeName"
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Types List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Product Type
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Type ID</th>
              <th className="px-4 py-2">Type Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.type_id}>
                <td className="border px-4 py-2">{type.type_id}</td>
                <td className="border px-4 py-2">{type.type_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => confirmEdit(type.type_id, type.type_name)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(type.type_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeForm;
