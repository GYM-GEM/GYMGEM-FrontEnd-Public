import { useState, useEffect, useMemo } from "react";
import NavBarDashStore from "./NavBarDashStore.jsx";
import FooterDash from "../FooterDash.jsx";
import axiosInstance from "../../../utils/axiosConfig";
import { IoIosTrash } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { useToast } from "../../../context/ToastContext";

const StoreOrder = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    status: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Date");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/stores/orders"); // Assuming correct endpoint
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback/Silent fail -> showToast("Failed to load orders", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Edit Click
  const handleEdit = (order) => {
    setEditingId(order.id);
    setFormData({
      status: order.status
    });
  };

  // Handle Update Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/stores/orders/${editingId}`, {
        status: formData.status
      });
      showToast("Order status updated successfully", { type: "success" });
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      showToast("Failed to update status", { type: "error" });
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(`/api/stores/orders/${id}`);
        showToast("Order deleted successfully", { type: "success" });
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        showToast("Failed to delete order", { type: "error" });
      }
    }
  };

  // Filter and Sort Logic
  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      const buyerName = order.buyer_name || "";
      const orderId = order.id?.toString() || "";
      const productNames = order.order_items?.map(i => i.store_item_name).join(" ") || "";

      const matchesSearch =
        buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.includes(searchQuery.toLowerCase()) ||
        productNames.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "All" || order.status === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    if (sortOption === "Date") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "ID") {
      result.sort((a, b) => (a.id > b.id ? 1 : -1));
    }

    return result;
  }, [orders, searchQuery, filterStatus, sortOption]);

  return (
    <>
      <NavBarDashStore />
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* HEADER */}
          <section className="mb-8">
            <h1 className="font-bebas text-4xl text-[#ff8211] tracking-wide">Order Management</h1>
            <p className="text-sm text-slate-500">Track and manage customer orders.</p>
          </section>

          {/* CONTROLS */}
          <section className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <input
                type="search"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 pl-10 pr-4 focus:ring-2 focus:ring-[#ff8211] outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 focus:ring-2 focus:ring-[#ff8211] outline-none bg-white text-sm"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 focus:ring-2 focus:ring-[#ff8211] outline-none bg-white text-sm"
              >
                <option value="Date">Sort by Date</option>
                <option value="ID">Sort by ID</option>
              </select>
            </div>
          </section>

          {/* ORDERS TABLE */}
          <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Product(s)</th>
                    <th className="hidden md:table-cell px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          <div className="flex flex-col">
                            {order.order_items && order.order_items.map((item, idx) => (
                              <span key={item.id || idx} className="text-sm">
                                {item.store_item_name} (x{item.quantity})
                              </span>
                            ))}
                            {!order.order_items?.length && <span className="text-slate-400 italic">No items</span>}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-slate-600">
                          {order.buyer_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {parseFloat(order.total_price || 0).toFixed(2)} GEMs
                        </td>
                        <td className="px-6 py-4">
                          {editingId === order.id ? (
                            <select
                              value={formData.status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              className="border rounded px-2 py-1 text-sm bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                              }`}>
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            {editingId === order.id ? (
                              <>
                                <button
                                  onClick={handleUpdate}
                                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-slate-500 hover:text-slate-700 font-medium text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(order)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                                  title="Edit Status"
                                >
                                  <MdOutlineEdit size={20} />
                                </button>
                                <button
                                  onClick={() => handleDelete(order.id)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                  title="Delete"
                                >
                                  <IoIosTrash size={20} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        <p className="text-lg font-medium">No orders found.</p>
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

export default StoreOrder;
