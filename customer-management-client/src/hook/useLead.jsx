import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

const useLead = () => {


    const fetchUsers = async () => {
        const response = await axios.get(`http://localhost:3000/manageLead`, { withCredentials: true });
        return response.data;
      };

      
    const { data: lead = [], isLoading:leadLoading } = useQuery({
        queryKey: ["lead"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
      });
  return [lead,leadLoading]
}

export default useLead