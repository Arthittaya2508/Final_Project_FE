"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Sizes {
  id: number; // Assuming 'id' is the primary key in your database
  size_id: number; // This seems redundant with 'id'; consider using just 'id'
  size_name: string;
}

const SizeForm: React.FC = () => {
  const [sizeName, setSizeName] = useState("");
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSizes = async () => {
    try {
      const response = await fetch("/api/sizes");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSizes(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/sizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size_name: sizeName }),
      });
      setSizeName("");
      setIsModalOpen(false);
      fetchSizes();
    } catch (error) {
      console.error("Error adding size:", error);
    }
  };

  const handleEdit = async (sizeId: number, newName: string) => {
    try {
      await fetch("/api/sizes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size_id: sizeId, size_name: newName }), // Updated key
      });
      fetchSizes();
    } catch (error) {
      console.error("Error editing size:", error);
    }
  };

  const handleDelete = async (sizeId: number) => {
    try {
      await fetch("/api/sizes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size_id: sizeId }), // Updated key
      });
      fetchSizes();
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  const confirmEdit = (sizeId: number, currentName: string) => {
    Swal.fire({
      title: "Edit Size Name",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleEdit(sizeId, result.value);
        Swal.fire("Saved!", "The size name has been updated.", "success");
      }
    });
  };

  const confirmDelete = (sizeId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(sizeId);
        Swal.fire("Deleted!", "The size has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Size</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="sizeName" className="block mb-1">
                  Name
                </label>
                <input
                  id="sizeName"
                  type="text"
                  value={sizeName}
                  onChange={(e) => setSizeName(e.target.value)}
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
                  Add Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sizes List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sizes List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Size
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Size ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.size_id}>
                <td className="border px-4 py-2">{size.size_id}</td>
                <td className="border px-4 py-2">{size.size_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => confirmEdit(size.size_id, size.size_name)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(size.size_id)}
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

export default SizeForm;
