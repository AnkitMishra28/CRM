import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";
import { useQuery } from '@tanstack/react-query';
import { User, Calendar, Clock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddFollowUp = () => {
  let { user } = useContext(Context);
  const [formData, setFormData] = useState({
    leadId: "",
    leadName: "",
    leadEmail: "",
    followUpDate: "",
    time: "",
    remarks: "",
    status: "Pending",
    myEmail: user?.email
  });

  // Fetch executive's leads
  const fetchMyLeads = async () => {
    const response = await axios.get(`http://localhost:3000/myleads/${user?.email}`, { withCredentials: true });
    return response.data;
  };

  const { data: myLeads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["myLeads", user?.email],
    queryFn: fetchMyLeads,
    enabled: !!user?.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "leadId") {
      // When a lead is selected, populate lead details
      const selectedLead = myLeads.find(lead => lead._id === value);
      setFormData(prev => ({
        ...prev,
        leadId: value,
        leadName: selectedLead ? selectedLead.name : "",
        leadEmail: selectedLead ? selectedLead.email : "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.leadId || !formData.followUpDate || !formData.time) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/followups", formData, { withCredentials: true });
      if (res.data.insertedId) {
        Swal.fire("Success", "Follow-up added successfully!", "success");
        setFormData({
          leadId: "",
          leadName: "",
          leadEmail: "",
          followUpDate: "",
          time: "",
          remarks: "",
          status: "Pending",
          myEmail: user?.email
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add follow-up", "error");
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
              <h1 className="text-2xl font-bold text-gray-900">Schedule Follow-Up</h1>
              <p className="text-gray-600">Create a new follow-up for your leads</p>
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
            {/* Lead Selection */}
            <div>
              <label htmlFor="leadId" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Select Lead <span className="text-red-500">*</span>
              </label>
              {leadsLoading ? (
                <div className="input flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading leads...
                </div>
              ) : myLeads.length === 0 ? (
                <div className="input text-gray-500">
                  No leads found. Please add a lead first.
                </div>
              ) : (
                <select
                  id="leadId"
                  name="leadId"
                  value={formData.leadId}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a lead</option>
                  {myLeads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name} - {lead.email} ({lead.product})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected Lead Details */}
            {formData.leadName && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Selected Lead Details</h3>
                <div className="text-sm text-blue-800">
                  <p><strong>Name:</strong> {formData.leadName}</p>
                  <p><strong>Email:</strong> {formData.leadEmail}</p>
                </div>
              </div>
            )}

            {/* Follow-up Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Follow-up Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add any notes or remarks about this follow-up..."
                className="input min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={leadsLoading || myLeads.length === 0}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Follow-Up
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
      </div>
    </div>
  );
};

export default AddFollowUp;
