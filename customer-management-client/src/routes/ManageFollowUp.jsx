import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ManageFollowUp = () => {

     const fetchUsers = async () => {
        const response = await axios.get(`http://localhost:3000/manageFollowup`);
        return response.data;
      };

      

   
    const { data: allfollowup = [], isLoading:allfollowupLoading,refetch } = useQuery({
        queryKey: ["allfollowup"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
      });

      const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/followups/${id}`, {
        status: newStatus,
      });
      refetch();
      Swal.fire('Updated!', 'Follow-up status updated.', 'success');
    } catch (err) {
      Swal.fire('Error!', 'Failed to update status.', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This follow-up will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/followups/${id}`);
          refetch();
          Swal.fire('Deleted!', 'Follow-up has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete follow-up.', 'error');
        }
      }
    });
  };

  return (
    <div>

          <motion.div
      className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        My Follow-Ups
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Lead Email</th>
              <th className="py-3 px-4 border">Date</th>
              <th className="py-3 px-4 border">Time</th>
              <th className="py-3 px-4 border">Remarks</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allfollowup.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border">{index + 1}</td>
                <td className="py-3 px-4 border">{item.email}</td>
                <td className="py-3 px-4 border">{item.followUpDate}</td>
                <td className="py-3 px-4 border">{item.time}</td>
                <td className="py-3 px-4 border">{item.remarks}</td>
                <td className="py-3 px-4 border">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td className="py-3 px-4 border text-center space-x-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {allfollowup.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No follow-ups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>



    </div>
  )
}

export default ManageFollowUp