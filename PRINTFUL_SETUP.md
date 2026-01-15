# Printful API Backend - Setup & Usage Guide

## 🚀 Deployment to Vercel

### 1. Environment Variables

Add your Printful API token to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variable:
   - **Name**: `PRINTFUL_TOKEN`
   - **Value**: Your Printful API token (get this from your Printful Dashboard → Settings → API)
   - **Environment**: Production, Preview, and Development (select all)

4. Click **Save**

### 2. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy
vercel
```

Follow the prompts to link your project to Vercel.

---

## 📡 API Endpoints

### 1. Get Catalog Products

**Endpoint**: `GET /api/catalog`

**Description**: Retrieves all products from the Printful catalog.

**Example Frontend Call**:

```javascript
async function getCatalog() {
  try {
    const response = await fetch('https://your-domain.vercel.app/api/catalog');
    
    if (!response.ok) {
      throw new Error('Failed to fetch catalog');
    }
    
    const data = await response.json();
    console.log('Catalog:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

### 2. Get Product Details

**Endpoint**: `GET /api/product?id={PRODUCT_ID}`

**Description**: Retrieves detailed information about a specific product including variants.

**Example Frontend Call**:

```javascript
async function getProduct(productId) {
  try {
    const response = await fetch(
      `https://your-domain.vercel.app/api/product?id=${productId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    console.log('Product:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getProduct('12345');
```

---

### 3. Create Order

**Endpoint**: `POST /api/create-order`

**Description**: Creates a new order in Printful.

**Request Body**:

```json
{
  "recipient": {
    "name": "John Doe",
    "address1": "123 Main St",
    "city": "Los Angeles",
    "country_code": "US",
    "zip": "90001"
  },
  "items": [
    {
      "variant_id": 4012,
      "quantity": 1
    }
  ]
}
```

**Example Frontend Call**:

```javascript
async function createOrder(orderData) {
  try {
    const response = await fetch('https://your-domain.vercel.app/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    
    const data = await response.json();
    console.log('Order created:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
createOrder({
  recipient: {
    name: "Jane Smith",
    address1: "456 Oak Ave",
    city: "New York",
    country_code: "US",
    zip: "10001"
  },
  items: [
    { variant_id: 4012, quantity: 2 },
    { variant_id: 4013, quantity: 1 }
  ]
});
```

---

### 4. Webhook Handler

**Endpoint**: `POST /api/webhook`

**Description**: Receives and logs webhook events from Printful.

**Setup in Printful**:

1. Log in to your Printful dashboard
2. Go to **Settings → Stores → [Your Store] → Webhooks**
3. Add webhook URL: `https://your-domain.vercel.app/api/webhook`
4. Select events you want to receive
5. Save

**Current Behavior**:
- Logs all webhook events to console
- Returns 200 immediately to acknowledge receipt
- Ready for signature verification (commented code included)

**To Add Signature Verification** (when needed):

1. Get your webhook secret from Printful dashboard
2. Add `PRINTFUL_WEBHOOK_SECRET` to Vercel environment variables
3. Uncomment the signature verification code in `api/webhook.js`

---

## 🔧 React Component Examples

### Using with React Query

```javascript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch catalog
function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const response = await fetch('https://your-domain.vercel.app/api/catalog');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });
}

// Fetch product
function useProduct(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(
        `https://your-domain.vercel.app/api/product?id=${productId}`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!productId
  });
}

// Create order
function useCreateOrder() {
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await fetch('https://your-domain.vercel.app/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      return response.json();
    }
  });
}

// Component usage
function ProductList() {
  const { data, isLoading, error } = useCatalog();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.result?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

function OrderForm() {
  const createOrder = useCreateOrder();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createOrder.mutate({
      recipient: {
        name: "Customer Name",
        address1: "123 Street",
        city: "City",
        country_code: "US",
        zip: "12345"
      },
      items: [{ variant_id: 4012, quantity: 1 }]
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={createOrder.isPending}>
        {createOrder.isPending ? 'Creating...' : 'Create Order'}
      </button>
      {createOrder.isSuccess && <p>Order created!</p>}
      {createOrder.isError && <p>Error: {createOrder.error.message}</p>}
    </form>
  );
}
```

---

## 🧪 Testing Locally

To test these endpoints locally with Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Run development server
vercel dev
```

The endpoints will be available at `http://localhost:3000/api/*`

---

## 📝 Notes

- All endpoints include CORS headers allowing requests from any origin (`*`)
- OPTIONS requests are handled for CORS preflight
- Error responses include detailed error messages
- The webhook endpoint logs all events to console for debugging
- Token authentication is handled automatically using environment variables

---

## 🔐 Security Recommendations

1. **Production CORS**: Update CORS headers to only allow your frontend domain
2. **Webhook Verification**: Implement signature verification in `api/webhook.js`
3. **Rate Limiting**: Consider adding rate limiting for production
4. **Input Validation**: Add more robust validation for order data
5. **Logging**: Set up proper logging service instead of console.log

---

## 🐛 Troubleshooting

### "PRINTFUL_TOKEN not configured" error
- Ensure the environment variable is set in Vercel dashboard
- Redeploy after adding environment variables

### CORS errors
- Verify CORS headers are being set correctly
- Check browser console for specific error messages

### Webhook not receiving events
- Verify webhook URL in Printful dashboard
- Check Vercel function logs for incoming requests
- Ensure webhook endpoint returns 200 status
