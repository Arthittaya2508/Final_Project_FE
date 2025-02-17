"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Genders {
  id: number; // Assuming 'id' is the primary key in your database
  gender_id: number; // This seems redundant with 'id'; consider using just 'id'
  gender_name: string;
}

const GenderForm: React.FC = () => {
  const [genderName, setGenderName] = useState("");
  const [genders, setGenders] = useState<Genders[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGenders = async () => {
    try {
      const response = await fetch("/api/genders");
      const data = await response.json();
      if (Array.isArray(data)) {
        setGenders(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching genders:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/genders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender_name: genderName }),
      });
      setGenderName("");
      setIsModalOpen(false);
      fetchGenders();
    } catch (error) {
      console.error("Error adding gender:", error);
    }
  };

  const handleEdit = async (genderId: number, newName: string) => {
    try {
      await fetch("/api/genders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender_id: genderId, gender_name: newName }), // Updated key
      });
      fetchGenders();
    } catch (error) {
      console.error("Error editing gender:", error);
    }
  };

  const handleDelete = async (genderId: number) => {
    try {
      await fetch("/api/genders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender_id: genderId }), // Updated key
      });
      fetchGenders();
    } catch (error) {
      console.error("Error deleting gender:", error);
    }
  };

  const confirmEdit = (genderId: number, currentName: string) => {
    Swal.fire({
      title: "Edit Gender Name",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleEdit(genderId, result.value);
        Swal.fire("Saved!", "The gender name has been updated.", "success");
      }
    });
  };

  const confirmDelete = (genderId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(genderId);
        Swal.fire("Deleted!", "The gender has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Gender</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="genderName" className="block mb-1">
                  Name
                </label>
                <input
                  id="genderName"
                  type="text"
                  value={genderName}
                  onChange={(e) => setGenderName(e.target.value)}
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
                  Add Gender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Genders List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Genders List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Gender
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Gender ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {genders.map((gender) => (
              <tr key={gender.gender_id}>
                <td className="border px-4 py-2">{gender.gender_id}</td>
                <td className="border px-4 py-2">{gender.gender_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() =>
                      confirmEdit(gender.gender_id, gender.gender_name)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(gender.gender_id)}
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

export default GenderForm;
