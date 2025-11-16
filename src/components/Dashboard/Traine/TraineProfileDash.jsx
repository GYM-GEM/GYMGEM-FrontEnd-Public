import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { Lock, CreditCard, LogOut, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TraineProfileDash = () => {
  const navigate = useNavigate();

  // State management
  const [trainerData, setTrainerData] = useState({
    name: "Mahmoud Gado",
    email: "mahmoudgado@gmail.com",
    location: "Cairo, Egypt",
    phone: "+20 100 1234567",
    job: "Trainee Developer",
    joined: "January 2023",
    level: "Beginner",
    city: "Cairo",
    goal: "Become a full stack developer",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "I'm a full stack trainer specialized in Django & React.",
    skills: ["Django", "React", "Python", "JavaScript"],
    linkedin: "linkedin.com/in/alikamal",
  });

  const [modals, setModals] = useState({
    editProfile: false,
    changePassword: false,
    paymentInfo: false,
  });

  const [formData, setFormData] = useState({
    editProfile: {
      ...trainerData,
      skills: Array.isArray(trainerData.skills)
        ? trainerData.skills.join(", ")
        : trainerData.skills,
    },
    changePassword: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    paymentInfo: { cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" },
  });

  // Modal handlers
  const openModal = (modalName) => {
    // When opening editProfile, make sure form reflects latest trainer data
    if (modalName === "editProfile") {
      setFormData((prev) => ({
        ...prev,
        editProfile: {
          ...trainerData,
          skills: Array.isArray(trainerData.skills)
            ? trainerData.skills.join(", ")
            : trainerData.skills,
        },
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

  // Avatar upload (reads file as data URL and sets preview in form)
  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        editProfile: {
          ...prev.editProfile,
          avatar: reader.result,
          avatarFile: file,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    // Normalize skills input (allow comma separated string)
    const updated = { ...formData.editProfile };
    if (typeof updated.skills === "string") {
      updated.skills = updated.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    setTrainerData(updated);
    closeModal("editProfile");
    alert("Profile updated successfully!");
  };

  // Change Password handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      changePassword: { ...prev.changePassword, [name]: value },
    }));
  };

  const handleSavePassword = () => {
    if (
      formData.changePassword.newPassword !==
      formData.changePassword.confirmPassword
    ) {
      alert("New passwords do not match!");
      return;
    }
    closeModal("changePassword");
    alert("Password changed successfully!");
    setFormData((prev) => ({
      ...prev,
      changePassword: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    }));
  };

  // Payment Info handlers
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, [name]: value },
    }));
  };

  const handleSavePayment = () => {
    closeModal("paymentInfo");
    alert("Payment information saved successfully!");
    setFormData((prev) => ({
      ...prev,
      paymentInfo: { cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" },
    }));
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear auth tokens/session here
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  return (
    <>
      <NavTraineDash />

      <main className="bg-background text-foreground min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* PERSONAL INFORMATION SECTION */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={trainerData.avatar}
                  alt={trainerData.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-primary"
                />
              </div>

              {/* Personal Info */}
              <div className="flex-1">
                <h2 className="text-[#ff8211] text-sm font-bold uppercase mb-4">
                  👤 Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Name:{" "}
                      <span className="font-normal">{trainerData.name}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Location:{" "}
                      <span className="font-normal">
                        {trainerData.location}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Email:{" "}
                      <span className="font-normal">{trainerData.email}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Phone:{" "}
                      <span className="font-normal">{trainerData.phone}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Job:{" "}
                      <span className="font-normal">{trainerData.job}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Joined:{" "}
                      <span className="font-normal">{trainerData.joined}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Level:{" "}
                      <span className="font-normal">{trainerData.level}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      City:{" "}
                      <span className="font-normal">{trainerData.city}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Goal:{" "}
                      <span className="font-normal">{trainerData.goal}</span>
                    </p>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => openModal("editProfile")}
                  className="bg-[#ff8211] text-white px-6 py-2 rounded-full font-bold uppercase hover:opacity-95 transition"
                >
                  <span className="text-[black]">✎</span> Edit Profile
                </button>
              </div>
            </div>
          </section>

          <hr className="border-t border-muted my-8" />

          {/* PROFESSIONAL DETAILS SECTION */}
          <section className="mb-12">
            <h2 className="text-[#ff8211] text-2xl font-bold uppercase mb-6 flex items-center gap-2">
              <span>💼</span> Professional Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-700 font-semibold">
                  Bio: <span className="font-normal ">{trainerData.bio}</span>
                </p>
              </div>

              <div>
                <p className="text-gray-700 font-semibold mb-2">
                  Skills:{" "}
                  <span className="font-normal">
                    [{trainerData.skills.join("] [")}]
                  </span>
                </p>
              </div>

              <div>
                <p className="text-gray-700 font-semibold">
                  LinkedIn:{" "}
                  <span className="font-normal">{trainerData.linkedin}</span>
                </p>
              </div>
            </div>
          </section>

          <hr className="border-t border-muted my-8" />

          {/* SETTINGS SECTION */}
          <section>
            <h2 className="text-[#ff8211] text-2xl font-bold uppercase mb-6 flex items-center gap-2">
              <span>⚙️</span> Settings
            </h2>

            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center gap-3 p-3 hover:bg-background/50 rounded cursor-pointer transition hover:bg-[#ff8211]">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <button
                  onClick={() => openModal("changePassword")}
                  className="text-foreground font-semibold hover:text-primary transition cursor-pointer "
                >
                  Change Password
                </button>
              </div>

              {/* Payment Info */}
              <div className="flex items-center gap-3 p-3 hover:bg-background/50 rounded cursor-pointer transition hover:bg-[#ff8211]">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <button
                  onClick={() => openModal("paymentInfo")}
                  className="text-foreground font-semibold hover:text-primary transition cursor-pointer"
                >
                  Payment Info
                </button>
              </div>

              {/* Logout */}
              <div className="flex items-center gap-3 p-3 hover:bg-background/50 rounded cursor-pointer transition">
                <LogOut className="h-5 w-5 text-red-600" />
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-semibold hover:text-red-800 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* EDIT PROFILE MODAL */}
      {modals.editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={() => closeModal("editProfile")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Avatar preview + quick info */}
            {formData.editProfile?.avatar && (
              <div className="px-6 pt-4 pb-2 flex items-center gap-4">
                <img
                  src={formData.editProfile.avatar}
                  alt="avatar preview"
                  className="w-16 h-16 rounded-full object-cover border border-muted"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {formData.editProfile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              </div>
            )}

            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[56vh]">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.editProfile.name}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.editProfile.email}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.editProfile.location}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.editProfile.phone}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Job</label>
                <input
                  type="text"
                  name="job"
                  value={formData.editProfile.job}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Upload Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="w-full text-sm border border-gray-500 cursor-pointer rounded px-3 py-2 outline-none focus:border-[#FF8A1A] hover:bg-[#4fe60f]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Select an image from your device
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.editProfile.skills}
                  onChange={handleEditProfileChange}
                  placeholder="React, Node, CSS"
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.editProfile.linkedin}
                  onChange={handleEditProfileChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.editProfile.bio}
                  onChange={handleEditProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                  rows="3"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 bg-white sticky bottom-0">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-[#FF8A1A] text-white py-2.5 font-semibold rounded hover:opacity-95 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => closeModal("editProfile")}
                className="flex-1 bg-[#FF8A1A] text-white py-2.5 font-semibold rounded hover:bg-[#e6760f] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {modals.changePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <button
                onClick={() => closeModal("changePassword")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.changePassword.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.changePassword.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.changePassword.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleSavePassword}
                className="flex-1 bg-[#FF8A1A] text-white py-2.5 font-semibold rounded hover:bg-[#e6760f] transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={() => closeModal("changePassword")}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 font-semibold rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT INFO MODAL */}
      {modals.paymentInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Payment Information</h2>
              <button
                onClick={() => closeModal("paymentInfo")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.paymentInfo.cardHolder}
                  onChange={handlePaymentChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF8A1A]"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleSavePayment}
                className="flex-1 bg-[#FF8A1A] text-white py-2.5 font-semibold rounded hover:bg-[#e6760f] transition-colors"
              >
                Save Payment
              </button>
              <button
                onClick={() => closeModal("paymentInfo")}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 font-semibold rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterDash />
    </>
  );
};

export default TraineProfileDash;
