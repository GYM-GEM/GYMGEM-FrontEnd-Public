import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";
import NavBar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ShoppingCart } from "lucide-react";

const Store = () => {
  const navigate = useNavigate();
  const { products, addToCart, getCartItemCount } = useContext(StoreContext);
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [addedToCart, setAddedToCart] = useState(null); // For visual feedback
  
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
    {
      label: "Equipment",
      icon: "🏋️",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-blue-100 text-blue-800 shadow-md ring-2 ring-blue-300",
    },
    {
      label: "Apparel",
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
    const isPublished = p.status === 'Published';
    const matchesCategory = selectedFilter === "All Products" || p.category === selectedFilter;
    return isPublished && matchesCategory;
  });

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (product.quantity > 0) {
      addToCart(product, 1);
      // Show feedback
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 2000);
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <div className="bg-background text-foreground">
      <NavBar />

      {/* FLOATING CART BUTTON */}
      {cartItemCount > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className="fixed bottom-8 right-8 z-50 bg-[#ff8211] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#e67300] transition flex items-center justify-center group"
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
        <div className="mx-auto flex w-[80%] flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
          
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
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out ${
                      isActive
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

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group border border-slate-100">
                {/* Product Image - Clickable */}
                <Link to={`/store/product/${p.id}`} className="block">
                  <div className="h-48 bg-slate-200 overflow-hidden relative">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    {p.quantity < 5 && p.quantity > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                    {p.quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold tracking-wider">
                        SOLD OUT
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <p className="text-xs text-[#ff8211] font-semibold uppercase mb-1">{p.category}</p>
                  {/* Product Title - Clickable */}
                  <Link to={`/store/product/${p.id}`}>
                    <h3 className="font-bold text-slate-900 mb-1 truncate hover:text-[#ff8211] transition cursor-pointer">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3 h-10">{p.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-slate-900">${p.price}</span>
                    <button 
                      disabled={p.quantity === 0}
                      onClick={() => handleAddToCart(p)}
                      className={`px-3 py-1.5 rounded text-sm transition font-medium ${
                        addedToCart === p.id
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-[#ff8211]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {addedToCart === p.id ? '✓ Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-xl">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Store;
