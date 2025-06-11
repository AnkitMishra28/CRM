import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Context } from '../provider/AuthProvider';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  UserCheck, 
  Shield, 
  Activity,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ActivityLog = () => {
  const { user } = useContext(Context);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    userEmail: '',
    dateRange: ''
  });

  // Fetch all users
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/users", { withCredentials: true });
    return res.data;
  };

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    const res = await axios.get("http://localhost:3000/admin/activity-logs", { withCredentials: true });
    return res.data;
  };

  const { data: activityLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: fetchActivityLogs,
  });

  // Filter activity logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = !filters.search || 
      log.action?.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
      JSON.stringify(log.details)?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesAction = !filters.action || log.action === filters.action;
    const matchesUser = !filters.userEmail || log.userEmail === filters.userEmail;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  // Handle role update
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/users/${id}`, {
        role: newRole,
      }, { withCredentials: true });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "User role updated successfully.", "success");
        refetch();
      } else {
        Swal.fire("No Update", "Role is already set to this value.", "info");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // Export functionality
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      Swal.fire("No Data", "No data to export", "info");
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'User Login': return <UserCheck className="w-4 h-4" />;
      case 'User Logout': return <User className="w-4 h-4" />;
      case 'Lead Added': return <FileText className="w-4 h-4" />;
      case 'Lead Updated': return <FileText className="w-4 h-4" />;
      case 'Lead Deleted': return <FileText className="w-4 h-4" />;
      case 'Follow-up Added': return <Clock className="w-4 h-4" />;
      case 'Follow-up Status Updated': return <Clock className="w-4 h-4" />;
      case 'Follow-up Deleted': return <Clock className="w-4 h-4" />;
      case 'Ticket Added': return <AlertCircle className="w-4 h-4" />;
      case 'Ticket Status Updated': return <AlertCircle className="w-4 h-4" />;
      case 'Ticket Deleted': return <AlertCircle className="w-4 h-4" />;
      case 'User Role Changed': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'User Login': return 'text-green-600 bg-green-50 border-green-200';
      case 'User Logout': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Lead Added': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Lead Updated': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Lead Deleted': return 'text-red-600 bg-red-50 border-red-200';
      case 'Follow-up Added': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Follow-up Status Updated': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Follow-up Deleted': return 'text-red-600 bg-red-50 border-red-200';
      case 'Ticket Added': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'Ticket Status Updated': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'Ticket Deleted': return 'text-red-600 bg-red-50 border-red-200';
      case 'User Role Changed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/dashboard" 
              className="p-2 rounded-custom hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Activity & User Management</h1>
              <p className="text-gray-600">Monitor system activities and manage user roles</p>
            </div>
          </div>
        </div>

        {/* Filters */}
    <motion.div
          className="card mb-6"
          initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="input"
              >
                <option value="">All Actions</option>
                <option value="User Login">User Login</option>
                <option value="User Logout">User Logout</option>
                <option value="Lead Added">Lead Added</option>
                <option value="Lead Updated">Lead Updated</option>
                <option value="Lead Deleted">Lead Deleted</option>
                <option value="Follow-up Added">Follow-up Added</option>
                <option value="Follow-up Status Updated">Follow-up Status Updated</option>
                <option value="Follow-up Deleted">Follow-up Deleted</option>
                <option value="Ticket Added">Ticket Added</option>
                <option value="Ticket Status Updated">Ticket Status Updated</option>
                <option value="Ticket Deleted">Ticket Deleted</option>
                <option value="User Role Changed">User Role Changed</option>
              </select>
            </div>

            <div>
              <select
                value={filters.userEmail}
                onChange={(e) => setFilters(prev => ({ ...prev, userEmail: e.target.value }))}
                className="input"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user._id} value={user.email}>{user.email}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Activity Logs */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Activity Logs ({filteredLogs.length})
            </h2>
            <button
              onClick={() => exportToCSV(filteredLogs, 'activity-logs')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getActionIcon(log.action)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{log.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : 'No additional details'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No activity logs found</p>
                        <p className="text-sm">No activities match your current filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Management ({users.length})
      </h2>
            <button
              onClick={() => exportToCSV(users, 'users-list')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Users</span>
            </button>
          </div>

      <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
            </tr>
          </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.user_photo || 'https://via.placeholder.com/40'}
                    alt="user"
                    className="w-10 h-10 rounded-full"
                  />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                    <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-sm font-medium px-3 py-1 rounded-full border ${
                          user.role === 'admin' 
                            ? 'text-red-600 bg-red-50 border-red-200' 
                            : 'text-blue-600 bg-blue-50 border-blue-200'
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="executives">Executive</option>
                  </select>
                </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">No users are currently registered in the system.</p>
                      </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
      </div>
    </div>
  );
};

export default ActivityLog;
