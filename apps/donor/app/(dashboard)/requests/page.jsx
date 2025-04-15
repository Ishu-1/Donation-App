'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

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

    const pageTransition = {
        initial: { opacity: 0, y: -40 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } },
        exit: { opacity: 0, y: 30, transition: { duration: 0.3 } }
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 120, damping: 14 }
        },
        exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            className="min-h-screen bg-slate-50"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
        >
            <div className="max-w-7xl mx-auto py-8 px-4">
                <motion.h1
                    className="text-4xl font-medium text-center text-slate-700 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Requests Overview
                </motion.h1>

                {loading ? (
                    <motion.div
                        className="flex justify-center items-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader2 className="animate-spin mr-2" /> Loading donations...
                    </motion.div>
                ) : donations.length === 0 ? (
                    <motion.p
                        className="text-center text-slate-500 text-lg py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        No donations found.
                    </motion.p>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden rounded-lg shadow-xl"
                    >
                        <table className="w-full bg-white border border-slate-300">
                            <thead>
                                <tr className="bg-slate-700 text-white text-sm">
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Product Name(s)</th>
                                    <th className="p-3 text-center">Quantity</th>
                                    <th className="p-3 text-left">Delivery Type</th>
                                    <th className="p-3 text-left">Receiver</th>
                                    <th className="p-3 text-left">Created At</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <motion.tbody variants={tableVariants} initial="hidden" animate="show">
                                <AnimatePresence>
                                    {donations.map((donation, idx) => {
                                        const isStockOk = donation.stockStatus === 'OK';
                                        return (
                                            <motion.tr
                                                key={donation.id}
                                                variants={rowVariants}
                                                className={idx % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}
                                                whileHover={{
                                                    scale: 1.01,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <td className="p-3 font-medium">
                                                    <motion.span
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 12 }}
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            donation.stockStatus === 'OUT_OF_STOCK'
                                                                ? 'bg-red-100 text-red-700'
                                                                : donation.status === 'COMPLETED'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        {donation.status}
                                                    </motion.span>
                                                </td>

                                                <td className="p-3">
                                                    <ul className="list-disc list-inside text-sm">
                                                        {donation.details.map((item, i) => (
                                                            <motion.li
                                                                key={i}
                                                                initial={{ x: -10, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: 0.05 * i, duration: 0.3 }}
                                                            >
                                                                {productNames[item.productId] || 'Loading...'}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                    >
                                                        {donation.details.reduce((sum, item) => sum + item.quantity, 0)}
                                                    </motion.span>
                                                </td>
                                                <td className="p-3">{donation.deliveryType || 'Not chosen yet'}</td>
                                                <td className="p-3">{receiverNames[donation.receiverId] || 'Loading...'}</td>
                                                <td className="p-3">{new Date(donation.createdAt).toLocaleString()}</td>
                                                <td className="p-3 text-center space-y-2">
                                                    {donation.status === 'PENDING' ? (
                                                        <>
                                                            <motion.button
                                                                onClick={() =>
                                                                    acceptRequest(donation.id, 'DELIVERED_AT_PLACE')
                                                                }
                                                                disabled={!isStockOk}
                                                                whileHover={isStockOk ? {
                                                                    scale: 1.05,
                                                                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                                                                } : {}}
                                                                whileTap={isStockOk ? { scale: 0.95 } : {}}
                                                                className={`text-xs px-3 py-1 rounded transition text-white ${
                                                                    isStockOk
                                                                        ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                                                                        : 'bg-gray-400 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                Accept - Deliver
                                                            </motion.button>
                                                            <br />
                                                            <motion.button
                                                                onClick={() => acceptRequest(donation.id, 'TAKEAWAY')}
                                                                disabled={!isStockOk}
                                                                whileHover={isStockOk ? {
                                                                    scale: 1.05,
                                                                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)"
                                                                } : {}}
                                                                whileTap={isStockOk ? { scale: 0.95 } : {}}
                                                                className={`text-xs px-3 py-1 rounded transition text-white ${
                                                                    isStockOk
                                                                        ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                                                        : 'bg-gray-400 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                Accept - Takeaway
                                                            </motion.button>
                                                        </>
                                                    ) : (
                                                        <motion.span
                                                            className="text-sm text-gray-600 italic"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                        >
                                                            No action
                                                        </motion.span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.tbody>
                        </table>
                    </motion.div>
                )}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                transition={Slide}
                closeOnClick
                pauseOnHover
                draggable
                newestOnTop
                toastClassName="rounded-md shadow-md bg-white text-slate-800 text-sm p-3"
            />
        </motion.div>
    );
}
