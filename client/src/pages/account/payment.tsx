import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, CreditCard, Plus, Trash2, Check, Shield, Lock, X
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

interface PaymentMethod {
  id: number;
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expMonth: string;
  expYear: string;
  name: string;
  isDefault: boolean;
}

function PaymentMethodsContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expMonth: "12",
      expYear: "2026",
      name: user?.displayName || "John Doe",
      isDefault: true
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      expMonth: "06",
      expYear: "2025",
      name: user?.displayName || "John Doe",
      isDefault: false
    },
  ]);

  const [newCard, setNewCard] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    name: "",
  });

  const handleSetDefault = (id: number) => {
    setPaymentMethods(methods => methods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed.",
    });
  };

  const handleDelete = (id: number) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast({
      title: "Payment method removed",
      description: "The card has been removed from your account.",
    });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCard.number.slice(-4);
    const type = getCardType(newCard.number);
    const id = Math.max(...paymentMethods.map(m => m.id), 0) + 1;
    
    setPaymentMethods([...paymentMethods, {
      id,
      type: type as "visa" | "mastercard" | "amex" | "discover",
      last4,
      expMonth: newCard.expMonth,
      expYear: newCard.expYear,
      name: newCard.name,
      isDefault: paymentMethods.length === 0
    }]);
    
    setShowAddForm(false);
    setNewCard({ number: "", expMonth: "", expYear: "", cvc: "", name: "" });
    toast({
      title: "Card added",
      description: `Card ending in ${last4} has been added to your account.`,
    });
  };

  const getCardType = (number: string): string => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (cleanNumber.startsWith("5")) return "mastercard";
    if (cleanNumber.startsWith("3")) return "amex";
    if (cleanNumber.startsWith("6")) return "discover";
    return "visa";
  };

  const getCardLogo = (type: string) => {
    const colors: Record<string, string> = {
      visa: "from-blue-600 to-blue-800",
      mastercard: "from-red-500 to-orange-500",
      amex: "from-blue-400 to-blue-600",
      discover: "from-orange-500 to-orange-700",
    };
    return colors[type] || colors.visa;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
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
                  <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
                  <p className="text-gray-500 mt-1">Manage your saved payment methods</p>
                </div>
                <Button 
                  className="bg-primary text-white gap-2"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and securely stored. We never store your full card number.
              </p>
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
                      <div>
                        <CardTitle>Add New Card</CardTitle>
                        <CardDescription>Enter your card details below</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setShowAddForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddCard} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Card Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="1234 5678 9012 3456"
                              value={formatCardNumber(newCard.number)}
                              onChange={(e) => setNewCard({ 
                                ...newCard, 
                                number: e.target.value.replace(/\s/g, "").slice(0, 16) 
                              })}
                              className="pl-10"
                              maxLength={19}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Month</Label>
                            <Input
                              placeholder="MM"
                              value={newCard.expMonth}
                              onChange={(e) => setNewCard({ 
                                ...newCard, 
                                expMonth: e.target.value.slice(0, 2) 
                              })}
                              maxLength={2}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              placeholder="YYYY"
                              value={newCard.expYear}
                              onChange={(e) => setNewCard({ 
                                ...newCard, 
                                expYear: e.target.value.slice(0, 4) 
                              })}
                              maxLength={4}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CVC</Label>
                            <div className="relative">
                              <Input
                                placeholder="123"
                                type="password"
                                value={newCard.cvc}
                                onChange={(e) => setNewCard({ 
                                  ...newCard, 
                                  cvc: e.target.value.slice(0, 4) 
                                })}
                                maxLength={4}
                                required
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Cardholder Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={newCard.name}
                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                            required
                          />
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
                            Add Card
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
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-0 shadow-sm overflow-hidden ${
                      method.isDefault ? 'ring-2 ring-primary' : ''
                    }`}>
                      <div className={`h-32 bg-gradient-to-br ${getCardLogo(method.type)} p-6 relative`}>
                        {method.isDefault && (
                          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            Default
                          </div>
                        )}
                        <div className="absolute bottom-4 left-6 right-6">
                          <p className="text-white/80 text-sm mb-1">Card Number</p>
                          <p className="text-white font-mono text-lg tracking-wider">
                            •••• •••• •••• {method.last4}
                          </p>
                        </div>
                        <CreditCard className="absolute top-4 left-4 h-8 w-8 text-white/40" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-gray-400 uppercase">
                            {method.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              <Check className="h-3 w-3" />
                              Set Default
                            </Button>
                          )}
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(method.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {paymentMethods.length === 0 && !showAddForm && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods saved</h3>
                  <p className="text-gray-500 mb-4">Add a card to make checkout faster</p>
                  <Button 
                    className="bg-primary text-white"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
                <CardDescription>The address associated with your primary payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{user?.displayName || 'Customer'}</p>
                    <p>123 Main Street</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                  <Link href="/account/addresses">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentMethods() {
  return (
    <ProtectedRoute>
      <PaymentMethodsContent />
    </ProtectedRoute>
  );
}
