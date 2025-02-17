"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Colors {
  id: number; // Assuming 'id' is the primary key in your database
  color_id: number; // This seems redundant with 'id'; consider using just 'id'
  color_name: string;
}

const ColorForm: React.FC = () => {
  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState<Colors[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchColors = async () => {
    try {
      const response = await fetch("/api/colors");
      const data = await response.json();
      if (Array.isArray(data)) {
        setColors(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color_name: colorName }),
      });
      setColorName("");
      setIsModalOpen(false);
      fetchColors();
    } catch (error) {
      console.error("Error adding color:", error);
    }
  };

  const handleEdit = async (colorId: number, newName: string) => {
    try {
      await fetch("/api/colors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color_id: colorId, color_name: newName }), // Updated key
      });
      fetchColors();
    } catch (error) {
      console.error("Error editing color:", error);
    }
  };

  const handleDelete = async (colorId: number) => {
    try {
      await fetch("/api/colors", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color_id: colorId }), // Updated key
      });
      fetchColors();
    } catch (error) {
      console.error("Error deleting color:", error);
    }
  };

  const confirmEdit = (colorId: number, currentName: string) => {
    Swal.fire({
      title: "Edit Color Name",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleEdit(colorId, result.value);
        Swal.fire("Saved!", "The color name has been updated.", "success");
      }
    });
  };

  const confirmDelete = (colorId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(colorId);
        Swal.fire("Deleted!", "The color has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Color</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="colorName" className="block mb-1">
                  Name
                </label>
                <input
                  id="colorName"
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
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
                  Add Color
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Colors List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Colors List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Color
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Color ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.color_id}>
                <td className="border px-4 py-2">{color.color_id}</td>
                <td className="border px-4 py-2">{color.color_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() =>
                      confirmEdit(color.color_id, color.color_name)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(color.color_id)}
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

export default ColorForm;
