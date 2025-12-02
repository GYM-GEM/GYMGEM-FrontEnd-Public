import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { useToast } from "../../../context/ToastContext";

const SettingsTrainee = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [modals, setModals] = useState({
    deleteProfile: false,
  });

  const [formData, setFormData] = useState({
    deleteProfile: { password: "" },
  });

  // Modal handlers
  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  // Delete Profile handlers
  const handleDeleteProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      deleteProfile: { ...prev.deleteProfile, [name]: value },
    }));
  };

  const handleDeleteProfileSubmit = () => {
    const { password } = formData.deleteProfile;
    if (!password) {
      showToast("Please enter your password to confirm deletion.", { type: "error" });
      return;
    }
    
    // Mock validation logic
    closeModal("deleteProfile");
    showToast("Profile deleted successfully", { type: "success" });
    // In a real app, you would make an API call here and then redirect
    // navigate("/login");
  };

  return (
    <>
      <NavTraineDash />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Settings</h1>
            <p className="text-gray-500 mt-2">Manage your profile settings.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Management Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#ff8211]" />
                Profile Management
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => openModal("deleteProfile")}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-colors group border border-red-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-red-600">Delete Profile</p>
                      <p className="text-sm text-red-400">Permanently remove this profile from your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DELETE PROFILE MODAL */}
      {modals.deleteProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all border-2 border-red-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50">
              <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Profile
              </h2>
              <button
                onClick={() => closeModal("deleteProfile")}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-red-700 font-medium">
                  Warning: This action cannot be undone. Please enter your password to proceed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.deleteProfile.password}
                  onChange={handleDeleteProfileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => closeModal("deleteProfile")}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfileSubmit}
                className="flex-1 bg-red-600 text-white py-2.5 font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterDash />
    </>
  );
};

export default SettingsTrainee;
