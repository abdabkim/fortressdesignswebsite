import type { Express } from "express";
import { createServer, type Server } from "http";

const PRINTFUL_API_BASE = 'https://api.printful.com';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Debug endpoint to check token
  app.get('/api/check-token', (req, res) => {
    const token = process.env.PRINTFUL_TOKEN;
    if (token) {
      return res.json({ 
        status: 'Token loaded successfully', 
        token_present: true,
        token_length: token.length,
        message: 'Token is configured'
      });
    } else {
      return res.status(500).json({ 
        status: 'Token missing', 
        token_present: false,
        error: 'PRINTFUL_TOKEN not configured' 
      });
    }
  });

  // GET /api/catalog - Fetch all catalog products (Using sync/products endpoint)
  app.get('/api/catalog', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      
      if (!token) {
        console.error('❌ PRINTFUL_TOKEN not found in environment');
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }

      console.log('🔍 Fetching catalog from Printful API...');
      
      // Using sync/products which works with the token
      const response = await fetch(`${PRINTFUL_API_BASE}/sync/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Printful API responded with status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Printful API error:', errorData);
        return res.status(response.status).json({ 
          error: 'Printful API error',
          details: errorData,
          status: response.status
        });
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched ${data?.result?.length || 0} products`);
      return res.json(data);

    } catch (error) {
      console.error('❌ Catalog API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/store/products - Fetch store sync products
  app.get('/api/store/products', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      
      if (!token) {
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }

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
      return res.json(data);

    } catch (error) {
      console.error('Store products API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/store/products/:id - Get detailed product info with pricing
  app.get('/api/store/products/:id', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      const { id } = req.params;
      
      if (!token) {
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }

      console.log(`🔍 Fetching product details for ID: ${id}`);

      const response = await fetch(`${PRINTFUL_API_BASE}/sync/products/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Printful API error:', errorData);
        return res.status(response.status).json({ 
          error: 'Printful API error',
          details: errorData 
        });
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched product details for ${id}`);
      return res.json(data);

    } catch (error) {
      console.error('❌ Product details API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/product - Get single product details
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

  // POST /api/create-order - Create a new order
  app.post('/api/create-order', async (req, res) => {
    try {
      const token = process.env.PRINTFUL_TOKEN;
      
      if (!token) {
        return res.status(500).json({ error: 'PRINTFUL_TOKEN not configured' });
      }

      const { recipient, items } = req.body;

      if (!recipient || !items || !Array.isArray(items)) {
        return res.status(400).json({ 
          error: 'Invalid request body. Expected { recipient, items }' 
        });
      }

      const requiredFields = ['name', 'address1', 'city', 'country_code', 'zip'];
      const missingFields = requiredFields.filter(field => !recipient[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required recipient fields: ${missingFields.join(', ')}` 
        });
      }

      if (items.length === 0) {
        return res.status(400).json({ error: 'At least one item is required' });
      }

      for (const item of items) {
        if (!item.variant_id || !item.quantity) {
          return res.status(400).json({ 
            error: 'Each item must have variant_id and quantity' 
          });
        }
      }

      const orderPayload = {
        recipient,
        items: items.map((item: { variant_id: number; quantity: number }) => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${PRINTFUL_API_BASE}/v2/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: 'Printful API error',
          details: responseData 
        });
      }

      return res.json(responseData);

    } catch (error) {
      console.error('Create order API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/webhook - Handle Printful webhooks
  app.post('/api/webhook', async (req, res) => {
    try {
      console.log('=== Printful Webhook Received ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('================================');

      const eventType = req.body?.type || 'unknown';
      console.log(`Webhook event type: ${eventType}`);

      return res.status(200).json({ 
        received: true,
        event: eventType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Webhook handler error:', error);
      return res.status(200).json({ 
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return httpServer;
}
