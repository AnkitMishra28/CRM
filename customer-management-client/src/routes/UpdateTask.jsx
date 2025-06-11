import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/specificTask/${id}`, { withCredentials: true })
      .then((res) => setTask(res.data))
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load task", "error");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedTask = {
      email: form.email.value,
      title: form.title.value,
      description: form.description.value,
      deadline: form.deadline.value,
    };

    try {
      const res = await axios.put(`http://localhost:3000/api/tasks/${id}`, updatedTask, { withCredentials: true });
      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        Swal.fire("Success", "Task updated successfully!", "success");
        navigate("/dashboard/managetask"); // redirect after update
      } else {
        Swal.fire("Info", "No changes detected.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update task", "error");
    }
  };

  if (!task) return <div className="text-center py-10">Loading task...</div>;

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Update Task</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Executive Email</label>
          <input
            type="email"
            name="email"
            defaultValue={task.email}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            defaultValue={task.title}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Task Description</label>
          <textarea
            name="description"
            defaultValue={task.description}
            required
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            name="deadline"
            defaultValue={task.deadline}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Task
        </button>
      </form>
    </motion.div>
  );
};

export default UpdateTask;
