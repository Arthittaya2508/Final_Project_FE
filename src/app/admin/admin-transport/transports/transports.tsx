"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Transports {
  id: number;
  tran_id: number;
  tran_name: string;
  shipping_cost: number; // Add shipping_cost field
}

const Transports: React.FC = () => {
  const [tranName, setTranName] = useState("");
  const [shippingCost, setShippingCost] = useState(0); // Add state for shipping cost
  const [transports, setTransports] = useState<Transports[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransports = async () => {
    try {
      const response = await fetch("/api/transports");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransports(data);
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching transports:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/transports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tran_name: tranName,
          shipping_cost: shippingCost,
        }), // Send shipping cost
      });
      setTranName("");
      setShippingCost(0); // Reset shipping cost
      setIsModalOpen(false);
      fetchTransports();
    } catch (error) {
      console.error("Error adding transport:", error);
    }
  };

  const handleEdit = async (
    tranId: number,
    newName: string,
    newShippingCost: number
  ) => {
    try {
      await fetch("/api/transports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tran_id: tranId,
          tran_name: newName,
          shipping_cost: newShippingCost,
        }), // Updated key
      });
      fetchTransports();
    } catch (error) {
      console.error("Error editing transport:", error);
    }
  };

  const handleDelete = async (tranId: number) => {
    try {
      await fetch("/api/transports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tran_id: tranId }), // Send the tran_id for deletion
      });
      fetchTransports(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting transport:", error);
    }
  };

  const confirmEdit = (
    tranId: number,
    currentName: string,
    currentShippingCost: number
  ) => {
    Swal.fire({
      title: "Edit Transport Name and Shipping Cost",
      html: `\
        <input id="name" class="swal2-input" placeholder="Transport Name" value="${currentName}">
        <input id="shippingCost" type="number" class="swal2-input" placeholder="Shipping Cost" value="${currentShippingCost}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = (document.getElementById("name") as HTMLInputElement)
          .value;
        const newShippingCost = Number(
          (document.getElementById("shippingCost") as HTMLInputElement).value
        );
        handleEdit(tranId, newName, newShippingCost);
        Swal.fire("Saved!", "The transport has been updated.", "success");
      }
    });
  };

  const confirmDelete = (tranId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(tranId);
        Swal.fire("Deleted!", "The transport has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Transport</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tranName" className="block mb-1">
                  Name
                </label>
                <input
                  id="tranName"
                  type="text"
                  value={tranName}
                  onChange={(e) => setTranName(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="shippingCost" className="block mb-1">
                  Shipping Cost
                </label>
                <input
                  id="shippingCost"
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
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
                  Add Transport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transport List Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transports List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Transport
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Transport ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Shipping Cost</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transports.map((transport) => (
              <tr key={transport.tran_id}>
                <td className="border px-4 py-2">{transport.tran_id}</td>
                <td className="border px-4 py-2">{transport.tran_name}</td>
                <td className="border px-4 py-2">{transport.shipping_cost}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() =>
                      confirmEdit(
                        transport.tran_id,
                        transport.tran_name,
                        transport.shipping_cost
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => confirmDelete(transport.tran_id)}
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

export default Transports;
