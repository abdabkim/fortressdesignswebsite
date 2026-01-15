import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Package, Truck, CheckCircle, MapPin, Clock,
  Phone, Mail, Copy
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function OrderTrackingContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchString = useSearch();
  const orderId = new URLSearchParams(searchString).get("order") || "ORD-2024-002";

  const orderDetails = {
    id: orderId,
    status: "In Transit",
    estimatedDelivery: "December 10, 2024",
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    items: [
      { name: "Premium T-Shirt Pack", quantity: 2, price: 45.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
      { name: "Designer Joggers", quantity: 1, price: 79.50, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=100&h=100&fit=crop" },
    ],
    shippingAddress: {
      name: user?.displayName || "Customer",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    }
  };

  const trackingSteps = [
    { 
      status: "Order Placed", 
      date: "Nov 28, 2024 - 10:30 AM", 
      completed: true,
      description: "Your order has been confirmed"
    },
    { 
      status: "Processing", 
      date: "Nov 28, 2024 - 2:15 PM", 
      completed: true,
      description: "Order is being prepared for shipment"
    },
    { 
      status: "Shipped", 
      date: "Nov 29, 2024 - 9:00 AM", 
      completed: true,
      description: "Package handed to carrier"
    },
    { 
      status: "In Transit", 
      date: "Dec 2, 2024 - 3:45 PM", 
      completed: true,
      current: true,
      description: "Package is on the way"
    },
    { 
      status: "Out for Delivery", 
      date: "Expected Dec 10, 2024", 
      completed: false,
      description: "Package will be delivered today"
    },
    { 
      status: "Delivered", 
      date: "Expected Dec 10, 2024", 
      completed: false,
      description: "Package delivered successfully"
    },
  ];

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(orderDetails.trackingNumber);
    toast({
      title: "Copied!",
      description: "Tracking number copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <Link href="/account/orders">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Track Order</h1>
                  <p className="text-gray-500 mt-1">Order {orderDetails.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Shipment Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {trackingSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 pb-8 last:pb-0"
                        >
                          <div className="relative flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                              step.current 
                                ? 'bg-primary text-white ring-4 ring-primary/20' 
                                : step.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-400'
                            }`}>
                              {step.completed && !step.current ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : step.current ? (
                                <Truck className="h-5 w-5" />
                              ) : (
                                <Clock className="h-5 w-5" />
                              )}
                            </div>
                            {index < trackingSteps.length - 1 && (
                              <div className={`absolute top-10 w-0.5 h-full ${
                                step.completed ? 'bg-green-500' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className={`font-semibold ${
                              step.current ? 'text-primary' : step.completed ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.status}
                            </h4>
                            <p className="text-sm text-gray-500">{step.date}</p>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Tracking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded-lg font-mono">
                          {orderDetails.trackingNumber}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={copyTrackingNumber}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Carrier</p>
                      <p className="font-medium">{orderDetails.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                      <p className="font-medium text-primary">{orderDetails.estimatedDelivery}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}</p>
                      <p>{orderDetails.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      Email Us
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTracking() {
  return (
    <ProtectedRoute>
      <OrderTrackingContent />
    </ProtectedRoute>
  );
}
