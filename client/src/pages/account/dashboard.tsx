import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, Package, Heart, MapPin, CreditCard, Settings, 
  ShoppingBag, TrendingUp, Truck, ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function DashboardContent() {
  const { user } = useAuth();

  const quickStats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag, color: "bg-primary/10 text-primary" },
    { label: "Wishlist Items", value: "8", icon: Heart, color: "bg-secondary/10 text-secondary" },
    { label: "Pending Delivery", value: "2", icon: Truck, color: "bg-accent/10 text-accent" },
    { label: "Reward Points", value: "1,250", icon: TrendingUp, color: "bg-green-100 text-green-600" },
  ];

  const menuItems = [
    { icon: User, label: "Profile Settings", description: "Update your personal information", href: "/account/profile" },
    { icon: Package, label: "Order History", description: "View and track your orders", href: "/account/orders" },
    { icon: Truck, label: "Track Order", description: "Track your current deliveries", href: "/account/tracking" },
    { icon: Heart, label: "Wishlist", description: "Items you've saved for later", href: "/account/wishlist" },
    { icon: MapPin, label: "Address Book", description: "Manage your delivery addresses", href: "/account/addresses" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage your payment options", href: "/account/payment" },
  ];

  const recentOrders = [
    { id: "ORD-2024-001", date: "Dec 1, 2024", status: "Delivered", total: "$89.99", items: 3 },
    { id: "ORD-2024-002", date: "Nov 28, 2024", status: "In Transit", total: "$124.50", items: 2 },
    { id: "ORD-2024-003", date: "Nov 25, 2024", status: "Processing", total: "$45.00", items: 1 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "In Transit": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage your account and track your orders
                  </p>
                </div>
                <Link href="/shop">
                  <Button className="bg-primary text-white gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
                    <Link href="/account/orders">
                      <Button variant="ghost" size="sm" className="text-primary gap-1">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{order.total}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Quick Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {menuItems.map((item, index) => (
                        <Link key={index} href={item.href}>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                              <item.icon className="h-5 w-5 text-primary group-hover:text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
