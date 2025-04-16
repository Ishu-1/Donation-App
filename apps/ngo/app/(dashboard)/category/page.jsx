"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-10 text-center">
        CATEGORIES
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <Link
            href={{
              pathname: `/category/${encodeURIComponent(category.category)}`,
            }}
            key={index}
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-between h-[420px]"
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
    </div>
  );
};

export default CategoryPage;
