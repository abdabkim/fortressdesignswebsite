import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, ArrowLeft, Search, Eye, RotateCcw,
  Calendar, DollarSign
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function OrderHistoryContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const orders = [
    {
      id: "ORD-2024-001",
      date: "December 1, 2024",
      status: "Delivered",
      total: 89.99,
      items: [
        { name: "Neon Streetwear Hoodie", quantity: 1, price: 59.99, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop" },
        { name: "Urban Cap", quantity: 1, price: 29.99, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&h=100&fit=crop" },
      ]
    },
    {
      id: "ORD-2024-002",
      date: "November 28, 2024",
      status: "In Transit",
      total: 124.50,
      items: [
        { name: "Premium T-Shirt Pack", quantity: 2, price: 45.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
        { name: "Designer Joggers", quantity: 1, price: 79.50, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=100&h=100&fit=crop" },
      ]
    },
    {
      id: "ORD-2024-003",
      date: "November 25, 2024",
      status: "Processing",
      total: 45.00,
      items: [
        { name: "Fortress Logo Tee", quantity: 1, price: 45.00, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop" },
      ]
    },
    {
      id: "ORD-2024-004",
      date: "November 15, 2024",
      status: "Delivered",
      total: 199.99,
      items: [
        { name: "Limited Edition Jacket", quantity: 1, price: 199.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop" },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "In Transit": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-yellow-100 text-yellow-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: "delivered", label: "Delivered" },
    { value: "in-transit", label: "In Transit" },
    { value: "processing", label: "Processing" },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || 
      order.status.toLowerCase().replace(" ", "-") === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                  <p className="text-gray-500 mt-1">View and manage your past orders</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  {orders.length} total orders
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by ID or product name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {filterOptions.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.value)}
                        className={selectedFilter === filter.value ? "bg-primary text-white" : ""}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <Link href="/shop">
                      <Button className="bg-primary text-white">Start Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.id}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {order.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                          {order.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 pr-4"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href={`/account/tracking?order=${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              Track Order
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderHistory() {
  return (
    <ProtectedRoute>
      <OrderHistoryContent />
    </ProtectedRoute>
  );
}
