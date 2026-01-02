import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import NavBar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import axiosInstance from "../../utils/axiosConfig";
import { Lock, ShieldCheck, CreditCard, ArrowLeft, Package } from "lucide-react";

/**
 * StoreCheckout Component
 * Handles checkout flow for physical store products
 * Creates orders compatible with StoreOrder.jsx dashboard structure
 */
const StoreCheckout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, addOrder, clearCart } = useContext(StoreContext);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Form state
  // Get user info for pre-fill
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    customerNotes: "",
    // Payment Information
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Redirect if cart is empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const total = subtotal; // No tax or shipping

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    // Shipping validation
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Please enter your address");
      return false;
    }
    if (!formData.city.trim()) {
      setError("Please enter your city");
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError("Please enter your zip code");
      return false;
    }

    // Payment validation not needed as fields are hidden
    // if (formData.paymentMethod === "credit_card") {
    //   if (!formData.cardNumber || formData.cardNumber.length < 16) {
    //     setError("Please enter a valid 16-digit card number");
    //     return false;
    //   }
    //   if (!formData.cardName) {
    //     setError("Please enter cardholder name");
    //     return false;
    //   }
    //   if (!formData.expiryDate) {
    //     setError("Please enter expiry date");
    //     return false;
    //   }
    //   if (!formData.cvv || formData.cvv.length < 3) {
    //     setError("Please enter a valid CVV");
    //     return false;
    //   }
    // }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // DEBUG: Log cart to see what we are working with
      console.log("Current Cart:", cart);

      // Group items by profile_id (Store) to create one order per store
      const ordersByStore = cart.reduce((acc, item) => {
        // Use profile_id as the primary key for grouping
        // Fallback to store_id if profile_id is somehow missing
        const storeKey = item.profile_id || item.store_id || "unknown";

        if (!acc[storeKey]) {
          acc[storeKey] = {
            profile_id: item.profile_id || item.store_id, // Ensure we have an ID
            store_name: item.store_name || "Store",
            items: []
          };
        }
        acc[storeKey].items.push(item);
        return acc;
      }, {});

      const orderPromises = Object.values(ordersByStore).map(async (group) => {
        // Calculate total carefully
        const storeTotal = group.items.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseInt(item.cartQuantity) || 0;
          return sum + (price * qty);
        }, 0);

        // Construct notes
        const userNote = formData.customerNotes ? `Note: ${formData.customerNotes}` : '';
        const shippingInfo = `Ship to: ${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`;
        const finalNotes = `${shippingInfo}. ${userNote}`;

        // Robust Buyer ID
        let buyerId = user?.user_id || user?.id || user?.pk || 0;

        const payload = {
          profile_id: String(group.profile_id),
          store_name: group.store_name,

          buyer_name: user?.username || formData.fullName,
          total_price: String(storeTotal.toFixed(2)),
          status: "pending",
          notes: finalNotes,
          order_items: group.items.map(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.cartQuantity) || 1;
            const sizeId = item.selectedSizeId ? parseInt(item.selectedSizeId) : null;

            return {
              store_item_id: parseInt(item.id),
              size_id: sizeId, // null if no size selected, integer if selected
              quantity: quantity,
              price_at_order: String(price.toFixed(2))
            };
          })
        };

        console.log("Submitting Order Payload:", JSON.stringify(payload, null, 2));

        const response = await axiosInstance.post('/api/stores/orders', payload);
        console.log("Order Response:", response.data);

        // Add to Local Context
        addOrder({
          productId: group.items[0].id,
          productName: group.items.length > 1 ? `${group.items[0].name} + ${group.items.length - 1} more` : group.items[0].name,
          quantity: group.items.length,
          price: storeTotal,
          totalPrice: storeTotal,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          status: "Pending",
        });

        return response.data;
      });

      const createdOrders = await Promise.all(orderPromises);

      // Clear the cart
      clearCart();

      // Navigate to success page
      navigate('/store-order-success', {
        state: {
          orders: createdOrders,
          total: total,
          customerName: formData.fullName
        }
      });

    } catch (err) {
      console.error("Order submission failed:", err);
      // Log full error details for debugging
      if (err.response) {
        console.error("Backend Error Data:", err.response.data);
      }
      setError(err.response?.data?.message || err.message || "Order failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />

      <section className="w-full bg-background pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="text-[#ff8211] text-sm font-medium hover:underline inline-flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>
            <h1 className="font-bebas text-4xl sm:text-5xl tracking-tight text-[#ff8211]">
              Checkout
            </h1>
            <p className="text-base text-[#555555] mt-2">
              Complete your order securely
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CHECKOUT FORM */}
            <div className="lg:col-span-2 space-y-6">

              {/* SHIPPING INFORMATION */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bebas text-2xl text-slate-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#ff8211]" />
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none"
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="customerNotes"
                      value={formData.customerNotes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none min-h-[100px]"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                    />
                  </div>
                </form>
              </div>



              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-[#ff8211] text-white rounded-lg font-semibold text-lg hover:bg-[#e67300] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order - {total.toFixed(2)} GEMs
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>

            {/* ORDER SUMMARY SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                <h2 className="font-bebas text-2xl text-slate-900 mb-6">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.item_image ? (
                          <img src={item.item_image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.cartQuantity}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {(item.price * item.cartQuantity).toFixed(2)} GEMs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} GEMs</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-[#ff8211]">{subtotal.toFixed(2)} GEMs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreCheckout;
