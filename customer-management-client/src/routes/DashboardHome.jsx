import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
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
import useAdminCount from '../hook/useAdminCount';
import useUser from '../hook/useUser';
import useTask from '../hook/useTask';
import useemployeeCount from '../hook/useEmployeecount';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useLead from '../hook/useLead';
import { Context } from '../provider/AuthProvider';
import { 
  Users, 
  Shield, 
  Briefcase, 
  ClipboardList, 
  Target,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import AlertsDisplay from '../component/AlertsDisplay';

const fetchUsers = async () => {
  const response = await axios.get(`http://localhost:3000/paymentDetails`);
  return response.data;
};

const fetchLeadsByExecutive = async () => {
  const response = await axios.get(`http://localhost:3000/performance/leads-by-executive`, { withCredentials: true });
  return response.data;
};

const fetchFollowupsCompleted = async () => {
  const response = await axios.get(`http://localhost:3000/performance/followups-completed`, { withCredentials: true });
  return response.data;
};

const fetchClosureRates = async () => {
  const response = await axios.get(`http://localhost:3000/performance/closure-rates`, { withCredentials: true });
  return response.data;
};

const fetchLeadConversionTrends = async () => {
  const response = await axios.get(`http://localhost:3000/performance/lead-conversion-trends`, { withCredentials: true });
  return response.data;
};

const fetchMyLeads = async (email) => {
  const response = await axios.get(`http://localhost:3000/myleads/${email}`, { withCredentials: true });
  return response.data;
};

const fetchMyFollowUps = async (email) => {
  const response = await axios.get(`http://localhost:3000/myfollowUp/${email}`, { withCredentials: true });
  return response.data;
};

const fetchMyTickets = async (email) => {
  const response = await axios.get(`http://localhost:3000/myaddedticket/${email}`, { withCredentials: true });
  return response.data;
};

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardHome = () => {
  const { user, loading } = useContext(Context);

  let [employee] = useemployeeCount();
  let [admin] = useAdminCount();
  let [users] = useUser();
  let [task] = useTask();
  let [lead] = useLead();

  const { data: paymentSalary = [] } = useQuery({
    queryKey: ["paymentSalary"],
    queryFn: fetchUsers,
  });

  const { data: leadsByExecutive = [], isLoading: leadsByExecutiveLoading } = useQuery({
    queryKey: ["leadsByExecutive"],
    queryFn: fetchLeadsByExecutive,
    enabled: user?.role === "admin",
  });

  const { data: followupsCompleted = [], isLoading: followupsCompletedLoading } = useQuery({
    queryKey: ["followupsCompleted"],
    queryFn: fetchFollowupsCompleted,
    enabled: user?.role === "admin",
  });

  const { data: closureRates = [], isLoading: closureRatesLoading } = useQuery({
    queryKey: ["closureRates"],
    queryFn: fetchClosureRates,
    enabled: user?.role === "admin",
  });

  const { data: leadConversionTrends = [], isLoading: leadConversionTrendsLoading } = useQuery({
    queryKey: ["leadConversionTrends"],
    queryFn: fetchLeadConversionTrends,
    enabled: user?.role === "admin",
  });

  const { data: myLeads = [], isLoading: myLeadsLoading } = useQuery({
    queryKey: ["myLeads", user?.email],
    queryFn: () => fetchMyLeads(user.email),
    enabled: user?.role === "executives" && !!user?.email,
  });

  const { data: myFollowUps = [], isLoading: myFollowUpsLoading } = useQuery({
    queryKey: ["myFollowUps", user?.email],
    queryFn: () => fetchMyFollowUps(user.email),
    enabled: user?.role === "executives" && !!user?.email,
  });

  const { data: myTickets = [], isLoading: myTicketsLoading } = useQuery({
    queryKey: ["myTickets", user?.email],
    queryFn: () => fetchMyTickets(user.email),
    enabled: user?.role === "executives" && !!user?.email,
  });

  let salaryArray = paymentSalary.map(salary => salary.price);
  let totalSalary = 0;
  for (let salary of salaryArray) {
    totalSalary += parseInt(salary, 10);
  }

  // Handle loading state
  if (loading || leadsByExecutiveLoading || followupsCompletedLoading || closureRatesLoading || leadConversionTrendsLoading || myLeadsLoading || myFollowUpsLoading || myTicketsLoading) {
    return <div>Loading Dashboard...</div>; 
  }

  const isAdmin = user?.role === "admin";
  const isExecutive = user?.role === "executives";

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dashboardData = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Admins',
      value: admin.length,
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Employees',
      value: employee.length,
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Tasks',
      value: task.length,
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Leads',
      value: lead.length,
      icon: <Target className="w-6 h-6" />,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
  ];

  // Prepare data for the user role bar chart
  const roleCounts = users.reduce(
    (acc, user) => {
      if (user.role === 'admin') acc.admin += 1;
      else if (user.role === 'employee') acc.employee += 1;
      return acc;
    },
    { admin: 0, employee: 0 }
  );

  const userChartData = {
    labels: ['Admins', 'Employees'],
    datasets: [
      {
        label: 'User Roles',
        data: [roleCounts.admin, roleCounts.employee],
        backgroundColor: ['#4A90E2', '#7CB342'],
        borderColor: ['#3A7BC8', '#6BA032'],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#666666',
        },
      },
      title: {
        display: true,
        text: 'User Distribution by Role',
        font: {
          family: 'Inter',
          size: 16,
          weight: '600',
        },
        color: '#333333',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#666666',
        },
        grid: {
          color: '#F0F0F0',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Role',
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#666666',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Prepare data for the task status bar chart
  const taskStatusCounts = task.reduce(
    (acc, task) => {
      if (task.status === 'complete') acc.complete += 1;
      else if (task.status === 'pending') acc.pending += 1;
      return acc;
    },
    { complete: 0, pending: 0 }
  );

  const taskChartData = {
    labels: ['Complete', 'Pending'],
    datasets: [
      {
        label: 'Task Status',
        data: [taskStatusCounts.complete, taskStatusCounts.pending],
        backgroundColor: ['#4CAF50', '#FFC107'],
        borderColor: ['#388E3C', '#FFA000'],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const taskChartOptions = {
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
        text: 'Task Status Distribution',
        font: { family: 'Inter', size: 16, weight: '600' },
        color: '#333333',
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Prepare data for Leads by Executive chart
  const leadsByExecutiveChartData = {
    labels: leadsByExecutive.map(item => item.executiveName || item.executiveEmail),
    datasets: [
      {
        label: 'Total Leads',
        data: leadsByExecutive.map(item => item.totalLeads),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const leadsByExecutiveChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Leads by Executive' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Prepare data for Follow-ups Completed chart
  const followupsCompletedChartData = {
    labels: followupsCompleted.map(item => item.executiveName || item.executiveEmail),
    datasets: [
      {
        label: 'Follow-ups Completed',
        data: followupsCompleted.map(item => item.completedFollowups),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const followupsCompletedChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Follow-ups Completed by Executive' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Prepare data for Closure Rates chart
  const closureRatesChartData = {
    labels: closureRates.map(item => item.executiveName || item.executiveEmail),
    datasets: [
      {
        label: 'Closure Rate (%)',
        data: closureRates.map(item => item.closureRate),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const closureRatesChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Lead Closure Rates by Executive' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  // Prepare data for Lead Conversion Trends chart (Pie Chart)
  const leadConversionTrendsChartData = {
    labels: leadConversionTrends.map(item => item._id),
    datasets: [
      {
        label: 'Lead Status',
        data: leadConversionTrends.map(item => item.count),
        backgroundColor: [
          '#FF6384', // Hot
          '#36A2EB', // Warm
          '#FFCE56', // Cold
          '#4BC0C0', // New
          '#9966FF', // In Process
          '#FF9900', // Follow-up
          '#C9CBCF', // Closed
        ],
        hoverBackgroundColor: [
          '#FF6384', 
          '#36A2EB', 
          '#FFCE56', 
          '#4BC0C0', 
          '#9966FF', 
          '#FF9900', 
          '#C9CBCF', 
        ],
      },
    ],
  };

  const leadConversionTrendsChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Lead Conversion Trends' },
    },
  };

  // Prepare data for Executive Dashboard Lead Summary (Hot, Warm, Cold)
  const executiveLeadStatusCounts = myLeads.reduce(
    (acc, lead) => {
      if (lead.status === 'Hot') acc.hot += 1;
      else if (lead.status === 'Warm') acc.warm += 1;
      else if (lead.status === 'Cold') acc.cold += 1;
      return acc;
    },
    { hot: 0, warm: 0, cold: 0 }
  );

  const executiveLeadStatusData = {
    labels: ['Hot Leads', 'Warm Leads', 'Cold Leads'],
    datasets: [
      {
        data: [executiveLeadStatusCounts.hot, executiveLeadStatusCounts.warm, executiveLeadStatusCounts.cold],
        backgroundColor: ['#EF5350', '#FFCA28', '#42A5F5'],
        borderColor: ['#D32F2F', '#F57C00', '#1976D2'],
        borderWidth: 2,
      },
    ],
  };

  const executiveLeadStatusOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'My Lead Distribution by Status' },
    },
  };

  // Filter today's follow-ups
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysFollowUps = myFollowUps.filter(followUp => {
    const followUpDate = new Date(followUp.date); // Assuming 'date' field for follow-up date
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() === today.getTime();
  });

  return (
    <div className="p-6">
      {isAdmin && (
        <div className="admin-dashboard">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
          <AlertsDisplay />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardData.map((item, index) => (
            <motion.div
              key={index}
                className={`p-6 rounded-lg shadow-md flex items-center justify-between ${item.bgColor}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <div>
                  <h3 className={`text-lg font-semibold ${item.textColor}`}>{item.title}</h3>
                  <p className={`text-3xl font-bold ${item.textColor}`}>{item.value}</p>
                </div>
                <div className={`p-3 rounded-full ${item.color} text-white`}>
                  {item.icon}
              </div>
            </motion.div>
          ))}
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Bar data={userChartData} options={userChartOptions} />
          </motion.div>
          <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Bar data={taskChartData} options={taskChartOptions} />
          </motion.div>
        </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">Performance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Bar data={leadsByExecutiveChartData} options={leadsByExecutiveChartOptions} />
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Bar data={followupsCompletedChartData} options={followupsCompletedChartOptions} />
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <Bar data={closureRatesChartData} options={closureRatesChartOptions} />
            </motion.div>
        <motion.div
              className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Pie data={leadConversionTrendsChartData} options={leadConversionTrendsChartOptions} />
        </motion.div>
      </div>

          {/* Ticket Status and Resolution Timelines (Admin) */} 
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Ticket Overview</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">All Tickets Status</h3>
            {myTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ticket ID</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Subject</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Priority</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Raised By</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Raised On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.map(ticket => (
                      <tr key={ticket._id}>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket._id.substring(0, 8)}...</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.subject || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.status || 'Open'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.priority || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.executiveEmail || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(ticket.createdAt).toLocaleDateString() || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No tickets to display.</p>
            )}
          </div>

          {/* Expected Closure Timelines Across All Leads (Admin) */} 
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Lead Closure Timelines</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Lead Closure Overview</h3>
            {lead.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Lead Name</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Executive</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Expected Closure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.map(singleLead => (
                      <tr key={singleLead._id}>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{singleLead.name}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{singleLead.status}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{singleLead.myEmail || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(singleLead.expectedClosureDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No leads to display for closure timelines.</p>
            )}
          </div>

        </div>
      )}

      {isExecutive && (
        <div className="executive-dashboard">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Executive Dashboard</h1>
          <AlertsDisplay />
          {/* Lead summary categorized as Hot, Warm, Cold */} 
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Lead Summary</h2>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Pie data={executiveLeadStatusData} options={executiveLeadStatusOptions} />
          </motion.div>

          {/* List of today's follow-ups and scheduled tasks */} 
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Follow-ups</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {todaysFollowUps.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {todaysFollowUps.map(followUp => (
                  <li key={followUp._id} className="mb-2">
                    Lead: <span className="font-semibold">{followUp.leadName || 'N/A'}</span> -
                    Due: <span className="font-semibold">{new Date(followUp.date).toLocaleTimeString()}</span> -
                    Status: <span className="font-semibold">{followUp.status || 'N/A'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No follow-ups scheduled for today.</p>
            )}
          </div>

          {/* Ticket updates and alerts */} 
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Ticket Updates</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {myTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ticket ID</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Subject</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Priority</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Raised On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.map(ticket => (
                      <tr key={ticket._id}>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket._id}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.subject || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.status || 'Open'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.priority || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(ticket.createdAt).toLocaleDateString() || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No tickets to display.</p>
            )}
          </div>

        </div>
      )}

      {!isAdmin && !isExecutive && (
        <div className="default-dashboard">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Your Dashboard!</h1>
          <p className="text-gray-600">Please log in with appropriate credentials to view your specialized dashboard content.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;