"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {Plus,ClipboardPlus} from "lucide-react"
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    condition: '',
    category: '',
    quantity: '',
  });
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/getAllCategory");
      const data = res.data.categories;

      const withCounts = await Promise.all(
        data.map(async (cat) => {
          const productsRes = await axios.get(
            `/api/category/getProductOfCategory?category=${encodeURIComponent(cat.category)}`
          );
          return {
            ...cat,
            productCount: productsRes.data.products.length,
            //  productCount: 0,
          };
        })
      );

      setCategories(withCounts);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        image: product.image,
        condition: product.condition,
        category: product.category,
        quantity: product.quantity,
      });
    } else {
      setFormData({
        name: '',
        condition: '',
        image: '',
        category: '',
        quantity: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        image: [formData.image.trim()],
        condition: formData.condition.trim(),
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
      };
  
      await axios.post('/api/donation/createNewDonation', payload);
  
      toast.success('Custom donation requested successfully!');
      setShowModal(false);
      fetchCategories(); // or fetchProducts() depending on what you're refreshing
    } catch (err) {
      console.error('Error requesting custom donation:', err);
      toast.error('Failed to request donation.');
    }
  };
  

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
  <div className="flex items-center justify-between gap-3 mb-10">
    <div className="flex items-center gap-3">
    <ClipboardPlus size={18} />
      <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
    </div>
    <button
      onClick={() => openModal()}
      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-all duration-200 cursor-pointer active:bg-teal-800"
    >
      <Plus size={18} />
      <span>Request Custom Donation</span>
    </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {categories.map((category, index) => (
      <Link
        href={{ pathname: `/category/${encodeURIComponent(category.category)}` }}
        key={index}
        className="block"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-between h-[420px] "
        >
          {category.image && (
            <div className="w-full h-70 mb-4 rounded-lg overflow-hidden">
              <Image
                src={category.image}
                alt={category.category}
                width={300}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h2 className="text-2xl font-bold text-center text-black">
            {category.category}
          </h2>
          <p className="text-md text-gray-500 text-center mt-1">
            {category.productCount} items
          </p>
        </motion.div>
      </Link>
    ))}
  </div>

  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md backdrop-brightness-75 transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-gray-200 z-10 animate-fade-in"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Request Custom Donation</h2>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer rounded-full hover:bg-gray-100 p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input
              type="text"
              placeholder="e.g. New, Used"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Electronics, Clothing"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Enter available quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 cursor-pointer transition-colors"
          >
            Request Donation
          </button>
        </div>
      </form>
    </div>
  )}
</div>
);
};

export default CategoryPage;
