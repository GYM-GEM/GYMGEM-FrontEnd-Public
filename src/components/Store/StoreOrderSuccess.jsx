import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import NavBar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

/**
 * StoreOrderSuccess Component
 * Success page after completing a store order
 */
const StoreOrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, total, customerName } = location.state || {};

  // Redirect if no order data
  if (!orders || orders.length === 0) {
    navigate('/stores');
    return null;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />

      <section className="w-full bg-background pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* SUCCESS CARD */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-12 text-center">
            
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="font-bebas text-4xl sm:text-5xl text-[#ff8211] mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-slate-700 mb-8">
              Thank you for your purchase, <span className="font-semibold">{customerName}</span>!
            </p>

            {/* Order Summary */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#ff8211]" />
                <h2 className="font-bebas text-2xl text-slate-900">Order Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-700">
                  <span>Number of Items:</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Order Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                    Pending
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold text-slate-900">
                  <span>Total Paid:</span>
                  <span className="text-[#ff8211]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Items Ordered:</h3>
                <div className="space-y-2">
                  {orders.map((order, index) => (
                    <div key={index} className="flex justify-between text-sm text-slate-700">
                      <span>{order.productName} (x{order.quantity})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                <strong>What's next?</strong> You will receive a confirmation email shortly. 
                Your order is being processed and will be shipped within 2-3 business days.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/my-orders" className="px-8 py-3 bg-[#ff8211] text-white rounded-lg font-semibold hover:bg-[#e67300] transition inline-flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                View My Orders
              </Link>
              <Link to="/stores" className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-[#ff8211] hover:text-[#ff8211] transition inline-flex items-center justify-center gap-2">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreOrderSuccess;
