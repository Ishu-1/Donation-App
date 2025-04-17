'use client';

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
// import { getDistance } from "geolib"; // Uncomment when using NGO address for distance
import toast from 'react-hot-toast';

const getLatLong = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    if (response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
};

export default function CategoryProductPage() {
  const { categoryName } = useParams();
  const searchParams = useSearchParams();
  const ngoAddress = searchParams.get("ngoAddress") || "";

  const [products, setProducts] = useState([]);
  const [ngoLocation, setNgoLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // const ngoCoords = await getLatLong(ngoAddress);
      // if (!ngoCoords) return;
      // setNgoLocation(ngoCoords);

      const response = await axios.get(`/api/category/getProductOfCategory?category=${encodeURIComponent(categoryName)}`);
      let productsWithDistance = [];
      // console.log(productsWithDistance)
      for (const product of response.data.products) {
        let distance = "N/A";

        // const donorAddress = product.donor?.address;
        // if (donorAddress) {
        //   const donorCoords = await getLatLong(donorAddress);
        //   if (donorCoords) {
        //     distance = (getDistance(ngoCoords, donorCoords) / 1000).toFixed(2) + " km";
        //   }
        // }
        if(!(product.donor===null)){
          productsWithDistance.push({ ...product, distance });
        }
        console.log("Inside the loop: ", product)
      }

      setProducts(productsWithDistance);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchProducts();
  }, [categoryName, ngoAddress]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQuantity("");
    setMessage("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity("");
    setMessage("");

  };

  const handleRequestDonation = async () => {
    if (!quantity || quantity <= 0) {
      setMessage("Please enter a valid quantity");
      return;
    }

    try {
      await axios.post("/api/donation/createDonation", {
        productId: selectedProduct.id,
        quantity:quantity,
      },
    );
      toast.success("Donation requested successfully!");
      setShowModal(false);
      fetchProducts();

    } catch (error) {
      console.error("Error creating donation:", error);
      toast.error('Failed to request donation.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="flex flex-col items-center py-8 min-h-[80vh]">
      {/* Heading OUTSIDE the box */}
      <div className="w-[90%] max-w-7xl mb-4 py-4">
        <div className="flex items-center gap-3">
          <Package size={28} className="text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            {decodeURIComponent(categoryName)} Products
          </h1>
        </div>
      </div>

      {/* Box containing the table */}
      <div className="w-[90%] max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-50 border-b-2 border-teal-100">
                <th className="p-4 text-left font-semibold text-gray-700">Image</th>
                <th className="p-4 text-left font-semibold text-gray-700">Product Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Product ID</th>
                <th className="p-4 text-center font-semibold text-gray-700">Quantity</th>
                <th className="p-4 text-left font-semibold text-gray-700">Condition</th>
                <th className="p-4 text-left font-semibold text-gray-700">Donor Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Donor ID</th>
                <th className="p-4 text-left font-semibold text-gray-700">Distance</th>
                <th className="p-4 text-center font-semibold text-gray-700">Request Donation</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) =>
                product.quantity > 0  ?(
                  <tr key={product.id} className="bg-white hover:bg-gray-50 transition-all duration-200">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        <img
                          src={product.image ? product.image[0]? product.image[0] :null:null}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-xs text-gray-500">{product.id.slice(0, 8)}...</td>
                    <td className="p-4 text-center">
                      <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{product.condition}</td>
                    <td className="p-4 text-gray-700">
                      {product.donor?.firstName} {product.donor?.lastName}
                    </td>
                    <td className="p-4 text-xs text-gray-500">{product.donor?.id?.slice(0, 8)}...</td>
                    <td className="p-4 text-gray-700">{product.distance}</td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        Request Donation
                      </button>
                      </div>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Request Donation</h2>
      
      <p className="text-gray-600 mb-2">
        Product: <span className="font-semibold">{selectedProduct?.name}</span>
      </p>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter quantity"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
      />

      {message && (
        <p className={`text-sm mb-3 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleRequestDonation}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all duration-200 cursor-pointer"
        >
          Request Donation
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
