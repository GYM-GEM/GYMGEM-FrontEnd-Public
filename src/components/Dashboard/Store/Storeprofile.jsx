import FooterDash from "../FooterDash";
import NavBarDashStore from "./NavBarDashStore";
import { X, Clock, MapPin, Globe, Map as MapIcon, Mail, Phone, ShoppingBag, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";

const Storeprofile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Load initial data from localStorage or use defaults
  const [storeData, setStoreData] = useState(() => {
    const savedProfile = localStorage.getItem("storeProfile");
    const savedBranch = localStorage.getItem("storeBranch");
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    const branch = savedBranch ? JSON.parse(savedBranch) : {};

    return {
      name: profile.name || "GymGem Store",
      email: profile.email || "info@gymgemstore.com",
      phone: "+20 100 987 6543", // Default not in form
      avatar: profile.profile_picture || "https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: profile.description || "Your one-stop shop for premium gym equipment, supplements, and athletic wear.",
      store_type: profile.store_type || "Supplements",

      // Branch Data
      opening_time: branch.opening_time || "09:00",
      closing_time: branch.closing_time || "22:00",
      country: branch.country || "Egypt",
      state: branch.state || "Cairo",
      city: branch.city || "Cairo", // Used in location string
      street: branch.street || "Nasr City",
      zip_code: branch.zip_code || "11765",

      // Defaults
      joined: "Joined 2024",
      linkedin: "linkedin.com/company/gymgem",
      categories: ["Supplements", "Equipment", "Sportswear"]
    };
  });

  const [modals, setModals] = useState({
    editProfile: false,
  });

  const [formData, setFormData] = useState({
    editProfile: { ...storeData },
  });

  // Effect to update local storage when storeData changes (optional syncing)
  useEffect(() => {
    // We don't auto-save back to localStorage here to avoid overwriting form data with defaults 
    // unless explicitly saved via edit.
  }, [storeData]);

  // Modal handlers
  const openModal = (modalName) => {
    if (modalName === "editProfile") {
      setFormData((prev) => ({
        ...prev,
        editProfile: { ...storeData },
      }));
    }
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  // Edit Profile handlers
  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      editProfile: { ...prev.editProfile, [name]: value },
    }));
  };

  // Avatar upload for Edit Modal
  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        editProfile: { ...prev.editProfile, avatar: reader.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updated = { ...formData.editProfile };
    setStoreData(updated);

    // Update persistant storage to reflect edits
    const profilePayload = {
      name: updated.name,
      profile_picture: updated.avatar,
      description: updated.bio,
      store_type: updated.store_type
    };
    const branchPayload = {
      opening_time: updated.opening_time,
      closing_time: updated.closing_time,
      country: updated.country,
      state: updated.state,
      street: updated.street,
      zip_code: updated.zip_code
    };

    localStorage.setItem("storeProfile", JSON.stringify(profilePayload));
    localStorage.setItem("storeBranch", JSON.stringify(branchPayload));

    closeModal("editProfile");
    showToast("Store profile updated successfully!", { type: "success" });
  };


  return (
    <>
      <NavBarDashStore />

      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-fade-in space-y-8">

          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff8211] to-[#ffb347] p-8 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-white/30 blur-md transition-all group-hover:bg-white/50" />
                <img
                  src={storeData.avatar}
                  alt={storeData.name}
                  className="relative h-32 w-32 rounded-full border-4 border-white/20 object-cover shadow-xl transition-transform group-hover:scale-105"
                />
              </div>
              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="font-bebas text-4xl md:text-5xl tracking-wide">{storeData.name}</h1>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    {storeData.store_type}
                  </span>
                </div>
                <p className="text-white/90 max-w-2xl text-sm md:text-base leading-relaxed">
                  {storeData.bio}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-sm font-medium text-white/80">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {storeData.street}, {storeData.state}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {storeData.opening_time} - {storeData.closing_time}</span>
                </div>
              </div>
              {/* Edit Button */}
              <div>
                <button
                  onClick={() => openModal("editProfile")}
                  className="rounded-full bg-white text-[#ff8211] px-6 py-2.5 text-sm font-bold shadow-md hover:bg-orange-50 hover:scale-105 transition-all active:scale-95"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            {/* Decorative Pattern */}
            <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-0 bottom-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/5 blur-2xl" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Contact & Location */}
            <div className="space-y-6 md:col-span-1">
              <section className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bebas text-2xl text-[#ff8211] mb-4 flex items-center gap-2">
                  <MapIcon className="w-5 h-5" /> Location
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ff8211]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Country</p>
                      <p className="font-medium">{storeData.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ff8211]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Address</p>
                      <p className="font-medium leading-tight">{storeData.street}<br />{storeData.state}, {storeData.zip_code}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bebas text-2xl text-[#ff8211] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ff8211]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium truncate">{storeData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ff8211]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{storeData.phone}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6 md:col-span-2">
              {/* Store Details */}
              <section className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShoppingBag className="w-32 h-32 rotate-12" />
                </div>
                <h3 className="font-bebas text-2xl text-[#ff8211] mb-4 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" /> About Store
                </h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Bio</p>
                    <p className="text-sm leading-relaxed text-foreground/80">{storeData.bio}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Joined</p>
                      <p className="font-semibold">{storeData.joined}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Store Type</p>
                      <p className="font-semibold">{storeData.store_type}</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      {/* EDIT PROFILE MODAL */}
      {modals.editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-bold font-bebas tracking-wide text-foreground">Edit Profile</h2>
              <button
                onClick={() => closeModal("editProfile")}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Avatar Edit */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                  <img
                    src={formData.editProfile.avatar}
                    alt="preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Change</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Name</label>
                  <input
                    name="name"
                    value={formData.editProfile.name}
                    onChange={handleEditProfileChange}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Type</label>
                  <select
                    name="store_type"
                    value={formData.editProfile.store_type}
                    onChange={handleEditProfileChange}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Supplements">Supplements</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="bio"
                    value={formData.editProfile.bio}
                    onChange={handleEditProfileChange}
                    rows={3}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-4 text-[#ff8211]">Branch Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opening Time</label>
                    <input type="time" name="opening_time" value={formData.editProfile.opening_time} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Closing Time</label>
                    <input type="time" name="closing_time" value={formData.editProfile.closing_time} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street</label>
                    <input name="street" value={formData.editProfile.street} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <input name="state" value={formData.editProfile.state} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Zip Code</label>
                    <input name="zip_code" value={formData.editProfile.zip_code} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <input name="country" value={formData.editProfile.country} onChange={handleEditProfileChange} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex gap-3">
              <button onClick={handleSaveProfile} className="flex-1 rounded-xl bg-[#ff8211] px-4 py-2 text-sm font-bold text-white hover:bg-[#e67300] transition-colors">Save Changes</button>
              <button onClick={() => closeModal("editProfile")} className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <FooterDash />
    </>
  );
};

export default Storeprofile;
