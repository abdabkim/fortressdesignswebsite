// client/src/App.tsx

import { useState, useEffect } from 'react'; 
import './App.css'; 

// Define the core Product type
interface Product {
  id: number;
  name: string;
}

// Define the structure of the item returned by Printful's V1 API (products endpoint)
interface CatalogProductItem {
    id: number;
    product: Product; // The product data is nested under 'product'
    // V1 API returns more fields here like 'synced'
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/catalog'); 
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server error! Status: ${response.status}. Details: ${errorData.error || 'Check server logs.'}`);
        }
        
        // ⭐ FIX APPLIED: Expecting the top-level 'data' property from the V1 API response
        const data: { data: CatalogProductItem[] | undefined } = await response.json();
        
        // CRITICAL CHECK: Check for the 'data' array before mapping
        if (!data.data || !Array.isArray(data.data)) {
            console.error("API response missing 'data' array:", data); 
            throw new Error("Received invalid data structure from API. Response likely indicates a Printful API error (e.g., bad token).");
        }
        
        // Safely map over the 'data' array
        setProducts(data.data.map((item: CatalogProductItem) => item.product)); 
        
      } catch (e) {
        console.error("Failed to fetch products:", e);
        
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred during API call.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  // --- RENDERING LOGIC ---

  if (loading) {
    return (
        <div className="App-container">
            <h1>⌛ Loading Product Catalog...</h1>
            <p>Attempting to connect to backend on localhost:3000...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="App-container error">
            <h1>❌ Error Loading Data</h1>
            <p>Details: {error}</p>
            <p>Please check your server console and visit `http://localhost:3000/api/check-token` to debug your backend.</p>
        </div>
    );
  }

  return (
    <div className="App-container">
      <h1>🛍️ Product Catalog</h1>
      <p>Successfully retrieved **{products.length}** products from Printful via your API.</p>
      
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>Product ID: {product.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;