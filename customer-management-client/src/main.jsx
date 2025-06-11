import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Registered from './pages/Registered.jsx';
import MainLayout from './layout/MainLayout.jsx';
import AuthProvider from './provider/AuthProvider.jsx';
import Dashboard from './layout/Dashboard.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MyProfile from './routes/MyProfile.jsx';

import UpdateProfile from './component/UpdateProfile.jsx';

import PrivateRoute from './routes/PrivateRoute.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import EmployeeRoute from './routes/EmployeeRoute.jsx';

import ManageTask from './routes/ManageTask.jsx';
import ContactUs from './component/ContactUs.jsx';
import AboutUs from './component/AboutUs.jsx';
import DashboardHome from './routes/DashboardHome.jsx';
import AdminDashboard from './routes/AdminDashboard.jsx';

import EmployeesReviews from './component/EmployeesReviews.jsx';
import ErrorPage from './component/ErrorPage.jsx';
import Loading from './component/loading.jsx';

import AddTaskExecutives from './routes/AddTaskExecutives.jsx';
import UpdateTask from './routes/UpdateTask.jsx';
import MyTask from './routes/MyTask.jsx';
import AddaLead from './routes/AddaLead.jsx';
import MyAddedLead from './routes/MyAddedLead.jsx';
import AddFollowUp from './routes/AddFollowUp.jsx';
import MyFollowUp from './routes/MyFollowUp.jsx';
import RaiseTicket from './routes/RaiseTicket.jsx';
import MyAddedTicket from './routes/MyAddedTicket.jsx';
import ManageLead from './routes/ManageLead.jsx';
import ManageFollowUp from './routes/ManageFollowUp.jsx';
import ManageTicket from './routes/ManageTicket.jsx';
import ActivityLog from './routes/ActivityLog.jsx';
import AddReview from './routes/AddReview.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    errorElement:<ErrorPage></ErrorPage>,
    element: <MainLayout></MainLayout>,
    children:[
      {
        path:"/",
        element:<Home></Home>
      },
      {
        path:"/contactus",
        element:<ContactUs></ContactUs>
      },
      {
        path:"/aboutus",
        element:<AboutUs></AboutUs>
      },
      {
        path:"/reviews",
        element:<EmployeesReviews></EmployeesReviews>
      },
      {
        path:"/login",
        element:<Login></Login>
      },
      {
        path:"/register",
        element:<Registered></Registered>
      }
    ]
  },
  {
    path:"/dashboard",
    errorElement: <ErrorPage />,
    element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children:[

      {
        path:"/dashboard",
        element:<DashboardHome></DashboardHome>
      },
      {
        path:"/dashboard/admin-dashboard",
        element:<AdminRoutes><AdminDashboard></AdminDashboard></AdminRoutes>
      },
      {
        path:"/dashboard/addtask",
        element:<AdminRoutes><AddTaskExecutives></AddTaskExecutives></AdminRoutes>

      },
      {
        path:"/dashboard/managetask",
        element:<AdminRoutes><ManageTask></ManageTask></AdminRoutes>
      },
      {
        path:"/dashboard/updateTask/:id",
        element:<AdminRoutes><UpdateTask></UpdateTask></AdminRoutes>
      },
       {
        path:"/dashboard/manageLead",
        element:<AdminRoutes><ManageLead></ManageLead></AdminRoutes>
      },
      {
        path:"/dashboard/manageFollowUp",
        element:<AdminRoutes><ManageFollowUp></ManageFollowUp></AdminRoutes>
      },
      {
        path:"/dashboard/manageTicket",
        element:<AdminRoutes><ManageTicket></ManageTicket></AdminRoutes>
      },
      {
        path:"/dashboard/activityLog",
        element:<AdminRoutes><ActivityLog></ActivityLog></AdminRoutes>
      },
      {
        path:"/dashboard/mytask",
        element:<EmployeeRoute><MyTask></MyTask></EmployeeRoute>

      },
      {
        path:"/dashboard/addalead",
        element:<EmployeeRoute><AddaLead></AddaLead></EmployeeRoute>

      },
      {
        path:"/dashboard/mylead",
        element:<EmployeeRoute><MyAddedLead></MyAddedLead></EmployeeRoute>

      },
      {
        path:"/dashboard/addFollowUp",
        element:<EmployeeRoute><AddFollowUp></AddFollowUp></EmployeeRoute>

      },
      {
        path:"/dashboard/myfollowUps",
        element:<EmployeeRoute><MyFollowUp></MyFollowUp></EmployeeRoute>

      },
      {
        path:"/dashboard/addraiseticket",
        element:<EmployeeRoute><RaiseTicket></RaiseTicket></EmployeeRoute>

      },
      {
        path:"/dashboard/myaddedticket",
        element:<EmployeeRoute><MyAddedTicket></MyAddedTicket></EmployeeRoute>

      },
      {
        path:"/dashboard/addreview",
        element:<EmployeeRoute><AddReview></AddReview></EmployeeRoute>

      },
      
      
      
      
     
      {
        path:"/dashboard/myprofile",
        element:<MyProfile></MyProfile>
      },
      {

        path:"/dashboard/updateprofile",
        element:<UpdateProfile></UpdateProfile>

      },
     
    
     
     
    
      
     
  
      
    ]
  }
]);

const queryClient = new QueryClient();


const RootApp=()=>{

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);






  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer />
        {loading ? (
         <Loading></Loading>
        ) : (
          <RouterProvider router={router} />
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
};



createRoot(document.getElementById('root')).render(
  
    <RootApp></RootApp>
)
