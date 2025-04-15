'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.error('Failed to fetch products.');
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
        image: [formData.image.trim()],
        condition: formData.condition.trim(),
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
      };

      if (editingId) {
        await axios.patch('/api/products/updateProducts', {
          productId: editingId,
          ...payload,
        });
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/api/products/addProducts', {
          ...payload,
          image: [payload.image],
        });
        toast.success('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Failed to save product.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package size={28} className="text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-800">Your Products</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-all duration-200 cursor-pointer active:bg-teal-800"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-center text-gray-500 text-lg mb-4">No products found.</p>
            <button
              onClick={() => openModal()}
              className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-50 border-b-2 border-teal-100">
                    <th className="p-4 text-left font-semibold text-gray-700">Image</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Product ID</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Quantity</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Category</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Condition</th>
                    <th className="p-4 text-right font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    product.quantity > 0 && (
                      <tr key={product.id} className="bg-white hover:bg-gray-50 transition-all duration-200">
                        <td className="p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-800">{product.name}</td>
                        <td className="p-4 text-xs text-gray-500">{product.id.slice(0, 8)}...</td>
                        <td className="p-4 text-center">
                          <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium">{product.quantity}</span>
                        </td>
                        <td className="p-4 text-gray-700">{product.category}</td>
                        <td className="p-4 text-gray-700">{product.condition}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openModal(product)}
                            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 cursor-pointer transition-colors py-1 px-3 hover:bg-teal-50 rounded-lg"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal with haze */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md backdrop-brightness-75 transition-all duration-300">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-gray-200 z-10 animate-fade-in"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer rounded-full hover:bg-gray-100 p-2 transition-colors"
                >
                  <X size={20} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
