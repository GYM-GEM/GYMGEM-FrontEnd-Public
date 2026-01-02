import { useContext, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext.jsx";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, Eye, Search, Filter, DollarSign, ShoppingBag, TrendingUp, Calendar, MapPin, CreditCard } from "lucide-react";
import { useToast } from "../../../context/ToastContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosConfig";

/**
 * OrderTracking Component
 * Enhanced premium order history with modern UI
 */
const OrderTracking = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useContext(StoreContext);
  const { showToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Get user orders - Filtered by email
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  const userOrders = useMemo(() => {
    if (!orders) return [];
    if (!userEmail) return [];
    // Filter orders by email match
    return orders.filter(o => o.customerEmail === userEmail);
    // Note: Mock data orders without emails will be hidden, which is correct
  }, [orders, userEmail]);

  // Get status badge styling - Modernized
  const getStatusBadge = (status) => {
    const badges = {
      Pending: {
        bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200",
        icon: Clock, label: "Pending"
      },
      Processing: {
        bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
        icon: Package, label: "Processing"
      },
      Shipped: {
        bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200",
        icon: Truck, label: "On the way"
      },
      Completed: {
        bg: "bg-green-50", text: "text-green-700", border: "border-green-200",
        icon: CheckCircle, label: "Delivered"
      },
      Cancelled: {
        bg: "bg-red-50", text: "text-red-700", border: "border-red-200",
        icon: XCircle, label: "Cancelled"
      },
    };
    return badges[status] || badges.Pending;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Safe calculation of order total price
   * prioritized: totalPrice -> price * quantity -> 0
   */
  const getOrderTotal = (order) => {
    let finalPrice = 0;

    // Check for direct total price (saved in new orders)
    if (order.totalPrice !== undefined && order.totalPrice !== null) {
      finalPrice = parseFloat(order.totalPrice);
    }
    // Fallback to unit price * quantity
    else if (order.price !== undefined && order.quantity !== undefined) {
      finalPrice = parseFloat(order.price) * parseFloat(order.quantity);
    }

    return isNaN(finalPrice) ? 0 : finalPrice;
  };

  // Handle order cancellation
  // Handle order cancellation
  const handleCancelOrder = async (e, orderId, currentStatus) => {
    e.stopPropagation();
    if (currentStatus === "Completed" || currentStatus === "Cancelled") {
      showToast("This order cannot be cancelled.", { type: "error" });
      return;
    }

    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await axiosInstance.put(`/api/stores/orders/${orderId}`, {
          status: 'cancelled'
        });

        // Update local context to reflect change immediately in UI
        updateOrderStatus(orderId, "cancelled");
        showToast("Order cancelled successfully", { type: "success" });
      } catch (error) {
        console.error("Error cancelling order:", error);
        showToast("Failed to cancel order", { type: "error" });
      }
    }
  };

  // Handle return request
  const handleReturnRequest = (e, orderId, currentStatus) => {
    e.stopPropagation();
    if (currentStatus !== "Completed") {
      showToast("Only completed orders can be returned.", { type: "error" });
      return;
    }

    if (confirm("Submit a return request for this order?")) {
      showToast("Return request submitted. Our team will contact you soon.", { type: "success" });
    }
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return userOrders
      .filter(order => {
        // Status filter
        if (statusFilter !== "All" && order.status !== statusFilter) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            order.productName?.toLowerCase().includes(query) ||
            order.id?.toLowerCase().includes(query) ||
            order.customerName?.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => new Date(b.orderDate || b.date) - new Date(a.orderDate || a.date));
  }, [userOrders, statusFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = userOrders.length;

    // Safely calculate total spent preventing NaN
    const totalSpent = userOrders.reduce((sum, order) => {
      return sum + getOrderTotal(order);
    }, 0);

    const pending = userOrders.filter(o => o.status === "Pending" || o.status === "Processing").length;
    const completed = userOrders.filter(o => o.status === "Completed").length;

    return { total, totalSpent, pending, completed };
  }, [userOrders]);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full bg-slate-50/50 pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <header className="mb-10">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/stores" className="hover:text-[#ff8211] transition-colors">Store</Link>
              <span>/</span>
              <span className="text-[#ff8211] font-medium">My Orders</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-bebas text-5xl tracking-tight text-slate-900 mb-2">
                  Order History
                </h1>
                <p className="text-slate-500 max-w-xl">
                  Track your equipment shipping, manage your recent purchases, and view transaction details.
                </p>
              </div>
            </div>
          </header>

          {/* Statistics Grid */}
          {userOrders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                label="Total Orders"
                value={stats.total}
                icon={ShoppingBag}
                color="blue"
              />
              <StatCard
                label="Total Spent"
                value={`$${stats.totalSpent.toFixed(2)}`}
                icon={DollarSign}
                color="green"
              />
              <StatCard
                label="In Progress"
                value={stats.pending}
                icon={Package}
                color="amber"
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                icon={CheckCircle}
                color="purple"
              />
            </div>
          )}

          {/* Controls & List */}
          {userOrders.length > 0 ? (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-transparent rounded-xl focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ff8211]/20 transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                  {["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === status
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                        getOrderTotal={getOrderTotal}
                        isExpanded={selectedOrder?.id === order.id}
                        toggleExpand={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        onCancel={(e) => handleCancelOrder(e, order.id, order.status)}
                        onReturn={(e) => handleReturnRequest(e, order.id, order.status)}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"
                    >
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
                      <p className="text-slate-500">Try adjusting your search or filters</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-[#ff8211]" />
              </div>
              <h2 className="font-bebas text-4xl text-slate-900 mb-3">No Orders Yet</h2>
              <p className="text-slate-500 max-w-md mb-8">
                Start your fitness journey with our premium equipment and supplements.
              </p>
              <Link
                to="/stores"
                className="bg-[#ff8211] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#e67300] transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color].replace('bg-', 'border-')} bg-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="font-bebas text-3xl text-slate-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const OrderCard = ({ order, getStatusBadge, formatDate, getOrderTotal, isExpanded, toggleExpand, onCancel, onReturn }) => {
  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;
  const canCancel = order.status !== "Completed" && order.status !== "Cancelled" && order.status !== "Shipped";
  const canReturn = order.status === "Completed";
  const totalAmount = getOrderTotal(order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={toggleExpand}
      className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${isExpanded ? "shadow-xl border-[#ff8211]/30 ring-1 ring-[#ff8211]/30" : "shadow-sm border-slate-100 hover:shadow-md hover:border-slate-200"
        }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Main Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl shrink-0">
              🛍️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{order.productName}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.orderDate || order.date)}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Status & Price */}
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500 mb-1">Total</p>
              <p className="font-bold text-slate-900 text-lg">
                ${totalAmount.toFixed(2)}
              </p>
            </div>

            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="font-semibold text-sm">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100 mt-6 pt-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="font-bebas text-lg text-slate-900 border-b border-slate-100 pb-2">Order Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500">Product Quantity</span>
                      <span className="font-medium text-slate-900">{order.quantity} item(s)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500">Total Amount</span>
                      <span className="font-medium text-slate-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500">Payment Method</span>
                      <span className="font-medium text-slate-900 capitalize flex items-center gap-1">
                        <CreditCard className="w-4 h-4" /> {order.paymentMethod?.replace('_', ' ') || "Credit Card"}
                      </span>
                    </div>
                    {order.customerEmail && (
                      <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">Contact Email</span>
                        <span className="font-medium text-slate-900">{order.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Details */}
                {order.shippingAddress && (
                  <div className="space-y-4">
                    <h4 className="font-bebas text-lg text-slate-900 border-b border-slate-100 pb-2">Shipping Address</h4>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl text-sm">
                      <MapPin className="w-5 h-5 text-[#ff8211] shrink-0 mt-0.5" />
                      <div className="text-slate-600 leading-relaxed">
                        <p className="font-bold text-slate-900 mb-1">{order.customerName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                        {order.customerPhone && <p className="mt-2 text-xs flex items-center gap-1"><span className="font-semibold">Tel:</span> {order.customerPhone}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t border-slate-100 justify-end">
                {canCancel && (
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}

                {canReturn && (
                  <button
                    onClick={onReturn}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium text-sm transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Return Item
                  </button>
                )}

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white bg-slate-900 hover:bg-[#ff8211] font-medium text-sm transition-colors">
                  Download Invoice
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OrderTracking;
