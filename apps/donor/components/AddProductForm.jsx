"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem, Spinner, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [condition, setCondition] = useState("New");
  const [category, setCategory] = useState("Clothing");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleAddProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image: image.split(",").map((img) => img.trim()),
          condition,
          category,
          quantity: Number(quantity),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add product.");
        return;
      }

      router.refresh();
    } catch (error) {
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-lg shadow-lg bg-white rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Product</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-6">
          {/* Product Name */}
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter product name"
            isClearable
            className="w-full"
          />

          {/* Image URLs */}
          <Input
            label="Image URLs (comma-separated)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URLs separated by commas"
            required
            className="w-full"
          />

          {/* Condition */}
          <Select
            label="Condition"
            selectedKeys={[condition]}
            onSelectionChange={(keys) => setCondition(Array.from(keys)[0])}
            className="w-full"
          >
            <SelectItem key="New" value="New">New</SelectItem>
            <SelectItem key="Good" value="Good">Good</SelectItem>
            <SelectItem key="Used" value="Used">Used</SelectItem>
          </Select>

          {/* Category */}
          <Select
            label="Category"
            selectedKeys={[category]}
            onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
            className="w-full"
          >
            <SelectItem key="Clothing" value="Clothing">Clothing</SelectItem>
            <SelectItem key="Electronics" value="Electronics">Electronics</SelectItem>
            <SelectItem key="Books" value="Books">Books</SelectItem>
            <SelectItem key="Other" value="Other">Other</SelectItem>
          </Select>

          {/* Quantity */}
          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Enter quantity"
            required
            className="w-full"
          />

          {/* Submit Button */}
          <Button
            color="primary"
            className="w-full mt-4"
            onClick={handleAddProduct}
            isLoading={loading}
          >
            {loading ? <Spinner size="sm" /> : "Add Product"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddProductForm;
