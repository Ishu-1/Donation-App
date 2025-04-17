'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UnlistedRequests() {
  const [requests, setRequests] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [receiverNames, setReceiverNames] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProduct = async (productId) => {
    try {
      const res = await axios.get(`/api/products/${productId}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return { name: 'Unknown', image: null };
    }
  };

  const fetchReceiverName = async (receiverId) => {
    try {
      const res = await axios.get(`/api/ngo/fetchparticularNGO?id=${receiverId}`);
      return res.data.receiver?.name || 'Unknown Receiver';
    } catch (err) {
      console.error(`Error fetching receiver ${receiverId}:`, err);
      return 'Unknown Receiver';
    }
  };

  const fetchAllProductDetails = async (data) => {
    const ids = new Set();
    data.forEach((d) => d.details.forEach((item) => ids.add(item.productId)));
    const map = {};

    await Promise.all([...ids].map(async (id) => {
      const product = await fetchProduct(id);
      map[id] = product;
    }));

    setProductDetails(map);
  };

  const fetchAllReceiverNames = async (data) => {
    const ids = new Set(data.map((d) => d.receiverId));
    const map = {};

    await Promise.all([...ids].map(async (id) => {
      const name = await fetchReceiverName(id);
      map[id] = name;
    }));

    setReceiverNames(map);
  };

  const fetchUnlisted = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/requestFromNgo/getAllRequest');
      const data = res.data.donations || [];
      setRequests(data);
      await fetchAllProductDetails(data);
      await fetchAllReceiverNames(data);
    } catch (err) {
      console.error('Error fetching unlisted requests:', err);
      toast.error('Failed to load unlisted requests');
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
      toast.success('Request accepted successfully!');
      fetchUnlisted();
    } catch (err) {
      console.error('Error accepting request:', err);
      toast.error('Failed to accept request');
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
          <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
          <table className="min-w-full text-sm text-left text-slate-700 border border-slate-300 bg-white">
  <thead className="bg-slate-700 text-white text-xs uppercase tracking-wider">
    <tr>
      <th className="px-6 py-4">Status</th>
      <th className="px-6 py-4">Product Name</th>
      <th className="px-6 py-4 text-center">Quantity</th>
      <th className="px-6 py-4">Delivery Type</th>
      <th className="px-6 py-4">Receiver</th>
      <th className="px-6 py-4">Created At</th>
      <th className="px-6 py-4 text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-200">
    {requests.map((req, idx) => {
      const totalQty = req.details.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const isEven = idx % 2 === 0;
      return (
        <tr
          key={req.id}
          className={isEven ? 'bg-slate-50' : 'bg-slate-100'}
        >
          <td className="px-6 py-4 font-medium">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
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
          <td className="px-6 py-4">
            <ul className="list-none space-y-1 text-sm">
              {req.details.map((item, i) => {
                const detail = productDetails[item.productId];
                return (
                  <li key={i} className="flex items-center gap-2">
                    <span>{detail?.name || 'Loading...'}</span>
                  </li>
                );
              })}
            </ul>
          </td>
          <td className="px-6 py-4 text-center">{totalQty}</td>
          <td className="px-6 py-4">
            {req.deliveryType || 'Not chosen yet'}
          </td>
          <td className="px-6 py-4">
            {receiverNames[req.receiverId] || 'Loading...'}
          </td>
          <td className="px-6 py-4">
            {new Date(req.createdAt).toLocaleString()}
          </td>
          <td className="px-6 py-4 text-center space-y-2">
            {req.status === 'PENDING' ? (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => acceptRequest(req.id, 'DELIVERED_AT_PLACE')}
                  className="text-sm px-3 py-1 rounded text-white bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  Deliver
                </button>
                <br />
                <button
                  onClick={() => acceptRequest(req.id, 'TAKEAWAY')}
                  className="text-sm px-3 py-1 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Takeaway
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-600 italic">No action</span>
            )}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
</div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
