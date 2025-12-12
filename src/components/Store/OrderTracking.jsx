import { useContext, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import NavBar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, Eye, Search, Filter, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

/**
 * OrderTracking Component
 * Enhanced order history with filtering, search, and order management
 */
const OrderTracking = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useContext(StoreContext);
  const { showToast } = useToast();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Get user orders
  const userOrders = orders || [];

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      Processing: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
      Shipped: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
      Completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      Cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
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
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId, currentStatus) => {
    if (currentStatus === "Completed" || currentStatus === "Cancelled") {
      showToast("This order cannot be cancelled.", { type: "error" });
      return;
    }
    
    if (confirm("Are you sure you want to cancel this order?")) {
      updateOrderStatus(orderId, "Cancelled");
      showToast("Order cancelled successfully", { type: "success" });
      setSelectedOrder(null);
    }
  };

  // Handle return request
  const handleReturnRequest = (orderId, currentStatus) => {
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
    const totalSpent = userOrders.reduce((sum, order) => 
      sum + (order.totalPrice || order.price * order.quantity), 0
    );
    const pending = userOrders.filter(o => o.status === "Pending" || o.status === "Processing").length;
    const completed = userOrders.filter(o => o.status === "Completed").length;
    
    return { total, totalSpent, pending, completed };
  }, [userOrders]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />

      <section className="w-full bg-background pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link to="/stores" className="text-[#ff8211] text-sm font-medium hover:underline inline-flex items-center gap-1 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="font-bebas text-4xl text-slate-900 mb-2">My Orders</h1>
            <p className="text-slate-600">Track and manage your order history</p>
          </div>

          {/* Statistics Cards */}
          {userOrders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                </div>
                <p className="text-sm text-slate-600">Total Orders</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold text-slate-900">${stats.totalSpent.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-600">Total Spent</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
                </div>
                <p className="text-sm text-slate-600">Pending Orders</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold text-slate-900">{stats.completed}</span>
                </div>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          {userOrders.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search by product, order ID, or customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none transition"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="relative sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-[#ff8211] outline-none transition appearance-none bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              {/* Results count */}
              <div className="mt-3 text-sm text-slate-600">
                Showing {filteredOrders.length} of {userOrders.length} orders
              </div>
            </div>
          )}

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <Package className="w-24 h-24 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {userOrders.length === 0 ? "No Orders Yet" : "No Orders Found"}
              </h2>
              <p className="text-slate-600 mb-6">
                {userOrders.length === 0 
                  ? "You haven't placed any orders yet." 
                  : "Try adjusting your search or filter criteria."}
              </p>
              {userOrders.length === 0 && (
                <button
                  onClick={() => navigate("/stores")}
                  className="bg-[#ff8211] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e67300] transition"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const StatusIcon = statusBadge.icon;
                const canCancel = order.status !== "Completed" && order.status !== "Cancelled" && order.status !== "Shipped";
                const canReturn = order.status === "Completed";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">
                              {order.productName}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-500">
                            Order ID: <span className="font-mono">{order.id.slice(0, 13)}</span>
                          </p>
                          <p className="text-sm text-slate-500">
                            Placed on: {formatDate(order.orderDate || order.date)}
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-1.5 ${statusBadge.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="border-t border-slate-100 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Quantity</p>
                            <p className="font-semibold text-slate-900">{order.quantity} item(s)</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                            <p className="font-semibold text-slate-900">
                              ${(order.totalPrice || order.price * order.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Customer</p>
                            <p className="font-semibold text-slate-900">{order.customerName}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="flex items-center gap-2 text-[#ff8211] hover:text-[#e67300] font-semibold text-sm transition"
                          >
                            <Eye className="w-4 h-4" />
                            {selectedOrder?.id === order.id ? "Hide Details" : "View Details"}
                          </button>
                          
                          {canCancel && (
                            <button
                              onClick={() => handleCancelOrder(order.id, order.status)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Order
                            </button>
                          )}
                          
                          {canReturn && (
                            <button
                              onClick={() => handleReturnRequest(order.id, order.status)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                            >
                              <Package className="w-4 h-4" />
                              Request Return
                            </button>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {selectedOrder?.id === order.id && (
                          <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-semibold text-slate-700 mb-2">Order Information</p>
                                <div className="space-y-1 text-slate-600">
                                  <p><span className="font-medium">Product ID:</span> {order.productId}</p>
                                  <p><span className="font-medium">Customer Email:</span> {order.customerEmail || "N/A"}</p>
                                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || "N/A"}</p>
                                </div>
                              </div>
                              {order.shippingAddress && (
                                <div>
                                  <p className="font-semibold text-slate-700 mb-2">Shipping Address</p>
                                  <div className="space-y-1 text-slate-600">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                    <p>{order.shippingAddress.country}</p>
                                    {order.customerPhone && <p>Phone: {order.customerPhone}</p>}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Help Section */}
          {userOrders.length > 0 && (
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="font-bebas text-xl text-slate-900 mb-3">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                If you have any questions about your order or need assistance, please contact our support team.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#ff8211] hover:text-[#ff8211] transition">
                  Contact Support
                </button>
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#ff8211] hover:text-[#ff8211] transition">
                  Track Shipment
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderTracking;
