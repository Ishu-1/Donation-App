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
      setRequests(res.data.donations);
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        Unlisted Donation Requests
      </h1>

      {loading ? (
        <div className="flex justify-center items-center text-gray-500 text-lg">
          <Loader2 className="animate-spin mr-2" /> Loading unlisted requests...
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No unlisted requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition-all"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Request #{req.id.slice(0, 6)}...
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      req.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Created: {new Date(req.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Receiver ID: {req.receiverId.slice(0, 10)}...
                </p>
              </div>

              <div className="mb-4">
                <p className="font-medium text-sm text-gray-700 mb-1">
                  Requested Products:
                </p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                  {req.details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-gray-700"
                    >
                      <span className="font-medium">
                        Product ID: {item.productId.slice(0, 8)}...
                      </span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {req.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() =>
                      acceptRequest(req.id, 'DELIVERED_AT_PLACE')
                    }
                    className="w-full py-2 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                  >
                    Accept - Deliver
                  </button>
                  <button
                    onClick={() => acceptRequest(req.id, 'TAKEAWAY')}
                    className="w-full py-2 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Accept - Takeaway
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
