import NavBarDash from "./NavBarDash";
import FooterDash from "../FooterDash";
import {
  Edit, Trash2, Plus, X, Save,
  MapPin, Phone, Mail, Calendar,
  Briefcase, Award, Activity, TrendingUp,
  User, DollarSign, Linkedin
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import axiosInstance from "../../../utils/axiosConfig";
import { useParams } from "react-router-dom";
import UploadImage from "../../UploadImage";

const TrainerProfileDash = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [modals, setModals] = useState({
    editProfile: false,
    addSpecialization: false,
    editSpecialization: false,
    addExperience: false,
    editExperience: false,
  });

  // Initialize state with default empty values
  const [profileData, setProfileData] = useState({
    profile: {
      name: "",
      avatar: "",
      gender: "",
      birthdate: "",
      phone: "",
      country: "",
      state: "",
      zip: "",
      bio: "",
      rate: 0,
      balance: 0,
    },
    specializations: [],
    experiences: []
  });

  const [currentEdit, setCurrentEdit] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const profileId = user.current_profile;

      if (!profileId) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/trainers/my-records/?profile_id=${profileId}`);
        const { trainer, specializations, experiences } = response.data;

        console.log("Fetched trainer data:", response.data);

        if (trainer) {
          const resolvedName = trainer.name || "Trainer";

          setProfileData({
            profile: {
              name: resolvedName,
              avatar: trainer.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=FF8211&color=fff`,
              gender: trainer.gender || "",
              birthdate: trainer.birthdate || "",
              country: trainer.country || "",
              state: trainer.state || "",
              zip: trainer.zip_code || "",
              phone: trainer.phone_number || "",
              bio: trainer.bio || "",
              rate: trainer.rate || 0,
              balance: trainer.balance || 0,
            },
            specializations: specializations || [],
            experiences: experiences || []
          });
        }
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
        showToast("Failed to load profile data", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerProfile();
  }, []);

  // Modal handlers
  const openModal = (modalName, data = null) => {
    setCurrentEdit(data);
    if (modalName === "editProfile") {
      setFormData({ ...profileData.profile });
    } else if (data) {
      setFormData({ ...data });
    } else {
      setFormData({});
    }
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    setCurrentEdit(null);
    setFormData({});
  };

  // Handle Cloudinary upload callback
  const handleCloudinaryUpload = (url, fileType) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    showToast("Profile picture uploaded successfully!", { type: "success" });
  };

  // Profile handlers
  const handleSaveProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const profileId = user.current_profile;

    if (!profileId) {
      showToast("Profile ID not found", { type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        profile_picture: formData.avatar,
        gender: formData.gender,
        birthdate: formData.birthdate,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        zip_code: formData.zip,
        bio: formData.bio,
        rate: formData.rate,
      };

      await axiosInstance.put(`/api/trainers/update`, payload);

      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...formData
        }
      }));

      closeModal("editProfile");
      showToast("Profile updated successfully!", { type: "success" });
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Specialization handlers
  const handleSaveSpecialization = () => {
    if (currentEdit) {
      setProfileData(prev => ({
        ...prev,
        specializations: prev.specializations.map(s =>
          s.id === currentEdit.id ? { ...formData, id: s.id } : s
        )
      }));
      showToast("Specialization updated!", { type: "success" });
    } else {
      setProfileData(prev => ({
        ...prev,
        specializations: [...prev.specializations, { ...formData, id: Date.now() }]
      }));
      showToast("Specialization added!", { type: "success" });
    }
    closeModal(currentEdit ? "editSpecialization" : "addSpecialization");
  };

  const handleDeleteSpecialization = (id) => {
    if (window.confirm("Delete this specialization?")) {
      setProfileData(prev => ({
        ...prev,
        specializations: prev.specializations.filter(s => s.id !== id)
      }));
      showToast("Specialization deleted!", { type: "success" });
    }
  };

  // Experience handlers
  const handleSaveExperience = () => {
    if (currentEdit) {
      setProfileData(prev => ({
        ...prev,
        experiences: prev.experiences.map(e =>
          e.id === currentEdit.id ? { ...formData, id: e.id } : e
        )
      }));
      showToast("Experience updated!", { type: "success" });
    } else {
      setProfileData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...formData, id: Date.now() }]
      }));
      showToast("Experience added!", { type: "success" });
    }
    closeModal(currentEdit ? "editExperience" : "addExperience");
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm("Delete this experience?")) {
      setProfileData(prev => ({
        ...prev,
        experiences: prev.experiences.filter(e => e.id !== id)
      }));
      showToast("Experience deleted!", { type: "success" });
    }
  };

  if (isLoading) {
    return (
      <>
        <NavBarDash />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8211] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  const { profile, specializations, experiences } = profileData;

  return (
    <>
      <NavBarDash />
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header / Cover Section */}
        <div className="bg-white border-b border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#FF8211] via-[#ff9a42] to-[#FF8211] w-full relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-[#FF8211] text-white p-1.5 rounded-full shadow border-2 border-white">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Name & Info */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bebas-regular">
                  {profile.name}
                </h1>
                <p className="text-[#FF8211] font-semibold poppins-medium text-lg">
                  Personal Trainer & Fitness Expert
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.country}{profile.state && `, ${profile.state}`}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.rate > 0 && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      ${profile.rate}/session
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openModal("editProfile")}
                className="px-6 py-3 bg-[#FF8211] text-white rounded-xl font-bold shadow-lg hover:bg-[#ff7906] transition-all active:scale-95 flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Me */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-[#FF8211] rounded-full"></span>
                  About Me
                </h2>
                <p className="text-gray-600 poppins-regular leading-relaxed">
                  {profile.bio || "No bio available. Click Edit Profile to add one."}
                </p>
              </div>

              {/* Specializations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bebas-regular flex items-center gap-2">
                    <span className="w-1 h-8 bg-[#86ac55] rounded-full"></span>
                    Specializations
                  </h2>
                  <button
                    onClick={() => openModal("addSpecialization")}
                    className="px-4 py-2 bg-[#86ac55] text-white rounded-lg font-semibold hover:bg-[#7a9d4d] transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {specializations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specializations.map((spec) => (
                      <div key={spec.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:border-[#86ac55]/30 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{spec.name}</h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal("editSpecialization", spec)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteSpecialization(spec.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{spec.description || "No description"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No specializations added yet</p>
                  </div>
                )}
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bebas-regular flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                    Work Experience
                  </h2>
                  <button
                    onClick={() => openModal("addExperience")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {experiences.length > 0 ? (
                  <div className="space-y-4">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="group relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-gray-100"></div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{exp.position || exp.title}</h3>
                            <p className="text-sm text-[#FF8211] font-semibold">{exp.workplace || exp.company}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {exp.startDate} - {exp.endDate || "Present"}
                            </p>
                            {exp.description && (
                              <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal("editExperience", exp)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No work experience added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-sm border border-green-100">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Account Balance</h3>
                <p className="text-4xl font-bold text-green-600 bebas-regular">${profile.balance}</p>
                <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
              </div>

              {/* Rate Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Session Rate</h3>
                <p className="text-4xl font-bold text-[#FF8211] bebas-regular">${profile.rate}</p>
                <p className="text-xs text-gray-500 mt-1">Per training session</p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Specializations</span>
                    <span className="font-bold text-gray-900">{specializations.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experiences</span>
                    <span className="font-bold text-gray-900">{experiences.length}</span>
                  </div>
                  {profile.birthdate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Birthday</span>
                      <span className="font-bold text-gray-900">{new Date(profile.birthdate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {modals.editProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={() => closeModal("editProfile")} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                {formData.avatar && (
                  <img src={formData.avatar} alt="Preview" className="w-24 h-24 rounded-full mb-2 object-cover border-2 border-gray-200" />
                )}
                <UploadImage
                  onUpload={handleCloudinaryUpload}
                  onLoadingChange={setIsUploadingImage}
                  acceptTypes="image/*"
                />
                {isUploadingImage && (
                  <p className="text-sm text-orange-600 mt-2">Uploading profile picture...</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Birthdate</label>
                  <input
                    type="date"
                    value={formData.birthdate || ""}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zip || ""}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rate ($/session)</label>
                  <input
                    type="number"
                    value={formData.rate || ""}
                    onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => closeModal("editProfile")}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-4 py-2 bg-[#FF8211] text-white rounded hover:bg-[#ff7906] disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Specialization Modal */}
      {(modals.addSpecialization || modals.editSpecialization) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {currentEdit ? "Edit" : "Add"} Specialization
              </h3>
              <button
                onClick={() => closeModal(currentEdit ? "editSpecialization" : "addSpecialization")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Strength Training"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => closeModal(currentEdit ? "editSpecialization" : "addSpecialization")}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSpecialization}
                className="px-4 py-2 bg-[#86ac55] text-white rounded hover:bg-[#7a9d4d]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Experience Modal */}
      {(modals.addExperience || modals.editExperience) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {currentEdit ? "Edit" : "Add"} Experience
              </h3>
              <button
                onClick={() => closeModal(currentEdit ? "editExperience" : "addExperience")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Workplace</label>
                <input
                  type="text"
                  value={formData.workplace || ""}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="month"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Present or YYYY-MM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => closeModal(currentEdit ? "editExperience" : "addExperience")}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExperience}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterDash />
    </>
  );
};

export default TrainerProfileDash;
