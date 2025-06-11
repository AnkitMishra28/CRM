import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  Download,
  Eye,
  Edit,
  Search,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

const AdminDashboard = () => {
  const [selectedExecutive, setSelectedExecutive] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/userCount");
      return response.data;
    },
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/manageLead");
      return response.data;
    },
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/alltickets");
      return response.data;
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/task");
      return response.data;
    },
  });

  const { data: followUps = [] } = useQuery({
    queryKey: ["followUps"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/manageFollowup");
      return response.data;
    },
  });

  // Filter executives (employees)
  const executives = users.filter(user => user.role === 'executives');
  
  // Filter leads by executive
  const filteredLeads = leads.filter(lead => {
    if (selectedExecutive !== 'all' && lead.executiveEmail !== selectedExecutive) return false;
    if (selectedProduct !== 'all' && lead.product !== selectedProduct) return false;
    if (selectedStatus !== 'all' && lead.status !== selectedStatus) return false;
    if (searchTerm && !lead.customerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Calculate metrics
  const totalLeads = leads.length;
  const totalExecutives = executives.length;
  const totalTickets = tickets.length;
  const totalTasks = tasks.length;
  const totalFollowUps = followUps.length;

  // Lead status distribution
  const leadStatusCounts = {
    hot: leads.filter(lead => lead.status === 'hot').length,
    warm: leads.filter(lead => lead.status === 'warm').length,
    cold: leads.filter(lead => lead.status === 'cold').length,
  };

  // Ticket status distribution
  const ticketStatusCounts = {
    open: tickets.filter(ticket => ticket.status === 'Open').length,
    inProgress: tickets.filter(ticket => ticket.status === 'In Progress').length,
    resolved: tickets.filter(ticket => ticket.status === 'Resolved').length,
  };

  // Executive performance
  const executivePerformance = executives.map(exec => {
    const execLeads = leads.filter(lead => lead.executiveEmail === exec.email);
    const execTickets = tickets.filter(ticket => ticket.executiveEmail === exec.email);
    const execTasks = tasks.filter(task => task.executiveEmail === exec.email);
    
    return {
      name: exec.name || exec.email,
      email: exec.email,
      totalLeads: execLeads.length,
      hotLeads: execLeads.filter(lead => lead.status === 'hot').length,
      totalTickets: execTickets.length,
      resolvedTickets: execTickets.filter(ticket => ticket.status === 'Resolved').length,
      totalTasks: execTasks.length,
      completedTasks: execTasks.filter(task => task.status === 'complete').length,
    };
  });

  // Chart data
  const leadStatusData = {
    labels: ['Hot Leads', 'Warm Leads', 'Cold Leads'],
    datasets: [{
      data: [leadStatusCounts.hot, leadStatusCounts.warm, leadStatusCounts.cold],
      backgroundColor: ['#EF5350', '#FFCA28', '#42A5F5'],
      borderColor: ['#D32F2F', '#F57C00', '#1976D2'],
      borderWidth: 2,
    }],
  };

  const ticketStatusData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [{
      data: [ticketStatusCounts.open, ticketStatusCounts.inProgress, ticketStatusCounts.resolved],
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      borderColor: ['#FF5252', '#26A69A', '#1976D2'],
      borderWidth: 2,
    }],
  };

  const executivePerformanceData = {
    labels: executivePerformance.map(exec => exec.name),
    datasets: [
      {
        label: 'Total Leads',
        data: executivePerformance.map(exec => exec.totalLeads),
        backgroundColor: '#4A90E2',
        borderColor: '#3A7BC8',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Hot Leads',
        data: executivePerformance.map(exec => exec.hotLeads),
        backgroundColor: '#EF5350',
        borderColor: '#D32F2F',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#666666',
        },
      },
      title: {
        display: true,
        font: { family: 'Inter', size: 16, weight: '600' },
        color: '#333333',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          font: { family: 'Inter', size: 12 },
          color: '#666666',
        },
        grid: { color: '#F0F0F0' },
      },
      x: {
        title: {
          display: true,
          font: { family: 'Inter', size: 12 },
          color: '#666666',
        },
        grid: { display: false },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#666666',
          padding: 20,
        },
      },
      title: {
        display: true,
        font: { family: 'Inter', size: 16, weight: '600' },
        color: '#333333',
      },
    },
  };

  // Export functionality
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to export');
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

  const dashboardData = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Executives',
      value: totalExecutives,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Open Tickets',
      value: ticketStatusCounts.open,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '-8%',
      changeType: 'negative'
    },
    {
      title: 'Completed Tasks',
      value: tasks.filter(task => task.status === 'complete').length,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Follow-ups',
      value: totalFollowUps,
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: '+20%',
      changeType: 'positive'
    },
    {
      title: 'Conversion Rate',
      value: totalLeads > 0 ? `${((leadStatusCounts.hot / totalLeads) * 100).toFixed(1)}%` : '0%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      change: '+3.2%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-inter">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Complete overview of PerformaSuite CRM performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <button 
            className="btn btn-primary flex items-center space-x-2"
            onClick={() => exportToCSV(filteredLeads, 'leads-report')}
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {dashboardData.map((card, index) => (
          <motion.div
            key={index}
            className="card card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <div className={`flex items-center text-xs mt-1 ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {card.change}
                </div>
              </div>
              <div className={`p-3 rounded-custom ${card.bgColor}`}>
                <div className={card.textColor}>
                  {card.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Section */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Lead Management Filters</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedExecutive}
              onChange={(e) => setSelectedExecutive(e.target.value)}
              className="input-field"
            >
              <option value="all">All Executives</option>
              {executives.map(exec => (
                <option key={exec.email} value={exec.email}>
                  {exec.name || exec.email}
                </option>
              ))}
            </select>
            
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input-field"
            >
              <option value="all">All Products</option>
              <option value="health">Health Insurance</option>
              <option value="life">Life Insurance</option>
              <option value="motor">Motor Insurance</option>
              <option value="home">Home Insurance</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lead Status Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <Pie data={leadStatusData} options={pieChartOptions} />
        </motion.div>
        
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ticket Status Overview</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <Doughnut data={ticketStatusData} options={pieChartOptions} />
        </motion.div>
      </div>

      {/* Executive Performance Chart */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Executive Performance</h3>
          <LineChart className="w-5 h-5 text-gray-400" />
        </div>
        <Bar 
          data={executivePerformanceData} 
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                ...chartOptions.plugins.title,
                text: 'Leads by Executive'
              }
            }
          }} 
        />
      </motion.div>

      {/* Recent Leads Table */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Showing {filteredLeads.length} of {totalLeads} leads
            </span>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => exportToCSV(filteredLeads, 'filtered-leads')}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Executive
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.slice(0, 10).map((lead, index) => (
                <tr key={lead._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{lead.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.executiveEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                      lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 