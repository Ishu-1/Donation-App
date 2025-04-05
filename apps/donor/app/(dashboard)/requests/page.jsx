'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function PendingRequests() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/donations/getAllDonations');
      setDonations(res.data.donations);
    } catch (err) {
      console.error('Error fetching donations:', err);
      alert('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (donationId, deliveryType) => {
    try {
      await axios.put('/api/donations/changestatus', {
        donationId,
        deliveryType,
      });
      alert('Donation accepted successfully!');
      fetchDonations();
    } catch (err) {
      console.error('Error accepting donation:', err);
      alert('Failed to accept donation');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
        Pending Donation Requests
      </h1>

      {loading ? (
        <div className="flex justify-center items-center text-gray-500 text-lg">
          <Loader2 className="animate-spin mr-2" /> Loading donations...
        </div>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No donations found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          {donations.map((donation) => {
            const isStockOk = donation.stockStatus === 'OK';
            const isPending = donation.status === 'PENDING';

            return (
              <div
                key={donation.id}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Donation #{donation.id.slice(0, 8)}...
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created on: {new Date(donation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      donation.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : donation.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>

                {/* Donation Info */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-medium">Stock Status:</span>{' '}
                    <span
                      className={`font-semibold ${
                        isStockOk ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {donation.stockStatus}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Request Type:</span>{' '}
                    {donation.deliveryType || 'Not chosen yet'}
                  </p>
                </div>

                {/* Product List */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Products Requested:</p>
                  <ul className="space-y-2 text-sm">
                    {donation.details.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-gray-800"
                      >
                        <span>• Product ID: {item.productId.slice(0, 8)}...</span>
                        <span className="font-medium">Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                {isPending && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() =>
                        acceptRequest(donation.id, 'DELIVERED_AT_PLACE')
                      }
                      disabled={!isStockOk}
                      className={`py-2 rounded-xl font-medium text-white transition ${
                        isStockOk
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Accept - Deliver
                    </button>
                    <button
                      onClick={() => acceptRequest(donation.id, 'TAKEAWAY')}
                      disabled={!isStockOk}
                      className={`py-2 rounded-xl font-medium text-white transition ${
                        isStockOk
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Accept - Takeaway
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
