// server.js

// 1. **MANDATORY FIRST LINES:** Explicitly import dotenv and set the path.
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); 

// 2. Import Express and related modules
import express from 'express';
import { createServer } from 'http';
import cors from 'cors'; // Import CORS

// 3. Configuration
const PRINTFUL_API_BASE = 'https://api.printful.com';
const PORT = process.env.PORT || 3000;

// 4. Initialize App and Middleware
const app = express();
app.use(express.json());

// --- 5. CRITICAL FIX: CORS CONFIGURATION ---
const corsOptions = {
    // Allows requests ONLY from your client's development URL (Vite's server)
    origin: 'http://localhost:5000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
};
app.use(cors(corsOptions)); // Apply the CORS middleware
// ------------------------------------------

// 6. Debug Check
const debugToken = process.env.PRINTFUL_TOKEN;
if (!debugToken) {
    console.error("❌ CRITICAL ERROR: PRINTFUL_TOKEN is not being loaded from .env!");
} else {
    console.log(`✅ SUCCESS: PRINTFUL_TOKEN loaded successfully. Length: ${debugToken.length}`);
}


// ==========================================================
// 7. API Routes Implementation
// ==========================================================

// --- DEBUG ENDPOINT ---
app.get('/api/check-token', (req, res) => {
    const token = process.env.PRINTFUL_TOKEN;
    if (token) {
        return res.json({ 
            status: 'Token loaded successfully', 
            token_present: true,
            token_length: token.length,
            message: 'Proceed to test /api/catalog'
        });
    } else {
        return res.status(500).json({ 
            status: 'Token missing', 
            token_present: false,
            error: 'PRINTFUL_TOKEN not configured' 
        });
    }
});


// GET /api/catalog - Fetch all catalog products (Using V1 API endpoint)
app.get('/api/catalog', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      
      if (!token) {
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }

      // Using Printful sync/products endpoint to get store products
      const response = await fetch(`${PRINTFUL_API_BASE}/sync/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ 
          error: 'Printful API error',
          details: errorData 
        });
      }

      const data = await response.json();
      return res.json(data); // Returns JSON with a top-level 'data' key

    } catch (error) {
      console.error('Catalog API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});


// GET /api/product - Get single product details (Placeholder, needs V1 URL if used)
app.get('/api/product', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      
      if (!token) {
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }
      
      // Note: This needs to be updated to a V1 endpoint if you use it (e.g., /products/{id})
      const response = await fetch(`${PRINTFUL_API_BASE}/v2/catalog-products/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ 
          error: 'Printful API error',
          details: errorData 
        });
      }

      const data = await response.json();
      return res.json(data);

    } catch (error) {
      console.error('Product API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

// POST /api/create-order (Placeholder)
app.post('/api/create-order', async (req, res) => {
    const token = process.env.PRINTFUL_TOKEN;
    if (!token) return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
    try {
        const { recipient, items } = req.body;
        return res.status(501).json({ error: 'Order Creation Not Implemented Yet' });
    } catch (error) {
        console.error('Create order API error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/webhook (Placeholder)
app.post('/api/webhook', async (req, res) => {
    console.log('Webhook received:', req.body);
    return res.status(200).json({ received: true });
});


// 8. Start the server
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Debug Token Status: http://localhost:${PORT}/api/check-token`);
});