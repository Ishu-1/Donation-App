"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import AddProductForm from "../../../components/AddProductForm";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    // Add logic for editing product
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Add Product Form */}
      <div className="mb-8">
        <AddProductForm />
      </div>

      {/* Display Products */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
