import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Navbar.jsx";
import FooterDash from "../FooterDash.jsx";
import { StoreContext } from "../../../context/StoreContext.jsx";
import axiosInstance from "../../../utils/axiosConfig";
import { useToast } from "../../../context/ToastContext";
import { useParams } from "react-router-dom";
import { Package, DollarSign, ShoppingCart, TrendingUp, Clock, ChevronRight, Plus, Archive, ExternalLink, Box, X } from "lucide-react";

const StoreDashboard = () => {
  const { addProduct, updateProduct } = useContext(StoreContext); // Keep actions if needed, or implement local
  const { showToast } = useToast();
  const { id } = useParams();

  // Local State for dynamic data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [loading, setLoading] = useState(true);

  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", quantity: "", price: "", category: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!id) return; // Wait for ID

      const [productsRes, ordersRes, profileRes] = await Promise.all([
        axiosInstance.get('/api/stores/my-items'),
        axiosInstance.get('/api/stores/orders'),
        axiosInstance.get(`/api/stores/${id}`)
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      // Set store name from profile response
      if (profileRes.data) {
        if (profileRes.data.name) setStoreName(profileRes.data.name);
        if (profileRes.data.store_type) setStoreType(profileRes.data.store_type);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Stats Calculations from Real Data
  const totalProducts = products.length;
  // Assuming 'status' field exists and matches these values (case insensitive often safer)
  const activeOrders = orders.filter(o =>
    o.status?.toLowerCase() === 'pending' || o.status?.toLowerCase() === 'processing'
  ).length;

  // Sales Today
  const today = new Date().toDateString();
  const salesToday = orders
    .filter(o => {
      if (!o.created_at && !o.date) return false;
      const orderDate = new Date(o.created_at || o.date).toDateString();
      return orderDate === today && o.status?.toLowerCase() === 'delivered'; // Using delivered for finalized sales now? or 'completed'? Let's stick to user's 'completed' or 'delivered' -> sticking to mapped value logic. But technically sales accumulate on payment usually. Let's assume 'delivered' or 'completed'.
    })
    .reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
  // Uses total_price from order, fallback to 0

  const ordersToday = orders.filter(o => {
    if (!o.created_at && !o.date) return false;
    return new Date(o.created_at || o.date).toDateString() === today;
  }).length;

  // Recent Items
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at || b.dateAdded || 0) - new Date(a.created_at || a.dateAdded || 0))
    .slice(0, 3);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
    .slice(0, 3);

  // Handlers
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setProductForm({ name: "", quantity: "", price: "", category: "" });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // await axiosInstance.put(...) // If implementing local, otherwise use context
        await updateProduct(editingProduct.id, productForm);
      } else {
        // await axiosInstance.post(...) // If implementing local
        await addProduct(productForm);
      }
      setShowProductModal(false);
      fetchData(); // Refresh data after mutation
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 text-slate-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* HEADER */}
              <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="font-bebas text-4xl text-slate-900 tracking-wide mb-2">
                    Store Dashboard
                  </h1>
                  <p className="text-slate-500">
                    Welcome back! Here's what's happening in your store today.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Package className="w-40 h-40" />
                </div>
              </section>

              {/* STATS CARDS */}
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Total Products */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Box className="w-24 h-24 text-[#ff8211]" />
                    </div>
                    <div className="flex flex-col relative z-10">
                      <div className="mb-4 bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-[#ff8211]">
                        <Package className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
                      <p className="mt-1 font-bebas text-4xl text-slate-800 group-hover:text-[#ff8211] transition-colors">{totalProducts}</p>
                    </div>
                  </div>

                  {/* Sales Today */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp className="w-24 h-24 text-green-500" />
                    </div>
                    <div className="flex flex-col relative z-10">
                      <div className="mb-4 bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sales Today</p>
                      <p className="mt-1 font-bebas text-4xl text-slate-800 group-hover:text-green-600 transition-colors">{salesToday.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Orders Today */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShoppingCart className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="flex flex-col relative z-10">
                      <div className="mb-4 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600">
                        <Clock className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Orders Today</p>
                      <p className="mt-1 font-bebas text-4xl text-slate-800 group-hover:text-blue-600 transition-colors">{ordersToday}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* RECENT PRODUCTS */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#ff8211] p-1.5 rounded-lg text-white"><Package className="w-5 h-5" /></div>
                    <h2 className="font-bebas text-2xl text-slate-800">Recent Products</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recentProducts.map(p => (
                    <div key={p.id} className="group bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-default relative overflow-hidden">
                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#ff8211] group-hover:text-white transition-colors">
                          <Box className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wide group-hover:bg-[#ff8211]/10 group-hover:text-[#ff8211] transition-colors">{p.category || "Item"}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 truncate mb-1 relative z-10">{p.name || p.item_name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 relative z-10">
                        <Clock className="w-3 h-3" />
                        {new Date(p.created_at || p.dateAdded || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {recentProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <Archive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No products added yet.</p>
                      <button onClick={handleAddProductClick} className="text-[#ff8211] font-bold text-sm mt-2 hover:underline">Add your first product</button>
                    </div>
                  )}
                </div>
              </section>

              {/* RECENT ORDERS */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-1.5 rounded-lg text-white"><ShoppingCart className="w-5 h-5" /></div>
                    <h2 className="font-bebas text-2xl text-slate-800">Recent Orders</h2>
                  </div>
                  <Link to="/store/order" className="text-sm font-semibold text-[#ff8211] hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
                </div>
                <div className="space-y-4">
                  {recentOrders.map(o => {
                    const firstItem = o.order_items && o.order_items.length > 0 ? o.order_items[0].store_item_name : "No items";
                    const itemCount = o.order_items ? o.order_items.length : 0;
                    const displayTitle = itemCount > 1 ? `${firstItem} +${itemCount - 1} more` : firstItem;

                    return (
                      <div key={o.id} className="flex items-center justify-between bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{o.id}</span>
                              <p className="text-sm font-bold text-slate-800">{displayTitle}</p>
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              {o.buyer_name || "Unknown Buyer"}
                              <span className="text-slate-300">•</span>
                              {new Date(o.created_at || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${o.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status?.toLowerCase() === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                            o.status?.toLowerCase() === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              o.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                          }`}>
                          {o.status || 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                  {recentOrders.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-slate-500 font-medium">No recent orders.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* PROFILE CARD */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Archive className="w-32 h-32 text-[#ff8211]" />
                </div>
                <h4 className="font-bebas text-2xl text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-[#ff8211] rounded-full"></div> Store Profile
                </h4>
                <div className="relative z-10">
                  <p className="font-bold text-xl text-slate-900 leading-tight mb-1">{storeName || "GymGem Store"}</p>
                  {storeType && (
                    <p className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 mb-2 border border-slate-200">
                      {storeType.replace(/_/g, " ")}
                    </p>
                  )}


                  <Link
                    to={`/store/profile/${id}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#ff8211] bg-orange-50 px-4 py-2 rounded-xl hover:bg-[#ff8211] hover:text-white transition-all shadow-sm"
                  >
                    View Profile <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h4 className="font-bebas text-2xl text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-slate-800 rounded-full"></div> Quick Actions
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={handleAddProductClick}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#ff8211] hover:text-white group transition-all duration-300 text-slate-700 font-semibold text-sm"
                  >
                    <span className="flex items-center gap-3"><Plus className="w-5 h-5 text-[#ff8211] group-hover:text-white" /> Add New Product</span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>

                  <Link to="/store/order" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-500 hover:text-white group transition-all duration-300 text-slate-700 font-semibold text-sm">
                    <span className="flex items-center gap-3"><ShoppingCart className="w-5 h-5 text-blue-500 group-hover:text-white" /> View Orders</span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="font-bebas text-3xl text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-slate-500 text-sm">Fill in the details below to add a product to your inventory.</p>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                  <input
                    required
                    className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8211] transition-all bg-slate-50 focus:bg-white"
                    placeholder="e.g. Whey Protein"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                    <input
                      required
                      type="number"
                      className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8211] transition-all bg-slate-50 focus:bg-white"
                      placeholder="0"
                      value={productForm.quantity}
                      onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (GEMs)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8211] transition-all bg-slate-50 focus:bg-white"
                      placeholder="0.00"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8211] transition-all bg-slate-50 focus:bg-white appearance-none"
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-[#ff8211] text-white rounded-xl font-bold hover:bg-[#e67300] shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <FooterDash />
    </>
  );
};

export default StoreDashboard;
