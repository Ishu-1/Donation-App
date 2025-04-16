"use client";
import React, { useEffect, useState } from "react";

export default function BeneficiaryDashboard() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    mostHelpfulDonor: "...",
    uniqueDonors: 0,
  });
  const [donors, setDonors] = useState({});
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonationsReceived();
  }, []);

  const fetchDonationsReceived = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ngo/getAllDonor");
      
      // Log the response to check what we get
      const textData = await response.text(); // Read the response as text first
      console.log("Response from /api/ngo/getAllDonor:", textData);
      
      const data = JSON.parse(textData); // Now parse it as JSON
      if (data.donations) {
        const sorted = data.donations
          .filter((d) => d.status === "COMPLETED")
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
        setDonations(sorted);
        await fetchAllDonorsAndProducts(sorted);
        calculateStats(sorted);
      }
    } catch (err) {
      console.error("Error fetching donations received:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAllDonorsAndProducts = async (donations) => {
    try {
      const donorMap = donations.reduce((acc, donation) => {
        if (donation.donor) {
          acc[donation.donor.id] = {
            id: donation.donor.id,
            name: `${donation.donor.firstName} ${donation.donor.lastName}`,
          };
        }
        return acc;
      }, {});
      setDonors(donorMap);
  
      // Since each donation's `details` already contains full product info, build product map
      const productMap = {};
      donations.forEach((donation) => {
        donation.details.forEach((detail) => {
          const product = detail.product;
          if (product && product.id) {
            productMap[product.id] = product;
          }
        });
      });
      setProducts(productMap);
    } catch (err) {
      console.error("Error setting donor/product data:", err);
    }
  };
  
  

  // Calculate stats based on donations and donor data
  const calculateStats = (donations) => {
    const donorCount = {}
    let maxDonorCount=0,mostHelpfulDonorId="",maxDonorName="None";
    donations.forEach((donation) => {
      const donorId = donation.donorId;
      if (!donorCount[donorId]) {
        donorCount[donorId] = 0;
      }
      const details = parseDonationDetails(donation.details);
      donorCount[donorId] += details.length;
      if(donorCount[donorId]>maxDonorCount){
        maxDonorCount=donorCount[donorId];
        mostHelpfulDonorId=donorId;
        maxDonorName=donation.donor.firstName+" "+donation.donor.lastName;
      }
    });

    // const mostHelpfulDonorId = Object.entries(donorCount).sort(
    //   (a, b) => b[1] - a[1]
    // )[0]?.[0];
    const mostHelpfulDonorName = maxDonorName;
    // ? `${donorName[mostHelpfulDonorId]}`
    // : mostHelpfulDonorId ? mostHelpfulDonorId.slice(0, 8) : "N/A";

  setStats({
    totalDonations: donations.length,
    mostHelpfulDonor: mostHelpfulDonorName, // Update to full name
    uniqueDonors: Object.keys(donorCount).length,
  });
  };

  const parseDonationDetails = (details) => {
    return Array.isArray(details) ? details : [];
  };
  

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getProduct = (id) => products[id] || {};
  const getDonor = (id) => donors[id] || {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-3xl text-center font-serif text-slate-700 mb-12">
        Your Received Donations
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-4xl font-bold text-slate-800">
            {isLoading ? "..." : stats.totalDonations}
          </p>
          <p className="text-slate-600 mt-2">Donations received</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-xl font-medium text-slate-700">
            {isLoading ? "..." : stats.mostHelpfulDonor}
          </p>
          <p className="text-slate-600 mt-2">Most helpful donor</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-4xl font-bold text-slate-800">
            {isLoading ? "..." : stats.uniqueDonors}
          </p>
          <p className="text-slate-600 mt-2">Donors contributed</p>
        </div>
      </div>

      {/* Table Section */}
      <h2 className="text-2xl font-serif text-center text-slate-700 mb-8">
        Donations Received
      </h2>
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
        <table className="min-w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-700 text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Donor Name</th>
              <th className="px-6 py-4">Donor ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : donations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No donations received yet.
                </td>
              </tr>
            ) : (
              donations.flatMap((donation) => {
                const donor = getDonor(donation.donorId);
                return parseDonationDetails(donation.details).map((detail, idx) => {
                  const product = getProduct(detail.productId);
                  return (
                    <tr
                      key={`${donation.id}-${idx}`}
                      className={idx % 2 === 0 ? "bg-slate-50" : "bg-slate-100"}
                    >
                      <td className="px-6 py-4">{formatDate(donation.createdAt)}</td>
                      <td className="px-6 py-4">{detail.product?.name || "[Product]"}</td>
                      <td className="px-6 py-4">{detail.product?.id?.slice(0, 8) || "—"}</td>
                      <td className="px-6 py-4">{detail.quantity || 1}</td>
                      <td className="px-6 py-4">{donor.name || "[Donor]"}</td>
                      <td className="px-6 py-4">{donation.donorId?.slice(0, 8) || "—"}</td>
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
