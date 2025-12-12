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

  // Fetch product details from localStorage (temporary - will use API later)
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get products from localStorage
        const savedProducts = localStorage.getItem('products');
        
        if (!savedProducts) {
          throw new Error('No products found in storage');
        }

        const productsArray = JSON.parse(savedProducts);
        const foundProduct = productsArray.find(p => p.id === id);

        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.message || "Failed to load product details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Add to Cart with Quantity
  const handleAddToCart = () => {
    if (product && product.quantity >= quantity) {
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
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 text-center p-8">
                      <Package className="w-24 h-24 mx-auto mb-4" />
                      <p>No Image Available</p>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product.quantity < 5 && product.quantity > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg font-semibold">
                      Only {product.quantity} left!
                    </span>
                  )}
                  {product.quantity === 0 && (
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
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

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
                  <span className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
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
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
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
                  disabled={product.quantity === 0 || quantity > product.quantity}
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
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === "description"
                    ? "border-[#ff8211] text-[#ff8211]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === "specifications"
                    ? "border-[#ff8211] text-[#ff8211]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === "reviews"
                    ? "border-[#ff8211] text-[#ff8211]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Reviews ({reviews.length})
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

              {activeTab === "specifications" && (
                <div>
                  <h3 className="font-bebas text-2xl text-slate-900 mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Category:</span>
                      <span className="font-semibold text-slate-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">SKU:</span>
                      <span className="font-semibold text-slate-900">{product.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Stock Status:</span>
                      <span className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Weight:</span>
                      <span className="font-semibold text-slate-900">-</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bebas text-2xl text-slate-900">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">{averageRating.toFixed(1)} out of 5</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#ff8211] flex items-center justify-center text-white font-semibold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{review.name}</p>
                              <p className="text-xs text-slate-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
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
                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
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
