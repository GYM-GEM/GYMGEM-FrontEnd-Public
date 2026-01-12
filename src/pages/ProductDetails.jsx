import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";
import NavBar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  AlertCircle,
  Heart,
  Star,
  Minus,
  Plus,
  TrendingUp
} from "lucide-react";
import axiosInstance from "../utils/axiosConfig.js";

/**
 * ProductDetails Component
 * Comprehensive product details page with tabs, reviews, and related products
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, products } = useContext(StoreContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/api/stores/items/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Add to Cart with Quantity
  const handleAddToCart = () => {
    if (product && product.total_quantity >= quantity) {
      addToCart(product, quantity);
      setAddedToCart(true);
      // Button will permanently change to "View Cart & Checkout"
    }
  };

  // Toggle Favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Get related products (same category)
  const relatedProducts = products
    ?.filter(p => p.category === product?.category && p.id !== product?.id && p.status === 'Published')
    .slice(0, 4) || [];

  // Mock reviews data
  const reviews = [
    { id: 1, name: "John Doe", rating: 5, date: "2 days ago", comment: "Excellent product! Highly recommend for anyone serious about fitness." },
    { id: 2, name: "Jane Smith", rating: 4, date: "1 week ago", comment: "Great quality, though a bit pricey. Worth it for the results." },
    { id: 3, name: "Mike Johnson", rating: 5, date: "2 weeks ago", comment: "Best purchase I've made this year. Amazing results!" },
  ];

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  // Loading Skeleton (simplified)
  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <NavBar />
        <section className="w-full bg-background pt-24 pb-16">
          <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <NavBar />
        <section className="w-full bg-background pt-24 pb-16">
          <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/stores" className="text-[#ff8211] text-sm font-medium hover:underline inline-flex items-center gap-1 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Product</h2>
              <p className="text-red-700 mb-6">{error || "Product not found"}</p>
              <button onClick={() => navigate("/stores")} className="bg-[#ff8211] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e67300] transition">
                Return to Store
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />

      <section className="w-full bg-background pt-24 pb-16">
        <div className="mx-auto w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb / Back Button */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/stores" className="text-slate-600 hover:text-[#ff8211] transition">Store</Link>
            <span className="text-slate-400">/</span>
            <Link to="/stores" className="text-slate-600 hover:text-[#ff8211] transition">{product.category}</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">{product.name}</span>
          </div>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

            {/* Product Image */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden aspect-square">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
                  {product.item_image ? (
                    <img src={product.item_image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 text-center p-8">
                      <Package className="w-24 h-24 mx-auto mb-4" />
                      <p>No Image Available</p>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.total_quantity < 5 && product.total_quantity > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg font-semibold">
                      Only {product.total_quantity} left!
                    </span>
                  )}
                  {product.total_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold tracking-wider">SOLD OUT</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Favorite */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#ff8211] font-semibold uppercase tracking-wide">
                  {product.category}
                </p>
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Title */}
              <h1 className="font-bebas text-4xl sm:text-5xl text-slate-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
    

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#ff8211]">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-slate-600 leading-relaxed mb-6">
                {product.description || "No description available."}
              </p>

              {/* Availability */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Availability:</span>
                  <span className={`font-semibold ${product.total_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.total_quantity > 0 ? `${product.total_quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.total_quantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition"
                    >
                      <Minus className="w-4 h-4 text-slate-700" />
                    </button>
                    <span className="text-xl font-semibold text-slate-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.total_quantity, quantity + 1))}
                      disabled={quantity >= product.total_quantity}
                      className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart / View Cart Button */}
              {addedToCart ? (
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full py-4 rounded-lg font-semibold text-lg transition shadow-md flex items-center justify-center gap-2 mb-4 bg-[#ff8211] text-white hover:bg-[#e67300]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>View Cart & Checkout</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.total_quantity === 0 || quantity > product.total_quantity}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition shadow-md flex items-center justify-center gap-2 mb-4 bg-[#ff8211] text-white hover:bg-[#e67300] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
                </button>
              )}

              {/* Continue Shopping Button */}
              <button
                onClick={() => navigate('/stores')}
                className="w-full py-4 rounded-lg font-semibold text-lg transition border-2 border-slate-300 text-slate-700 hover:border-[#ff8211] hover:text-[#ff8211] hover:bg-slate-50 flex items-center justify-center gap-2 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>


              {/* Benefits */}
              <div className="pt-6 border-t border-slate-200">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Free shipping on orders over $100</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Secure checkout with SSL encryption</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-16">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-4 font-semibold transition border-b-2 ${activeTab === "description"
                  ? "border-[#ff8211] text-[#ff8211]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
              >
                Description
              </button>
    
         
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <h3 className="font-bebas text-2xl text-slate-900 mb-4">Product Description</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {product.description || "No detailed description available."}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    This premium {product.category.toLowerCase()} product is designed to help you achieve your fitness goals.
                    Made with high-quality materials and backed by our satisfaction guarantee.
                  </p>
                </div>
              )}

           

         
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-[#ff8211]" />
                <h2 className="font-bebas text-3xl text-slate-900">Related Products</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/store/product/${relatedProduct.id}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-slate-100 group"
                  >
                    <div className="h-48 bg-slate-200 overflow-hidden relative">
                      {relatedProduct.item_image ? (
                        <img
                          src={relatedProduct.item_image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#ff8211] font-semibold uppercase mb-1">{relatedProduct.category}</p>
                      <h3 className="font-bold text-slate-900 mb-1 truncate group-hover:text-[#ff8211] transition">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-slate-900">${relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
