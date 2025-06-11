import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import Loading from '../component/loading';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';




const ManageTask = () => {

  const fetchUsers = async () => {
        const response = await axios.get(`http://localhost:3000/api/tasks`);
        return response.data;
      };

      
    const { data: task = [], isLoading:taskLoading,refetch } = useQuery({
        queryKey: ["task"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
      });


      const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${id}`);
        refetch()
      
        Swal.fire("Deleted!", "Task has been deleted.", "success");
      
      } catch (error) {
        Swal.fire("Error!", "Failed to delete task.", "error");
      }
    }
  };

 

 
     



    
  return (
   <div>

    <motion.div
      className="max-w-6xl mx-auto mt-10 p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-400">
        Manage All Assigned Tasks
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Deadline</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {task.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              task.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{task.email}</td>
                  <td className="py-3 px-4">{task.title}</td>
                  <td className="py-3 px-4">{task.description}</td>
                  <td className="py-3 px-4">{task.deadline}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <Link to={`/dashboard/updateTask/${task._id}`}
                      
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>


   </div>
  )
}

export default ManageTask