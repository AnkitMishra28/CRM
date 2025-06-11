import React, { useContext, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import Loading from '../component/loading';
import { 
  FaChartLine, 
  FaHome, 
  FaUser, 
  FaBars,
  FaTimes,
  FaBell,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { MdAttribution } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { MdOutlineBrowserUpdated } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { MdAddTask } from "react-icons/md";
import { SiManageiq } from "react-icons/si";
import { RiSecurePaymentLine } from "react-icons/ri";
import { 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Download,
  Filter,
  Eye,
  Edit,
  Search
} from 'lucide-react';
import Toogle from '../component/Toogle';
import bg from "../assets/bg1.jpg"

const Dashboard = () => {
  const { signOuts, darkmode, user, loading } = useContext(Context);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  let nav = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = () => {
    signOuts();
    nav("/login");
  };

  if (loading) {
    return <Loading></Loading>;
  }

  const isAdmin = user?.role === "admin";
  const isExecutive = user?.role === "executives";

  const sidebarItems = [
    {
      to: isAdmin ? "/dashboard/admin-dashboard" : "/dashboard",
      icon: <FaHome className="w-5 h-5" />,
      label: isAdmin ? "Admin Dashboard" : "Dashboard Home",
      color: "text-blue-600"
    },
    // Admin items
    ...(isAdmin ? [
      {
        to: "/dashboard/addtask",
        icon: <MdAddTask className="w-5 h-5" />,
        label: "Add Task",
        color: "text-green-600"
      },
      {
        to: "/dashboard/managetask",
        icon: <SiManageiq className="w-5 h-5" />,
        label: "Manage Task",
        color: "text-purple-600"
      },
      {
        to: "/dashboard/manageLead",
        icon: <MdBookmarkAdded className="w-5 h-5" />,
        label: "Manage Lead",
        color: "text-orange-600"
      },
      {
        to: "/dashboard/manageFollowUp",
        icon: <IoIosPersonAdd className="w-5 h-5" />,
        label: "Manage FollowUp",
        color: "text-indigo-600"
      },
      {
        to: "/dashboard/manageTicket",
        icon: <MdAttribution className="w-5 h-5" />,
        label: "Manage Ticket",
        color: "text-red-600"
      },
      {
        to: "/dashboard/activityLog",
        icon: <MdFindInPage className="w-5 h-5" />,
        label: "Activity Log",
        color: "text-teal-600"
      }
    ] : []),
    // Employee items
    ...(isExecutive ? [
      {
        to: "/dashboard/mytask",
        icon: <MdTaskAlt className="w-5 h-5" />,
        label: "My Task",
        color: "text-green-600"
      },
      {
        to: "/dashboard/addalead",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "Add a Lead",
        color: "text-blue-600"
      },
      {
        to: "/dashboard/mylead",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "My Added Lead",
        color: "text-purple-600"
      },
      {
        to: "/dashboard/addFollowUp",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "Add Followup",
        color: "text-orange-600"
      },
      {
        to: "/dashboard/myfollowUps",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "My Followup",
        color: "text-indigo-600"
      },
      {
        to: "/dashboard/addraiseticket",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "Raise Ticket",
        color: "text-red-600"
      },
      {
        to: "/dashboard/myaddedticket",
        icon: <MdOutlineBrowserUpdated className="w-5 h-5" />,
        label: "My Added Ticket",
        color: "text-teal-600"
      },
      {
        to: "/dashboard/addreview",
        icon: <RiSecurePaymentLine className="w-5 h-5" />,
        label: "Add Review",
        color: "text-amber-600"
      }
    ] : []),
    // Common items
    {
      to: "/dashboard/myprofile",
      icon: <FaUser className="w-5 h-5" />,
      label: "My Profile",
      color: "text-gray-600"
    },
    {
      to: "/",
      icon: <IoHomeSharp className="w-5 h-5" />,
      label: "Home",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white shadow-xl z-40 transition-all duration-300 ease-in-out">
        <div className={`flex items-center justify-between h-full pr-4 transition-all duration-300 ease-in-out`}>
          {/* Left side */}
          <div className={`flex items-center space-x-4 pl-4 ${isSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'} transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'}`}>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-custom hover:bg-gray-800 md:hidden text-white"
            >
              <FaBars className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-custom flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  PerformaSuite
                </h1>
                <p className="text-xs text-gray-400">CRM System</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-custom hover:bg-gray-800 relative text-white">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-custom hover:bg-gray-800 text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-white">
                  {isAdmin ? 'Admin' : isExecutive ? 'Executive' : 'User'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-16 bottom-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 w-64 md:w-auto transition-transform duration-300 ease-in-out z-30`}>
        <div className={`h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-800">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {isAdmin ? 'Admin Panel' : isExecutive ? 'Executive Panel' : 'User Panel'}
                  </h2>
                  <p className="text-sm text-gray-400">Dashboard</p>
                </div>
              )}
              <button
                onClick={toggleSidebarCollapse}
                className="p-1 rounded-custom hover:bg-gray-700 hidden md:block"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-white" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-custom hover:bg-gray-50 transition-colors group"
              >
                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-custom hover:bg-red-50 transition-colors w-full group"
            >
              <FaSignOutAlt className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium text-red-600">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 pt-16 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <div className="">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Dashboard; 