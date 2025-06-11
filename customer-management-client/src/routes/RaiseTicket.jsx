import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { Context } from "../provider/AuthProvider";
import { 
  Ticket, 
  User, 
  AlertTriangle, 
  MessageSquare, 
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RaiseTicket = () => {
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    subject: "",
    customerEmail: "",
    category: "Escalation",
    priority: "Medium",
    message: "",
    status: "Open",
    executiveEmail: user?.email,
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.subject || !formData.message) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }

    try {
      await axios.post("http://localhost:3000/api/tickets", formData, { withCredentials: true });
      Swal.fire("Success!", "Ticket submitted successfully!", "success");
      setFormData({
        subject: "",
        customerEmail: "",
        category: "Escalation",
        priority: "Medium",
        message: "",
        status: "Open",
        executiveEmail: user?.email,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to submit ticket", "error");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Raise Support Ticket</h1>
              <p className="text-gray-600">Create a new support ticket for internal assistance</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                <Ticket className="w-4 h-4 inline mr-2" />
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="input"
                required
              />
            </div>

            {/* Customer Email */}
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="input"
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Escalation">Escalation</option>
                  <option value="KYC Issue">KYC or Documentation Issue</option>
                  <option value="Product Query">Product or Policy Query</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing Issue">Billing Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Priority Indicator */}
            {formData.priority && (
              <div className={`p-3 rounded-lg border ${getPriorityColor(formData.priority)}`}>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Priority: {formData.priority}
                  </span>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide detailed information about the issue, including any relevant context, steps to reproduce, and expected outcome..."
                className="input min-h-[120px] resize-none"
                rows={5}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Submit Ticket
              </button>
              
              <Link
                to="/dashboard"
                className="btn btn-secondary flex-1 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Help Information */}
        <motion.div
          className="mt-6 card bg-blue-50 border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Ticket Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Escalation:</strong> For issues requiring management attention</li>
                <li>• <strong>KYC Issue:</strong> For documentation and verification problems</li>
                <li>• <strong>Product Query:</strong> For questions about insurance products</li>
                <li>• <strong>High Priority:</strong> Use for urgent matters affecting customer service</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RaiseTicket;
