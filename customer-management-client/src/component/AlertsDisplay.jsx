import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Context } from '../provider/AuthProvider';
import { Bell, XCircle } from 'lucide-react';

const fetchAlerts = async (email) => {
  if (!email) return [];
  const response = await axios.get(`http://localhost:3000/api/alerts/${email}`, { withCredentials: true });
  return response.data;
};

const AlertsDisplay = () => {
  const { user } = useContext(Context);
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading, isError } = useQuery({
    queryKey: ["userAlerts", user?.email],
    queryFn: () => fetchAlerts(user.email),
    enabled: !!user?.email, // Only run if user email is available
    refetchInterval: 60000, // Refetch every minute for new alerts
  });

  const markAsReadMutation = useMutation({
    mutationFn: (alertId) => {
      return axios.patch(`http://localhost:3000/api/alerts/mark-read/${alertId}`, {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userAlerts", user?.email]); // Invalidate to refetch alerts
    },
  });

  const handleMarkAsRead = (alertId) => {
    markAsReadMutation.mutate(alertId);
  };

  if (isLoading) {
    return <div>Loading alerts...</div>;
  }

  if (isError) {
    return <div>Error loading alerts.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-yellow-500" /> Your Alerts ({alerts.length})
      </h2>
      {alerts.length === 0 ? (
        <p className="text-gray-600">No new alerts.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="p-3 border border-yellow-200 rounded-md bg-yellow-50 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-yellow-800">{alert.type}</p>
                <p className="text-sm text-gray-700">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleMarkAsRead(alert._id)}
                className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                title="Mark as read"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsDisplay; 