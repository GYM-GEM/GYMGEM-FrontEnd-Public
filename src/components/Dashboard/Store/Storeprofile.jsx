import FooterDash from "../FooterDash";
import Navbar from "../../Navbar.jsx";
import { X, Clock, MapPin, Globe, Map as MapIcon, Mail, Phone, ShoppingBag, LayoutGrid, Loader2, Store, Layers, AlignLeft, Plus, Trash2, Edit, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import axiosInstance from "../../../utils/axiosConfig";
import UploadImage from "../../UploadImage";

const Storeprofile = () => {
  const navigate = useNavigate();
  const { id: storeId } = useParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);

  const [modals, setModals] = useState({
    editProfile: false,
    addBranch: false,
    editBranch: false
  });

  const [selectedBranch, setSelectedBranch] = useState(null);

  const [formData, setFormData] = useState({
    editProfile: {},
    branchForm: {}
  });

  // Fetch Store Data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      if (!storeId) return;

      const storeRes = await axiosInstance.get(`/api/stores/${storeId}`);
      setStoreData(storeRes.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [storeId]);


  // Modal handlers
  const openModal = (modalName, branch = null) => {
    if (modalName === "editProfile") {
      setFormData(prev => ({
        ...prev,
        editProfile: { ...storeData, phone_number: storeData.phone_number || "" }
      }));
    } else if (modalName === "addBranch") {
      setFormData(prev => ({
        ...prev,
        branchForm: {
          country: "", state: "", street: "", zip_code: "", phone_number: "",
          opening_time: "", closing_time: ""
        }
      }));
    } else if (modalName === "editBranch" && branch) {
      setSelectedBranch(branch);
      setFormData(prev => ({
        ...prev,
        branchForm: {
          ...branch,
          phone_number: branch.phone_number || "",
          opening_time: branch.opening_time?.substring(0, 5),
          closing_time: branch.closing_time?.substring(0, 5),
        }
      }));
    }
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    if (modalName === "editBranch") setSelectedBranch(null);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [formType]: { ...prev[formType], [name]: value }
    }));
  };

  // --- ACTIONS ---

  const handleSaveStoreProfile = async () => {
    try {
      const { name, profile_picture, description, store_type, phone_number } = formData.editProfile;
      const payload = { name, profile_picture, description, store_type, phone_number };

      const response = await axiosInstance.put(`/api/stores/${storeId}`, payload);
      setStoreData(prev => ({ ...prev, ...response.data }));

      closeModal("editProfile");
      showToast("Store profile updated!", { type: "success" });
    } catch (error) {
      console.error("Error updating store:", error);
      showToast("Failed to update store.", { type: "error" });
    }
  };

  const handleSaveBranch = async (isEdit) => {
    try {
      const { country, state, street, zip_code, phone_number, opening_time, closing_time } = formData.branchForm;
      const payload = {
        store_id: parseInt(storeId),
        country, state, street, zip_code, phone_number,
        opening_time: opening_time ? `${opening_time}:00` : null,
        closing_time: closing_time ? `${closing_time}:00` : null,
      };

      if (isEdit && selectedBranch) {
        await axiosInstance.put(`/api/stores/branches/${selectedBranch.id}/`, payload);
        showToast("Branch updated successfully!", { type: "success" });
      } else {
        await axiosInstance.post(`/api/stores/branches`, payload);
        showToast("Branch added successfully!", { type: "success" });
      }

      await fetchProfileData(); // Refresh all data to get updated branches
      closeModal(isEdit ? "editBranch" : "addBranch");
    } catch (error) {
      console.error("Error saving branch:", error);
      showToast("Failed to save branch.", { type: "error" });
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await axiosInstance.delete(`/api/stores/branches/${branchId}`);
      showToast("Branch deleted.", { type: "success" });
      fetchProfileData();
    } catch (error) {
      console.error("Error deleting branch:", error);
      showToast("Failed to delete branch.", { type: "error" });
    }
  };

  // Format helpers
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5); // "13:43:16..." -> "13:43"
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-[#ff8211]" />
      </div>
    );
  }

  const displayStore = storeData || {};
  const branches = displayStore.branches || [];
  const displayBranch = branches[0] || {
    country: "N/A",
    state: "N/A",
    street: "N/A",
    zip_code: "",
    phone: "N/A",
    opening_time: null,
    closing_time: null
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff8211] to-[#ffb347] p-6 md:p-8 text-white shadow-lg animate-fade-in">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start transition-all">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="absolute -inset-1 rounded-full bg-white/30 blur-md transition-all group-hover:bg-white/50" />
                <img
                  src={displayStore.profile_picture || "https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=300"}
                  alt={displayStore.name}
                  className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white/20 object-cover shadow-xl transition-transform group-hover:scale-105"
                />
              </div>
              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="font-bebas text-4xl md:text-6xl tracking-wide uppercase shadow-black/10 drop-shadow-sm">{displayStore.name}</h1>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm uppercase border border-white/10">
                    {displayStore.store_type}
                  </span>
                </div>
                <p className="text-white/90 max-w-2xl text-base leading-relaxed font-light">
                  {displayStore.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-white/80 pt-1">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {displayStore.email || "store@gymgem.com"}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Since {new Date(displayStore.created_at || Date.now()).getFullYear()}</span>
                </div>
              </div>
              {/* Edit Store Button */}
              <button
                onClick={() => openModal("editProfile")}
                className="rounded-full bg-white text-[#ff8211] px-6 py-2.5 text-sm font-bold shadow-md hover:bg-orange-50 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />  Edit Store
              </button>
            </div>
            {/* Decorative Patterns */}
            <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/5 blur-2xl pointer-events-none" />
          </div>

          {/* Main Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT: About Store & Stats */}
            <div className="space-y-6 lg:col-span-1">
              <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bebas text-2xl text-slate-800 mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#ff8211]" /> About Store
                </h3>
                <div className="space-y-4 text-slate-600 text-sm">
                  <p>{displayStore.description || "No description provided."}</p>
                </div>
              </section>
            </div>

            {/* RIGHT: Branch Management */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bebas text-3xl text-slate-800 flex items-center gap-2">
                  <MapIcon className="w-6 h-6 text-[#ff8211]" /> Our Branches
                  <span className="bg-[#ff8211]/10 text-[#ff8211] text-sm px-2 py-0.5 rounded-full font-sans font-bold">{branches.length}</span>
                </h3>
                <button
                  onClick={() => openModal("addBranch")}
                  className="bg-[#ff8211] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#e67300] transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Branch
                </button>
              </div>

              {/* Branch List */}
              <div className="grid gap-4 sm:grid-cols-2">
                {branches.length > 0 ? (
                  branches.map(branch => (
                    <div key={branch.id} className="group relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:border-[#ff8211]/30">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal("editBranch", branch)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteBranch(branch.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </div>

                      <div className="mb-3">
                        <div className="bg-orange-50 text-[#ff8211] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 leading-tight">{branch.street || "Unknown Street"}</h4>
                        <p className="text-sm text-slate-500">{branch.state}, {branch.country}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{branch.zip_code}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{formatTime(branch.opening_time)} - {formatTime(branch.closing_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{branch.phone_number || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No branches added yet.</p>
                    <button onClick={() => openModal("addBranch")} className="text-[#ff8211] font-bold text-sm mt-2 hover:underline">Add your first branch</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT STORE PROFILE MODAL */}
      {modals.editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bebas text-xl">Edit Store Profile</h2>
              <button onClick={() => closeModal("editProfile")}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex justify-center mb-4">
                <div className="space-y-2 text-center">
                  <img src={formData.editProfile.profile_picture} className="w-20 h-20 rounded-full object-cover mx-auto border" />
                  <UploadImage onUpload={(url) => setFormData(prev => ({ ...prev, editProfile: { ...prev.editProfile, profile_picture: url } }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Store Name</label>
                <input
                  name="name"
                  value={formData.editProfile.name || ""}
                  onChange={(e) => handleInputChange(e, "editProfile")}
                  className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Phone Number</label>
                <input
                  name="phone_number"
                  value={formData.editProfile.phone_number || ""}
                  onChange={(e) => handleInputChange(e, "editProfile")}
                  className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.editProfile.description || ""}
                  onChange={(e) => handleInputChange(e, "editProfile")}
                  className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Type</label>
                <select
                  name="store_type"
                  value={formData.editProfile.store_type || ""}
                  onChange={(e) => handleInputChange(e, "editProfile")}
                  className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211] bg-white"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <button onClick={() => closeModal("editProfile")} className="flex-1 py-2.5 rounded-xl border font-semibold hover:bg-slate-100">Cancel</button>
              <button onClick={handleSaveStoreProfile} className="flex-1 py-2.5 rounded-xl bg-[#ff8211] text-white font-semibold hover:bg-[#e67300]">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT BRANCH MODAL */}
      {(modals.addBranch || modals.editBranch) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bebas text-xl">{modals.editBranch ? "Edit Branch" : "Add New Branch"}</h2>
              <button onClick={() => closeModal(modals.editBranch ? "editBranch" : "addBranch")}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2 overflow-y-auto">
              <div className="col-span-full">
                <h3 className="text-[#ff8211] font-bold text-sm uppercase tracking-wider mb-2 border-b pb-1">Location</h3>
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Country *</label>
                <input name="country" value={formData.branchForm.country} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" placeholder="e.g. USA" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">State *</label>
                <input name="state" value={formData.branchForm.state} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" placeholder="e.g. California" />
              </div>
              <div className="col-span-full">
                <label className="text-sm font-bold mb-1 block">Street Address *</label>
                <input name="street" value={formData.branchForm.street} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" placeholder="e.g. 123 Main St" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Zip Code *</label>
                <input name="zip_code" value={formData.branchForm.zip_code} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" placeholder="e.g. 90210" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Phone Number *</label>
                <input name="phone_number" value={formData.branchForm.phone_number || ""} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" placeholder="+1 555 000 0000" />
              </div>

              <div className="col-span-full mt-2">
                <h3 className="text-[#ff8211] font-bold text-sm uppercase tracking-wider mb-2 border-b pb-1">Operating Hours</h3>
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Opening Time *</label>
                <input type="time" name="opening_time" value={formData.branchForm.opening_time} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Closing Time *</label>
                <input type="time" name="closing_time" value={formData.branchForm.closing_time} onChange={(e) => handleInputChange(e, "branchForm")} className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#ff8211]" />
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <button onClick={() => closeModal(modals.editBranch ? "editBranch" : "addBranch")} className="flex-1 py-2.5 rounded-xl border font-semibold hover:bg-slate-100">Cancel</button>
              <button onClick={() => handleSaveBranch(modals.editBranch)} className="flex-1 py-2.5 rounded-xl bg-[#ff8211] text-white font-semibold hover:bg-[#e67300]">{modals.editBranch ? "Update Branch" : "Add Branch"}</button>
            </div>
          </div>
        </div>
      )}

      <FooterDash />
    </>
  );
};

export default Storeprofile;
