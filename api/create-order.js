const PRINTFUL_API_BASE = 'https://api.printful.com';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Validate recipient has required fields
    const requiredFields = ['name', 'address1', 'city', 'country_code', 'zip'];
    const missingFields = requiredFields.filter(field => !recipient[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required recipient fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate items array
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

    // Prepare order payload for Printful
    const orderPayload = {
      recipient,
      items: items.map(item => ({
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

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Create order API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
