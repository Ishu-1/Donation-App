"use client";
import React, { useEffect, useState } from "react";

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    peopleHelped: 0,
    ngosCollaborated: 0,
    productsdonated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recipients, setRecipients] = useState({});
  const [products, setProducts] = useState({});

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/donations/getAllDonations");
      const data = await response.json();

      if (data.donations) {
        const completedDonations = data.donations.filter(
          (donation) => donation.status === "COMPLETED"
        );
        setDonations(completedDonations);

        await processStatistics(completedDonations);
        await processDetailedDonations(completedDonations);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processStatistics = async (completedDonations) => {
    const uniqueReceivers = new Set();
    const uniqueNGOs = new Set();
    let totalProducts = 0;
  
    const receiverIds = Array.from(new Set(completedDonations.map(d => d.receiverId)));
  
    // Fetch receiver details once
    const receiverData = await fetchAllReceivers(receiverIds);
  
    completedDonations.forEach((donation) => {
      const details = parseDonationDetails(donation.details);
      details.forEach((item) => {
        const qty = parseInt(item.quantity, 10);
        totalProducts += isNaN(qty) ? 1 : qty;
      });
  
      const receiver = receiverData[donation.receiverId];
      if (receiver) {
        uniqueReceivers.add(receiver.id);
        if (receiver.type === "NGO") {
          uniqueNGOs.add(receiver.id);
        }
      }
    });
  
    setStats({
      peopleHelped: uniqueReceivers.size,
      ngosCollaborated: uniqueNGOs.size,
      productsdonated: totalProducts,
    });
  };
  
  

  const fetchAllReceivers = async (receiverIds) => {
    const receiverData = {};

    for (const id of receiverIds) {
      try {
        const response = await fetch(`/api/ngo/fetchparticularNGO?id=${id}`);
        const data = await response.json();
        if (data.receiver) {
          receiverData[id] = data.receiver;
        }
      } catch (err) {
        console.error(`Error fetching receiver ${id}:`, err);
      }
    }

    setRecipients(receiverData);
    return receiverData;
  };

  const processDetailedDonations = async (completedDonations) => {
    const productIds = new Set();

    completedDonations.forEach((donation) => {
      const details = parseDonationDetails(donation.details);
      details.forEach((detail) => {
        if (detail.productId) {
          productIds.add(detail.productId);
        }
      });
    });

    await fetchAllProducts(Array.from(productIds));
  };

  const fetchAllProducts = async (productIds) => {
    const productData = {};

    for (const id of productIds) {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (data) {
          productData[id] = data;
        }
      } catch (err) {
        console.error(`Error fetching product ${id}:`, err);
      }
    }

    setProducts(productData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRecipientInfo = (recipientId) => {
    const recipient = recipients[recipientId];
    return {
      name: recipient?.name || "[Recipient Name]",
      type: recipient?.type || "[Receiver Type]",
    };
  };

  const getProductInfo = (productId) => {
    const product = products[productId];
    return {
      name: product?.name || "[Product Name]",
      category: product?.category || "[Category]",
    };
  };

  const parseDonationDetails = (details) => {
    if (!Array.isArray(details)) {
      try {
        if (typeof details === "string") {
          return JSON.parse(details);
        }
        return [];
      } catch (e) {
        console.error("Error parsing donation details:", e);
        return [];
      }
    }
    return details;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-3xl text-center font-serif text-slate-700 mb-12">
        Your contributions
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="border border-gray-200 rounded p-8 flex flex-col items-center justify-center bg-white">
          <p className="text-3xl font-serif text-slate-700 mb-2">
            {isLoading ? "..." : stats.peopleHelped}
          </p>
          <p className="text-slate-600 text-sm">People helped</p>
        </div>

        <div className="border border-gray-200 rounded p-8 flex flex-col items-center justify-center bg-white">
          <p className="text-3xl font-serif text-slate-700 mb-2">
            {isLoading ? "..." : stats.ngosCollaborated}
          </p>
          <p className="text-slate-600 text-sm">NGOs collaborated with</p>
        </div>

        <div className="border border-gray-200 rounded p-8 flex flex-col items-center justify-center bg-white">
          <p className="text-3xl font-serif text-slate-700 mb-2">
            {isLoading ? "..." : stats.productsdonated}
          </p>
          <p className="text-slate-600 text-sm">Products donated</p>
        </div>
      </div>

      {/* Donated Products */}
      <h2 className="text-2xl text-center font-serif text-slate-700 mb-8">
        Donated Products
      </h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-4 py-3 text-left">Date of donation</th>
              <th className="px-4 py-3 text-left">Receiver ID</th>
              <th className="px-4 py-3 text-left">Recipient Name</th>
              <th className="px-4 py-3 text-left">Receiver Type</th>
              <th className="px-4 py-3 text-left">Product Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 bg-gray-200">
                  Loading...
                </td>
              </tr>
            ) : donations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 bg-gray-200">
                  No completed donations found
                </td>
              </tr>
            ) : (
              donations.flatMap((donation, donationIndex) => {
                const parsedDetails = parseDonationDetails(donation.details);
                const recipientInfo = getRecipientInfo(donation.receiverId);

                return parsedDetails.map((detail, detailIndex) => {
                  const productInfo = getProductInfo(detail.productId);
                  const rowClass =
                    (donationIndex + detailIndex) % 2 === 0
                      ? "bg-slate-200"
                      : "bg-slate-300";

                  return (
                    <tr key={`${donation.id}-${detailIndex}`} className={rowClass}>
                      <td className="px-4 py-3">{formatDate(donation.createdAt)}</td>
                      <td className="px-4 py-3">
                        {donation.receiverId?.substring(0, 6) || "—"}
                      </td>
                      <td className="px-4 py-3">{recipientInfo.name}</td>
                      <td className="px-4 py-3">{recipientInfo.type}</td>
                      <td className="px-4 py-3">{productInfo.name}</td>
                      <td className="px-4 py-3">{productInfo.category}</td>
                      <td className="px-4 py-3">{detail.quantity || 1}</td>
                    </tr>
                  );
                });
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
