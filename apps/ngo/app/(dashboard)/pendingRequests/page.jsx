'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function PendingRequests() {
    const [donations, setDonations] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [productConditions, setProductConditions] = useState({});
    const [productImages, setProductImages] = useState({});
    const [donorNames, setDonorNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [showListed, setShowListed] = useState(true);

    const fetchProductName = async (productId) => {
        try {
            const res = await axios.get(`/api/products/${productId}`);
            console.log('Product Data:', res.data);

            return [res.data.name,res.data.condition,res.data.image];
        } catch {
            return ['Unknown Product', 'Unknown Condition', 'Unknown Image'];;
        }
    };

    const fetchDonorName = async (donorId) => {
        try {
            const res = await axios.get(`/api/donor/${donorId}`);
            const { firstName = '', lastName = '' } = res.data.donor || {};
            return `${firstName} ${lastName}`.trim() || 'Unknown Donor';
        } catch {
            return 'Unknown Donor';
        }
    };

    const fetchAllMetadata = async (donationsData) => {
        const productIds = new Set();
        const donorIds = new Set();

        donationsData.forEach((donation) => {
            donation.details.forEach((item) => productIds.add(item.productId));
            if (donation.donorId) donorIds.add(donation.donorId);
        });

        const nameMap = {};
        const imageMap = {};
        const conditionMap={};
        await Promise.all(
            Array.from(productIds).map(async (id) => {
                const [name,condition,image] = await fetchProductName(id);
                nameMap[id] = name;
                conditionMap[id] = condition;
                imageMap[id] = image;
            })
        );
        setProductNames(nameMap);
        setProductConditions(conditionMap);
        setProductImages(imageMap);

        const donorMap = {};
        await Promise.all(
            Array.from(donorIds).map(async (id) => {
                donorMap[id] = await fetchDonorName(id);
            })
        );
        setDonorNames(donorMap);
    };

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/donation/getAllPending');
            const data = res.data.donations || [];
            setDonations(data);
            await fetchAllMetadata(data);
        } catch (err) {
            console.error('Error loading pending requests', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Filter listed and unlisted based on the donorId
    const listed = donations.filter((d) => d.donorId && d.donorId !== 'all-donor');
    const unlisted = donations.filter((d) => d.donorId === 'all-donor');

    const renderTable = (data, isListed) => (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
            <table className="min-w-full text-sm text-left text-slate-700">
                <thead className="bg-slate-700 text-white text-xs uppercase tracking-wider">
                    <tr>
                        {isListed &&<th className="px-6 py-4">Product Image</th>}
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4">Product ID</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Condition</th>
                        <th className="px-6 py-4">Created At</th>
                        {isListed && <>
                            <th className="px-6 py-4">Donor Name</th>
                            <th className="px-6 py-4">Donor ID</th>
                        </>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.map((donation, idx) =>
                        donation.details.map((item, i) => (
                            <tr key={`${donation.id}-${i}`} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'}>
                                {isListed && <td className="px-6 py-4"><div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        <img
                          src={productImages[item.productId][0] }
                          alt={productNames[item.productId]}
                          className="w-full h-full object-cover"
                        />
                      </div></td>}
                                <td className="px-6 py-4">{productNames[item.productId] || 'Loading...'}</td>
                                <td className="px-6 py-4">{item.productId.slice(0,8)+"..."}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{productConditions[item.productId] || 'Loading...'}</td>
                                <td className="px-6 py-4">{new Date(donation.createdAt).toLocaleString()}</td>
                                {isListed && <>
                                    <td className="px-6 py-4">{donorNames[donation.donorId] || 'Loading...'}</td>
                                    <td className="px-6 py-4">{donation.donorId.slice(0,8)+"..."}</td>
                                </>}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-4xl font-medium text-center text-slate-700 mb-10">
                    Pending Requests
                </h1>

                <div className="flex gap-4 justify-center mb-6">
                    <button
                        onClick={() => setShowListed(true)}
                        className={`w-1/2 text-lg font-semibold py-2 rounded transition ${
                            showListed ? 'bg-slate-700 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }  cursor-pointer`}
                    >
                        Listed Requests
                    </button>
                    <button
                        onClick={() => setShowListed(false)}
                        className={`w-1/2 text-lg font-semibold py-2 rounded transition ${
                            !showListed ? 'bg-slate-700 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }  cursor-pointer`}
                    >
                        Unlisted Requests
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-slate-600">
                        <Loader2 className="animate-spin mr-2" /> Loading...
                    </div>
                ) : (
                    <>
                        {showListed ? renderTable(listed, true) : renderTable(unlisted, false)}
                    </>
                )}
            </div>
        </div>
    );
}
