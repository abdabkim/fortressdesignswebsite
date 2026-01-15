import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, MapPin, Plus, Edit2, Trash2, Check, Home, Building, X
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

interface Address {
  id: number;
  label: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

function AddressBookContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: "Home",
      type: "home",
      name: user?.displayName || "John Doe",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true
    },
    {
      id: 2,
      label: "Work",
      type: "work",
      name: user?.displayName || "John Doe",
      street: "456 Business Ave, Floor 12",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    label: "",
    type: "home" as "home" | "work" | "other",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
  });

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast({
      title: "Default address updated",
      description: "Your default shipping address has been changed.",
    });
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast({
      title: "Address deleted",
      description: "The address has been removed from your address book.",
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...addresses.map(a => a.id), 0) + 1;
    setAddresses([...addresses, { ...newAddress, id, isDefault: addresses.length === 0 }]);
    setShowAddForm(false);
    setNewAddress({
      label: "",
      type: "home",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      phone: "",
    });
    toast({
      title: "Address added",
      description: "Your new address has been saved.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home": return Home;
      case "work": return Building;
      default: return MapPin;
    }
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
              <Link href="/account">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
                  <p className="text-gray-500 mt-1">Manage your shipping addresses</p>
                </div>
                <Button 
                  className="bg-primary text-white gap-2"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Add New Address</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setShowAddForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Address Label</Label>
                            <Input
                              placeholder="e.g., Home, Work, Parents"
                              value={newAddress.label}
                              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Address Type</Label>
                            <div className="flex gap-2">
                              {(["home", "work", "other"] as const).map((type) => (
                                <Button
                                  key={type}
                                  type="button"
                                  variant={newAddress.type === type ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setNewAddress({ ...newAddress, type })}
                                  className={newAddress.type === type ? "bg-primary text-white" : ""}
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              placeholder="John Doe"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                              placeholder="+1 (555) 000-0000"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Street Address</Label>
                          <Input
                            placeholder="123 Main St, Apt 4B"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              placeholder="New York"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State</Label>
                            <Input
                              placeholder="NY"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ZIP Code</Label>
                            <Input
                              placeholder="10001"
                              value={newAddress.zip}
                              onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-primary text-white">
                            Save Address
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {addresses.map((address, index) => {
                  const TypeIcon = getTypeIcon(address.type);
                  return (
                    <motion.div
                      key={address.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`border-0 shadow-sm relative overflow-hidden ${
                        address.isDefault ? 'ring-2 ring-primary' : ''
                      }`}>
                        {address.isDefault && (
                          <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                            Default
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <TypeIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1">{address.label}</h3>
                              <p className="text-sm text-gray-600">{address.name}</p>
                              <p className="text-sm text-gray-600">{address.street}</p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p className="text-sm text-gray-600">{address.country}</p>
                              <p className="text-sm text-gray-500 mt-2">{address.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            {!address.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleSetDefault(address.id)}
                              >
                                <Check className="h-3 w-3" />
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(address.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {addresses.length === 0 && !showAddForm && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-500 mb-4">Add your first shipping address to get started</p>
                  <Button 
                    className="bg-primary text-white"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AddressBook() {
  return (
    <ProtectedRoute>
      <AddressBookContent />
    </ProtectedRoute>
  );
}
