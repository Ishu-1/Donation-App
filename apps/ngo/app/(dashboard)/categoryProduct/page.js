import { useEffect, useState } from "react";
import axios from "axios";
import { getDistance } from "geolib";

export default function ProductsList({ ngoAddress, selectedCategory }) {
    const [products, setProducts] = useState([]);
    const [ngoLocation, setNgoLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to convert address to latitude & longitude using OpenStreetMap
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Convert NGO Address to Lat/Long
                const ngoCoords = await getLatLong(ngoAddress);
                if (!ngoCoords) {
                    console.error("Failed to get NGO location");
                    setLoading(false);
                    return;
                }
                setNgoLocation(ngoCoords);

                // Fetch products for the selected category
                const response = await axios.get(`/api/products?category=${selectedCategory}`);
                let productsWithDistance = [];

                for (const product of response.data.products) {
                    const donorAddress = product.donor.address;
                    if (!donorAddress) continue;

                    const donorCoords = await getLatLong(donorAddress);
                    if (!donorCoords) continue;

                    // Calculate distance
                    const distance = getDistance(ngoCoords, donorCoords) / 1000; // Convert meters to KM

                    productsWithDistance.push({ ...product, distance });
                }

                // Sort products by distance (Ascending)
                productsWithDistance.sort((a, b) => a.distance - b.distance);

                setProducts(productsWithDistance);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [ngoAddress, selectedCategory]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Available Products in {selectedCategory}</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong> - Condition: {product.condition} - Quantity: {product.quantity} <br />
                        Donor: {product.donor.firstName} {product.donor.lastName} <br />
                        Distance: {product.distance.toFixed(2)} km
                    </li>
                ))}
            </ul>
        </div>
    );
}
