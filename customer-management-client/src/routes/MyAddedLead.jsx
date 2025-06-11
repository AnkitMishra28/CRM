import React, { useContext, useState } from 'react'
import { Context } from '../provider/AuthProvider';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  Calendar,
  Phone,
  Mail,
  Package,
  Flag // Import Flag icon for priority
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyAddedLead = () => {
  let { user } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all'); // New state for priority filter

  const fetchUsers = async () => {
    const response = await axios.get(`http://localhost:3000/myleads/${user?.email}`, { withCredentials: true });
    return response.data;
  };

  const { data: mylead = [], isLoading: myleadLoading, refetch } = useQuery({
    queryKey: [user?.email, "mylead"],
    queryFn: fetchUsers,
  });

  const handleUpdate = async (id, field, value) => {
    try {
      await axios.patch(`http://localhost:3000/api/leads/${id}`, {
        [field]: value,
      }, { withCredentials: true });
      refetch();
      Swal.fire({
        title: "Updated",
        text: `Lead ${field} updated!`, 
        icon: "success",
        confirmButtonColor: "#4A90E2",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to update lead",
        icon: "error",
        confirmButtonColor: "#E57373",
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This lead will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E57373",
      cancelButtonColor: "#9E9E9E",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/leads/${id}`, { withCredentials: true });
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Lead has been deleted.",
            icon: "success",
            confirmButtonColor: "#4A90E2",
          });
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete lead",
            icon: "error",
            confirmButtonColor: "#E57373",
          });
        }
      }
    });
  };

  // Filter leads based on search and filters
  const filteredLeads = mylead.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (lead.phone && lead.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesProduct = productFilter === 'all' || lead.product === productFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter; // New filter logic
    
    return matchesSearch && matchesStatus && matchesProduct && matchesPriority;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge badge-new';
      case 'In Process': return 'badge badge-in-process';
      case 'Follow-Up': return 'badge badge-follow-up';
      case 'Closed': return 'badge badge-closed';
      default: return 'badge badge-new';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Low': return 'badge badge-priority-low';
      case 'Medium': return 'badge badge-priority-medium';
      case 'High': return 'badge badge-priority-high';
      default: return 'badge badge-priority-low';
    }
  };

  const getUniqueProducts = () => {
    const products = mylead.map(lead => lead.product).filter(Boolean);
    return [...new Set(products)];
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Added Leads</h1>
              <p className="text-gray-600">Manage and track your leads</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Link
                to="/dashboard/addalead"
                className="btn btn-success"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Link>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="In Process">In Process</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Products</option>
              {getUniqueProducts().map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {myleadLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading leads...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Priority</th> {/* New column for Priority */}
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Expected Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Notes</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-2" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-2" />
                            {lead.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="w-3 h-3 mr-2" />
                          {lead.product}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdate(lead._id, 'status', e.target.value)}
                          className="text-sm border border-gray-300 rounded-custom px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="New">New</option>
                          <option value="In Process">In Process</option>
                          <option value="Follow-Up">Follow-Up</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={lead.priority}
                          onChange={(e) => handleUpdate(lead._id, 'priority', e.target.value)}
                          className="text-sm border border-gray-300 rounded-custom px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{lead.expectedDate}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{lead.notes}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {/* Add an edit button if more complex editing is needed */}
                          {/* <button
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit Lead"
                          >
                            <Edit className="w-4 h-4" />
                          </button> */}
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyAddedLead;