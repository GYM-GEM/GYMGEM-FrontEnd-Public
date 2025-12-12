import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import NavBar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

/**
 * CartPage Component
 * Displays cart items with quantity controls and checkout button
 * Matches the existing project design system
 */
const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useContext(StoreContext);

  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setIsClearing(true);
      setTimeout(() => {
        clearCart();
        setIsClearing(false);
      }, 300);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = cart.length > 0 ? 10.00 : 0; // Flat rate shipping
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />
      
      <section className="w-full bg-background pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* HEADER */}
          <div className="mb-8">
            <Link
              to="/stores"
              className="text-[#ff8211] text-sm font-medium hover:underline inline-flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-bebas text-4xl sm:text-5xl tracking-tight text-[#ff8211]">
              Shopping Cart
            </h1>
            <p className="text-base text-[#555555] mt-2">
              {cart.length === 0 ? "Your cart is empty" : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>

          {cart.length === 0 ? (
            // EMPTY CART STATE
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
              <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-600 mb-6">Start adding some products to get started!</p>
              <button
                onClick={() => navigate('/stores')}
                className="bg-[#ff8211] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e67300] transition shadow-md"
              >
                Browse Products
              </button>
            </div>
          ) : (
            // CART WITH ITEMS
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CART ITEMS */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-[#ff8211] font-semibold uppercase mb-1">
                            {item.category}
                          </p>
                          <h3 className="font-bold text-slate-900 text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                              disabled={item.cartQuantity <= 1}
                              className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4 text-slate-700" />
                            </button>
                            <span className="text-lg font-semibold text-slate-900 min-w-[2rem] text-center">
                              {item.cartQuantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                              disabled={item.cartQuantity >= item.quantity}
                              className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-slate-700" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-slate-900">
                              ${(item.price * item.cartQuantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                              title="Remove from cart"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="w-full sm:w-auto text-red-600 hover:text-red-800 font-medium text-sm py-2 px-4 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                  {isClearing ? "Clearing..." : "Clear Cart"}
                </button>
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                  <h2 className="font-bebas text-2xl text-slate-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-[#ff8211]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/store-checkout')}
                    className="w-full bg-[#ff8211] text-white py-3 rounded-lg font-semibold hover:bg-[#e67300] transition shadow-md mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/stores')}
                    className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
                  >
                    Continue Shopping
                  </button>

                  {/* Promo Info */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                      Free shipping on orders over $100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;
