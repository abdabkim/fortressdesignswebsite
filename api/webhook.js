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
    // Log the entire webhook event
    console.log('=== Printful Webhook Received ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('================================');

    // TODO: Add signature verification
    // When implementing signature verification:
    // 1. Get the signature from headers (e.g., req.headers['x-printful-signature'])
    // 2. Compute HMAC using webhook secret
    // 3. Compare signatures
    // Example placeholder:
    // const signature = req.headers['x-printful-signature'];
    // const isValid = verifySignature(req.body, signature, process.env.PRINTFUL_WEBHOOK_SECRET);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Extract event type if available
    const eventType = req.body?.type || 'unknown';
    
    console.log(`Webhook event type: ${eventType}`);

    // Return 200 immediately as required by Printful
    return res.status(200).json({ 
      received: true,
      event: eventType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook handler error:', error);
    
    // Still return 200 to prevent Printful from retrying
    // Log the error for debugging
    return res.status(200).json({ 
      received: true,
      error: error.message 
    });
  }
}

// Placeholder for future signature verification
// function verifySignature(payload, signature, secret) {
//   const crypto = require('crypto');
//   const computedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(JSON.stringify(payload))
//     .digest('hex');
//   return computedSignature === signature;
// }
