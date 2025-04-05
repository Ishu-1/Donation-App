'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    condition: '',
    category: '',
    quantity: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products/getAllProducts');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        image: product.image?.[0] || '',
        condition: product.condition,
        category: product.category,
        quantity: product.quantity,
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: '',
        image: '',
        condition: '',
        category: '',
        quantity: '',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        image: formData.image.trim(),
        condition: formData.condition.trim(),
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
      };

      if (editingId) {
        await axios.patch('/api/products/updateProducts', {
          productId: editingId,
          ...payload,
        });
        alert('Product updated successfully!');
      } else {
        await axios.post('/api/products/addProducts', {
          ...payload,
          image: [payload.image], // Send image as array for creation
        });
        alert('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold">{product.name}</p>
                <button
                  onClick={() => openModal(product)}
                  className="text-blue-600 underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Condition:</strong> {product.condition}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4"
          >
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Condition"
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
