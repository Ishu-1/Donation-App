"use client";

import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function DonorListPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get("/api/donor/getAllDonors");
        const data = res.data;
        // console.log(data);
        if (data) {
          setDonors(data);
        } else {
          console.error("Failed to fetch donors");
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mb-6"></div>
      <p className="text-slate-600 text-lg">Loading Donors for you...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl text-center font-serif text-slate-700 mb-16">
        Our Kindhearted Donors
      </h1>

      {loading ? (
        renderLoading()
      ) : donors.length === 0 ? (
        <p className="text-center text-slate-500 text-lg">
          No donors found at the moment.
        </p>
      ) : (
        <div className="space-y-10">
          {donors.map((donor, idx) =>
  donor.id === "all-donor" ? null : (
    <div
      key={donor.id}
      className="bg-white shadow-md rounded-2xl px-6 py-6 border border-slate-200 transition hover:shadow-lg"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-serif text-slate-800">
          {donor.firstName || donor.lastName
            ? `${donor.firstName || ""} ${donor.lastName || ""}`
            : `Donor ${idx + 1}`}
        </h2>
        <p className="text-slate-500 text-sm mt-1">ID: {donor.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 text-slate-600">
        <div>
          <span className="block font-medium text-slate-500">Email:</span>
          <span>{donor.email}</span>
        </div>
        <div>
          <span className="block font-medium text-slate-500">Address:</span>
          <span>{donor.address || "Not Provided"}</span>
        </div>
        <div>
          <span className="block font-medium text-slate-500">
            Donations Made:
          </span>
          <span>{donor.donations.length}</span>
        </div>
        <div>
          <span className="block font-medium text-slate-500">
            Products Donated:
          </span>
          <span>{donor.totalProductsDonated}</span>
        </div>
      </div>
    </div>
  )
)}

        </div>
      )}
    </div>
  );
}
