'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function UnlistedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnlisted = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/requestFromNgo/getAllRequest');
      setRequests(res.data.donations || []);
    } catch (err) {
      console.error('Error fetching unlisted requests:', err);
      alert('Failed to load unlisted requests');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (donationId, deliveryType) => {
    try {
      await axios.put('/api/requestFromNgo/updateRequest', {
        donationId,
        deliveryType,
      });
      alert('Request accepted successfully!');
      fetchUnlisted();
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Failed to accept request');
    }
  };

  useEffect(() => {
    fetchUnlisted();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-medium text-center text-slate-700 mb-10">
          Unlisted Donation Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading unlisted requests...
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-500 text-lg py-20">
            No unlisted requests found.
          </p>
        ) : (
          <table className="w-full bg-white border border-slate-300">
            <thead>
              <tr className="bg-slate-700 text-white text-sm">
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Product ID(s)</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-left">Delivery Type</th>
                <th className="p-3 text-left">Receiver ID</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => {
                const totalQty = req.details.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <tr
                    key={req.id}
                    className={idx % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}
                  >
                    <td className="p-3 font-medium">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <ul className="list-disc list-inside text-sm">
                        {req.details.map((item, i) => (
                          <li key={i}>{item.productId.slice(0, 8)}...</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-center">{totalQty}</td>
                    <td className="p-3">{req.deliveryType || 'Not chosen yet'}</td>
                    <td className="p-3">{req.receiverId.slice(0, 10)}...</td>
                    <td className="p-3">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-3 text-center space-y-2">
                      {req.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => acceptRequest(req.id, 'DELIVERED_AT_PLACE')}
                            className="text-xs px-3 py-1 rounded text-white bg-emerald-600 hover:bg-emerald-700 transition"
                          >
                            Accept - Deliver
                          </button>
                          <br />
                          <button
                            onClick={() => acceptRequest(req.id, 'TAKEAWAY')}
                            className="text-xs px-3 py-1 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition"
                          >
                            Accept - Takeaway
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-600 italic">No action</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
