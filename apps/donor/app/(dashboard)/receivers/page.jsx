"use client";
import React, { useEffect, useState } from "react";

export default function ReceiverListPage() {
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [imageIndexMap, setImageIndexMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/ngo/fetchAllNGO");
        const data = await res.json();
        if (data.receivers) {
          setReceivers(data.receivers);
          const mapping = {};
          data.receivers.forEach((receiver, index) => {
            mapping[receiver.id] = index % 4;
          });
          setImageIndexMap(mapping);
        }
      } catch (error) {
        console.error("Error fetching receivers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivers();
  }, []);

  const handleReadMore = async (id) => {
    try {
      const res = await fetch(`/api/ngo/fetchparticularNGO?id=${id}`);
      const data = await res.json();
      if (data.receiver) {
        setSelectedReceiver(data.receiver);
      }
    } catch (error) {
      console.error("Error fetching receiver details:", error);
    }
  };

  const getPlaceholderImage = (index) => {
    const imageCount = 4;
    return `/${(index % imageCount) + 1}.jpg`;
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mb-6"></div>
      <p className="text-slate-600 text-lg">Loading NGOs for you...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl text-center font-serif text-slate-700 mb-16">
        NGO's & Individuals in need
      </h1>

      {selectedReceiver ? (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <button
            onClick={() => setSelectedReceiver(null)}
            className="text-blue-600 hover:underline mb-4 block text-left cursor-pointer"
          >
            &lt; Back
          </button>

          <h2 className="text-4xl font-serif text-slate-700 mb-6">
            {selectedReceiver.name}
          </h2>

          <div className="w-full h-96 bg-slate-100 rounded overflow-hidden mb-10">
            <img
              src={getPlaceholderImage(imageIndexMap[selectedReceiver.id] || 0)}
              alt={selectedReceiver.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-slate-500 mb-1">
            NGO Coordinator Name or Individual Name
          </p>
          <p className="text-slate-400 mb-6">
            {new Date(selectedReceiver.createdAt).toLocaleDateString()}
          </p>

          <h3 className="text-2xl font-serif text-slate-600 mb-4">
            {selectedReceiver.motti || "NGO Motto or Purpose of Individual"}
          </h3>

          <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto mb-4">
            {selectedReceiver.description ||
              "About the NGO... This is placeholder text. To change this content, double-click on the element and click Change Content..."}
          </p>

          <p className="text-slate-600 font-medium mt-6">
            📍 Address:{" "}
            <span className="font-normal text-slate-500">
              {selectedReceiver.address || "Not Provided"}
            </span>
          </p>
        </div>
      ) : loading ? (
        renderLoading()
      ) : (
        <div>
          {receivers.map((receiver, index) => (
            <div
              key={receiver.id}
              className="pb-6 mb-12 border-b border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="font-serif text-slate-700 text-2xl">
                  {receiver.name || `NGO${index + 1}`}
                </div>
                <div className="md:col-span-1">
                  <p className="text-slate-600">
                    {receiver.motti || "NGO Motto or Purpose of Individual"}
                  </p>
                  <button
                    onClick={() => handleReadMore(receiver.id)}
                    className="mt-6 px-5 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition cursor-pointer"
                  >
                    Read More
                  </button>
                </div>
                <div className="w-full h-48 bg-slate-100 rounded overflow-hidden">
                  <img
                    src={getPlaceholderImage(index)}
                    alt={receiver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
