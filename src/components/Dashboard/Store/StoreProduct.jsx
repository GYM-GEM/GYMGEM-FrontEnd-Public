import { useContext, useState, useMemo, useEffect } from "react";
import NavBarDashStore from "./NavBarDashStore.jsx";
import FooterDash from "../FooterDash.jsx";
import { StoreContext } from "../../../context/StoreContext.jsx";
import { IoIosTrash } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import UploadImage from "../../UploadImage.jsx";
import axiosInstance from "../../../utils/axiosConfig.js";
import { useToast } from "../../../context/ToastContext";

const StoreProdact = () => {
  const { showToast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts } = useContext(StoreContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "supplements",
    quantity: "",
    price: "",
    description: "",
    image: "",
    status: "Draft",
    brand: "",
    expiration_date: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      category: "supplements",
      quantity: "",
      price: "",
      description: "",
      image: "",
      status: "Draft",
      brand: "",
      expiration_date: ""
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format data for backend
    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price.toString(),
      category: formData.category.toLowerCase(),
      brand: formData.brand,
      expiration_date: formData.expiration_date,
      inventory: [
        {
          quantity: parseInt(formData.quantity)
        }
      ]
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }
      resetForm();
    } catch (error) {
      alert("Failed to save product. Please try again.");
    }
  };

  // Handle Edit Click
  const handleEdit = (product) => {
    setEditingId(product.id);
    // Map product data to form data structure
    setFormData({
      name: product.name || "",
      category: product.category || "supplements",
      quantity: product.inventory?.[0]?.quantity || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      status: product.status || "Draft",
      brand: product.brand || "",
      expiration_date: product.expiration_date || ""
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete Click
  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/stores/items/${id}`);
      console.log(res);
      showToast("Product deleted successfully", { type: "success" });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.log(error);
      showToast("Failed to delete product. Please try again.", { type: "error" });
    }

  };

  // Toggle Status
  const toggleStatus = (product) => {
    const newStatus = product.status === 'Published' ? 'Draft' : 'Published';
    updateProduct(product.id, { ...product, status: newStatus });
  };

  // Filter and Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || product.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, filterStatus]);

  return (
    <>
      <NavBarDashStore />
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* HEADER & CONTROLS */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-bebas text-4xl text-[#ff8211] tracking-wide">Product Management</h1>
                <p className="text-sm text-slate-500">Manage your store inventory and visibility.</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(!showAddForm);
                }}
                className="bg-[#ff8211] text-white px-6 py-2 rounded-xl font-semibold shadow-sm hover:bg-[#e67300] transition flex items-center gap-2 w-fit"
              >
                {showAddForm ? "❌ Cancel" : "➕ Add Product"}
              </button>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-200 pl-10 pr-4 focus:ring-2 focus:ring-[#ff8211] outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 px-4 focus:ring-2 focus:ring-[#ff8211] outline-none bg-white"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </section>

          {/* ADD/EDIT FORM */}
          {showAddForm && (
            <section className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="font-bebas text-2xl text-slate-900 mb-6 border-b pb-2">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Product Name *</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition"
                      placeholder="e.g. Whey Protein"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Category *</label>
                      <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="supplements">Supplements</option>
                        <option value="equipment">Equipment</option>
                        <option value="apparel">Apparel</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition bg-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Price (GEMs) *</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Quantity *</label>
                      <input
                        required
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Brand *</label>
                      <input
                        required
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition"
                        placeholder="e.g. Optimum Nutrition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Expiration Date *</label>
                      <input
                        required
                        type="date"
                        name="expiration_date"
                        value={formData.expiration_date}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Product Image</label>
                    <UploadImage
                      acceptTypes="image/*"
                      onUpload={(url) => {
                        setFormData(prev => ({ ...prev, image: url }));
                      }}
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-xs text-slate-600 mb-1">Current Image:</p>
                        <p className="text-xs text-slate-500 break-all">{formData.image}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-[#ff8211] outline-none transition resize-none"
                      placeholder="Enter product description..."
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#ff8211] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#e67300] transition shadow-md"
                    >
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          {/* PRODUCT LIST TABLE */}
          <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="hidden md:table-cell px-6 py-4">Brand</th>
                    <th className="hidden lg:table-cell px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 max-w-[250px]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                              {p.image ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Img</div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-semibold text-slate-800 truncate" title={p.name}>{p.name}</p>
                              <p className="text-xs text-slate-500 truncate" title={p.description}>{p.description || "No description"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{p.brand || "—"}</span>
                            <span className="text-[10px] text-slate-400">Exp: {p.expiration_date || "N/A"}</span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 text-sm text-slate-600 capitalize">{p.category}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {parseFloat(p.price || 0).toFixed(2)} GEMs
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${p.total_quantity < 10 ? 'text-red-600' : 'text-slate-600'}`}>
                            {p.total_quantity || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(p)}
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition ${(p.status === 'Published')
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                          >
                            {p.status || "Draft"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(p)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                              title="Edit"
                            >
                              <MdOutlineEdit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <IoIosTrash size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                        <p className="text-lg font-medium">No products found.</p>
                        <p className="text-sm">Try adjusting your search or add a new product.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default StoreProdact;
