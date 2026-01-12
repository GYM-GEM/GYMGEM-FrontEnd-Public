import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";
import NavBar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ShoppingCart, Heart, Eye, ShoppingBag } from "lucide-react";
import QuickViewModal from "../components/Store/QuickViewModal.jsx";
import axiosInstance from "../utils/axiosConfig.js";

const Store = () => {
  const navigate = useNavigate();
  const { addToCart, getCartItemCount, toggleWishlist, isInWishlist } = useContext(StoreContext);
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [addedToCart, setAddedToCart] = useState(null); // For visual feedback
  const [wishlistAnimation, setWishlistAnimation] = useState(null); // For wishlist animation
  const [quickViewProduct, setQuickViewProduct] = useState(null); // For Quick View Modal

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/stores/items`);

        // Handle both direct array responses and paginated { results: [] } responses
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);

        // Sort by ID descending to show recent products first
        const sortedProducts = [...data].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        setProducts(sortedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStoreProducts();
  }, []);
  const filterOptions = [
    {
      label: "All Products",
      icon: "🛍️",
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
      hoverColor: "hover:bg-primary/10 hover:text-primary hover:shadow-sm",
      activeColor: "bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20",
    },
    {
      label: "Supplements",
      icon: "💊",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-green-100 text-green-800 shadow-md ring-2 ring-green-300",
    },
    // {
    //   label: "Equipment",
    //   icon: "🏋️",
    //   bgColor: "bg-blue-50",
    //   textColor: "text-blue-700",
    //   hoverColor: "hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5",
    //   activeColor: "bg-blue-100 text-blue-800 shadow-md ring-2 ring-blue-300",
    // },
    {
      label: "Clothes",
      icon: "👕",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      hoverColor: "hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-red-100 text-red-800 shadow-md ring-2 ring-red-300",
    },
    {
      label: "Accessories",
      icon: "🎒",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      hoverColor: "hover:bg-amber-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-amber-100 text-amber-800 shadow-md ring-2 ring-amber-300",
    },
  ];

  const filteredProducts = products.filter(p => {
    // If status is missing, show it. If present, only show 'Published' (case-insensitive)
    const isPublished = !p.status || p.status.toLowerCase() === 'published';

    // Normalize category for comparison (handle case differences)
    const normalizedCategory = p.category ? p.category.toLowerCase() : "";
    const normalizedFilter = selectedFilter === "All Products" ? "All Products" : selectedFilter.toLowerCase();

    const matchesCategory = selectedFilter === "All Products" || normalizedCategory === normalizedFilter;

    return isPublished && matchesCategory;
  });

  // Handle Add to Cart
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const stock = product.total_quantity || 0;
    if (stock > 0) {
      addToCart(product, 1);
      // Show feedback
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 2000);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    // Show animation feedback
    setWishlistAnimation(product.id);
    setTimeout(() => setWishlistAnimation(null), 600);
  };

  const cartItemCount = getCartItemCount();

  return (
    <div className="bg-background text-foreground">
      <NavBar />

      {/* FLOATING CART BUTTON */}
      {cartItemCount > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className="fixed bottom-28 right-8 z-50 bg-[#ff8211] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#e67300] transition flex items-center justify-center group"
          aria-label="View cart"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
            {cartItemCount}
          </span>
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            View Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
          </span>
        </button>
      )}

      <section className="w-full bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">

          {/* HEADER */}
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Store
            </p>
            <h1 className="font-bebas text-4xl tracking-tight text-foreground sm:text-5xl text-[#ff8211]">
              Fuel Your Journey
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg text-[#555555]">
              Discover premium equipment, supplements, and apparel designed to help you reach your fitness goals.
            </p>
          </header>

          {/* FILTERS */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Filter by category:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((option) => {
                const isActive = selectedFilter === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedFilter(option.label)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out ${isActive
                      ? option.activeColor
                      : `${option.bgColor} ${option.textColor} ${option.hoverColor}`
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95`}
                  >
                    <span className="text-sm leading-none">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl h-80 animate-pulse border border-slate-100" />
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100 mt-8">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-[#ff8211] hover:underline font-semibold"
              >
                Try refreshing the page
              </button>
            </div>
          )}

          {/* PRODUCTS GRID */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#ff8211]/30 hover:-translate-y-1 relative"
                >
                  {/* Wishlist Heart Icon - Top Right */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, p)}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full backdrop-blur-md bg-white/80 border border-white/50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${wishlistAnimation === p.id ? 'animate-ping' : ''
                      }`}
                    aria-label={isInWishlist(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${isInWishlist(p.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-slate-600 hover:text-red-500'
                        }`}
                    />
                  </button>

                  {/* Product Image - Clickable */}
                  <Link to={`/store/product/${p.id}`} className="block relative">
                    <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                      {p.item_image ? (
                        <img
                          src={p.item_image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                          No Image
                        </div>
                      )}

                      {/* Stock Badges */}
                      {(p.total_quantity || 0) < 5 && (p.total_quantity || 0) > 0 && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Low Stock
                        </span>
                      )}
                      {(p.total_quantity || 0) === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-bold tracking-wider text-lg">
                          SOLD OUT
                        </div>
                      )}

                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(p);
                          }}
                          className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-white transition shadow-lg transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Eye className="w-4 h-4" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block text-xs text-[#ff8211] font-bold uppercase tracking-wide bg-[#ff8211]/10 px-2 py-1 rounded">
                        {p.category}
                      </span>
                    </div>

                    {/* Product Title - Clickable */}
                    <Link to={`/store/product/${p.id}`}>
                      <h3 className="font-bold text-slate-900 mb-2 text-lg hover:text-[#ff8211] transition cursor-pointer line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                      {p.description}
                    </p>

                    {/* Price and Actions */}
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-[#ff8211]">
                          {parseFloat(p.price || 0).toFixed(2)} GEMs
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          disabled={(p.total_quantity || 0) === 0}
                          onClick={(e) => handleAddToCart(e, p)}
                          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${addedToCart === p.id
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-[#ff8211] hover:to-[#e67300] shadow-md hover:shadow-lg hover:shadow-[#ff8211]/30'
                            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-slate-900 disabled:hover:to-slate-800`}
                        >
                          {addedToCart === p.id ? (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xl font-medium">No products found for this filter.</p>
              <p className="text-slate-400 text-sm mt-2">Try selecting a different category or wait for new items.</p>
            </div>
          )}
        </div>
      </section>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <Footer />
    </div>
  );
};

export default Store;
