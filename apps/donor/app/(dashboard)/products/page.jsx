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
          image: [payload.image],
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-medium text-slate-700">Your Products</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center py-20">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-500 text-lg py-20">No products found.</p>
        ) : (
          <table className="w-full bg-white border border-slate-300 text-sm rounded-md overflow-hidden shadow">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Condition</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200'}>
                  <td className="p-3">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-xs text-gray-700">{product.id.slice(0, 8)}...</td>
                  <td className="p-3 text-center">{product.quantity}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.condition}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openModal(product)}
                      className="text-blue-700 hover:underline text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl space-y-4"
            >
              <h2 className="text-2xl font-semibold text-center text-slate-700 mb-2">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
