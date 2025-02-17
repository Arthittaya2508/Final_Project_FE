"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Band {
  id: number;
  band_id: number;
  band_name: string;
}

const BandForm: React.FC = () => {
  const [bandName, setBandName] = useState("");
  const [bands, setBands] = useState<Band[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBands = async () => {
    try {
      const response = await fetch("/api/bands");
      const data = await response.json();
      if (Array.isArray(data)) {
        setBands(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching bands:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/bands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ band_name: bandName }),
      });
      setBandName("");
      setIsModalOpen(false);
      fetchBands();
    } catch (error) {
      console.error("Error adding band:", error);
    }
  };

  const handleEdit = async (bandId: number, newName: string) => {
    try {
      await fetch("/api/bands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ band_id: bandId, band_name: newName }),
      });
      fetchBands();
    } catch (error) {
      console.error("Error editing band:", error);
    }
  };

  const handleDelete = async (bandId: number) => {
    try {
      await fetch("/api/bands", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ band_id: bandId }),
      });
      fetchBands();
    } catch (error) {
      console.error("Error deleting band:", error);
    }
  };

  const confirmEdit = (bandId: number, currentName: string) => {
    Swal.fire({
      title: "Edit Band Name",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleEdit(bandId, result.value);
        Swal.fire("Saved!", "The band name has been updated.", "success");
      }
    });
  };

  const confirmDelete = (bandId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(bandId);
        Swal.fire("Deleted!", "The band has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchBands();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Band</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bandName" className="block mb-1">
                  Name
                </label>
                <input
                  id="bandName"
                  type="text"
                  value={bandName}
                  onChange={(e) => setBandName(e.target.value)}
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
                  Add Band
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bands List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bands List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Band
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Band ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band) => (
              <tr key={band.band_id}>
                <td className="border px-4 py-2">{band.band_id}</td>
                <td className="border px-4 py-2">{band.band_name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => confirmEdit(band.band_id, band.band_name)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(band.band_id)}
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

export default BandForm;
