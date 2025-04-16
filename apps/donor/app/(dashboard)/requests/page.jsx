'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingRequests() {
    const [donations, setDonations] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [receiverNames, setReceiverNames] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProductName = async (productId) => {
        try {
            const res = await axios.get(`/api/products/${productId}`);
            return res.data.name;
        } catch (err) {
            console.error(`Failed to fetch product ${productId}`, err);
            return 'Unknown Product';
        }
    };

    const fetchReceiverName = async (receiverId) => {
        try {
            const res = await axios.get(`/api/ngo/fetchparticularNGO?id=${receiverId}`);
            return res.data.receiver?.name || 'Unknown Receiver';
        } catch (err) {
            console.error(`Failed to fetch receiver ${receiverId}`, err);
            return 'Unknown Receiver';
        }
    };

    const fetchAllProductNames = async (donationsData) => {
        const uniqueProductIds = new Set();
        donationsData.forEach((donation) => {
            donation.details.forEach((item) => uniqueProductIds.add(item.productId));
        });

        const productNameMap = {};
        await Promise.all(
            Array.from(uniqueProductIds).map(async (productId) => {
                const name = await fetchProductName(productId);
                productNameMap[productId] = name;
            })
        );

        setProductNames(productNameMap);
    };

    const fetchAllReceiverNames = async (donationsData) => {
        const uniqueReceiverIds = new Set(donationsData.map((d) => d.receiverId));
        const receiverMap = {};
        await Promise.all(
            Array.from(uniqueReceiverIds).map(async (id) => {
                const name = await fetchReceiverName(id);
                receiverMap[id] = name;
            })
        );
        setReceiverNames(receiverMap);
    };

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/donations/getAllDonations');
            const data = res.data.donations || [];
            setDonations(data);
            await fetchAllProductNames(data);
            await fetchAllReceiverNames(data);
        } catch (err) {
            console.error('Error fetching donations:', err);
            toast.error('Failed to load donations');
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
            toast.success('Donation accepted successfully!');
            fetchDonations();
        } catch (err) {
            console.error('Error accepting donation:', err);
            toast.error('Failed to accept donation');
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-4xl font-medium text-center text-slate-700 mb-10">
                    Requests Overview
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin mr-2" /> Loading donations...
                    </div>
                ) : donations.length === 0 ? (
                    <p className="text-center text-slate-500 text-lg py-20">No donations found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
                        <table className="min-w-full text-sm text-left text-slate-700">
                            <thead className="bg-slate-700 text-white text-xs uppercase tracking-wider">
                                <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Delivery Type</th>
                                <th className="px-6 py-4">Receiver</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {donations.map((donation, idx) => {
                                const isStockOk = donation.stockStatus === 'OK';

                                return donation.status === 'PENDING' ? (
                                    <tr
                                    key={donation.id}
                                    className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'}
                                    >
                                    <td className="px-6 py-4 font-medium">
                                        <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                            donation.stockStatus === 'OUT_OF_STOCK'
                                            ? 'bg-red-100 text-red-700'
                                            : donation.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                        >
                                        {donation.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside text-sm">
                                        {donation.details.map((item, i) => (
                                            <li key={i}>
                                            {productNames[item.productId] || 'Loading...'}
                                            </li>
                                        ))}
                                        </ul>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {donation.details.reduce((sum, item) => sum + item.quantity, 0)}
                                    </td>

                                    <td className="px-6 py-4">{donation.deliveryType || 'Not chosen yet'}</td>
                                    <td className="px-6 py-4">{receiverNames[donation.receiverId] || 'Loading...'}</td>
                                    <td className="px-6 py-4">{new Date(donation.createdAt).toLocaleString()}</td>

                                    <td className="px-6 py-4 text-center">
                                        {donation.status === 'PENDING' ? (
                                        <div className="flex gap-2 justify-center">
                                            <button
                                            onClick={() =>
                                                acceptRequest(donation.id, 'DELIVERED_AT_PLACE')
                                            }
                                            disabled={!isStockOk}
                                            className={`text-sm px-3 py-1 rounded transition text-white ${
                                                isStockOk
                                                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                            >
                                            Deliver
                                            </button>
                                            <button
                                            onClick={() => acceptRequest(donation.id, 'TAKEAWAY')}
                                            disabled={!isStockOk}
                                            className={`text-sm px-3 py-1 rounded transition text-white ${
                                                isStockOk
                                                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                            >
                                            Takeaway
                                            </button>
                                        </div>
                                        ) : (
                                        <span className="text-sm text-gray-600 italic">Done</span>
                                        )}
                                    </td>
                                    </tr>
                                ) : null;
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
