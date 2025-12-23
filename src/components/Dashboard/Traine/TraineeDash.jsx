import { useState, useEffect } from "react";
import UploadImage from "../../UploadImage";
import NavTraineeDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { useToast } from "../../../context/ToastContext";
import axiosInstance from "../../../utils/axiosConfig";
import {
  User,
  TrendingUp,
  Activity,
  Target,
  Plus,
  Edit,
  BarChart3,
  Calendar,
  Bell,
  Dumbbell,
  X,
  Save,
  Trash2,
  Upload,
  Camera,
  Award,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Wallet
} from "lucide-react";

// Helper component for BriefcaseIcon
const BriefcaseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TraineeDash = () => {
  const { showToast } = useToast();

  // State Management
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  const [progressRecords, setProgressRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get('/api/trainees/records/');
        if (response.data && response.data.results) {
          // Sort records by date descending (latest first)
          const sortedResults = response.data.results.sort((a, b) => {
            const dateA = new Date(a.record_date);
            const dateB = new Date(b.record_date);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            // If dates are equal, sort by created_at
            return new Date(b.created_at) - new Date(a.created_at);
          });

          const mappedRecords = sortedResults.map(record => ({
            id: record.id,
            date: record.record_date,
            weight: parseFloat(record.weight) || 0,
            height: parseFloat(record.height) || 0,
            bodyFat: parseFloat(record.body_fat_percentage) || 0,
            muscleMass: parseFloat(record.muscle_mass) || 0,
            bmr: parseInt(record.BMR) || 0,
            boneMass: parseFloat(record.bone_mass) || 0,
            bodyWater: parseFloat(record.body_water_percentage) || 0
          }));

          setProgressRecords(mappedRecords);

          // Update user stats with the latest record
          if (mappedRecords.length > 0) {
            const latestRecord = mappedRecords[0];
            setUser(prev => ({
              ...prev,
              currentWeight: latestRecord.weight,
              bodyFat: latestRecord.bodyFat,
              muscleMass: latestRecord.muscleMass,
              boneMass: latestRecord.boneMass,
              bodyWater: latestRecord.bodyWater,
              bmr: latestRecord.bmr
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching trainee records:", error);
      }
    };

    fetchRecords();
  }, []);

  // Load logged-in user data from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Merged User State (combining logged-in user data with default UI values)
  const [user, setUser] = useState({
    name: loggedInUser?.username ||
      (loggedInUser?.first_name && loggedInUser?.last_name
        ? `${loggedInUser.first_name} ${loggedInUser.last_name}`
        : (loggedInUser?.email?.split('@')[0] || "User")),
    email: loggedInUser?.email || "",
    location: loggedInUser?.location || "",
    phone: loggedInUser?.phone || "",
    job: loggedInUser?.job || "Trainee",
    joined: loggedInUser?.joined || "Recently",
    level: loggedInUser?.level || "Beginner",
    city: loggedInUser?.city || "",
    goal: loggedInUser?.goal || "",
    avatar: loggedInUser?.avatar || loggedInUser?.profile_picture || "",
    bio: loggedInUser?.bio || "",
    skills: loggedInUser?.skills || [],
    linkedin: loggedInUser?.linkedin || "",
    // membershipStatus: loggedInUser?.membership_status || "Free Member",
    workoutsCompleted: loggedInUser?.workoutsCompleted || 0,
    currentWeight: loggedInUser?.currentWeight || 0,
    bodyFat: loggedInUser?.bodyFat || 0,
    muscleMass: loggedInUser?.muscleMass || 0,
    boneMass: loggedInUser?.boneMass || 0,
    bodyWater: loggedInUser?.bodyWater || 0,
    bmr: loggedInUser?.bmr || 0,
    memberSince: loggedInUser?.created_at ? new Date(loggedInUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    birthdate: loggedInUser?.birthdate || "",
    state: loggedInUser?.state || "",
    zip: loggedInUser?.zip || "",
    balance: loggedInUser?.balance || "0.00",
    gender: loggedInUser?.gender || "Not specified"
  });

  const [editedUser, setEditedUser] = useState({
    ...user,
    country: user.location ? user.location.split(',').pop().trim() : "",
    state: user.state,
    zip: user.zip
  });

  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});

  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    bodyFat: "",
    muscleMass: "",
    boneMass: "",
    bodyWater: "",
    bmr: ""
  });

  // const [upcomingSessions, setUpcomingSessions] = useState([
  //   { id: 1, date: "Dec 2", time: "10:00 AM", activity: "Strength Training", trainer: "Coach Sarah" },
  //   { id: 2, date: "Dec 4", time: "3:00 PM", activity: "HIIT Cardio", trainer: "Coach Mike" },
  //   { id: 3, date: "Dec 6", time: "9:00 AM", activity: "Yoga & Mobility", trainer: "Coach Lisa" },
  // ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "reminder", message: "Your next session is tomorrow at 10:00 AM", read: false },
    { id: 2, type: "achievement", message: "You've completed 24 workouts this month! 🎉", read: false },
  ]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/trainees/detail');
        const userData = response.data;

        setUser(prev => ({
          ...prev,
          name: userData.name || prev.name,
          avatar: userData.profile_picture || prev.avatar,
          birthdate: userData.birthdate || prev.birthdate,
          email: prev.email, // API doesn't return email in this specific response based on user input
          location: userData.country && userData.state
            ? `${userData.state}, ${userData.country}`
            : (userData.country || userData.state || prev.location),
          phone: userData.phone_number || prev.phone,
          city: userData.state || prev.city,
          state: userData.state || prev.state,
          zip: userData.zip_code || prev.zip,
          balance: userData.balance || prev.balance,
          gender: userData.gender || prev.gender,
          // Preserve other fields that are valid in frontend state but potentially missing in this API response:
          job: prev.job,
          joined: userData.created_at ? new Date(userData.created_at).toLocaleDateString() : prev.joined,
          memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : prev.memberSince,
        }));
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, []);

  // Filter records based on time range
  const getFilteredRecords = () => {
    const now = new Date();
    const daysMap = { "7days": 7, "30days": 30, "90days": 90 };
    const days = daysMap[selectedTimeRange];

    // Exclude the latest record (first one) from the list
    const historyRecords = progressRecords.slice(1);

    return historyRecords.filter(record => {
      const recordDate = new Date(record.date);
      const diffTime = Math.abs(now - recordDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
  };

  // Add or Update record
  const handleAddRecord = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        record_date: newRecord.date,
        weight: newRecord.weight,
        height: newRecord.height,
        body_fat_percentage: newRecord.bodyFat,
        muscle_mass: newRecord.muscleMass,
        bone_mass: newRecord.boneMass,
        body_water_percentage: newRecord.bodyWater,
        BMR: newRecord.bmr
      };

      if (editingRecordId) {
        // Update existing record
        const response = await axiosInstance.put(`/api/trainees/records/${editingRecordId}/`, payload);
        const savedRecord = response.data;

        // Update local state
        const updatedRecords = progressRecords.map(record =>
          record.id === editingRecordId ? {
            id: savedRecord.id,
            date: savedRecord.record_date,
            weight: parseFloat(savedRecord.weight),
            height: savedRecord.height !== "-" ? parseFloat(savedRecord.height) : "-",
            bodyFat: savedRecord.body_fat_percentage !== "-" ? parseFloat(savedRecord.body_fat_percentage) : "-",
            muscleMass: savedRecord.muscle_mass !== "-" ? parseFloat(savedRecord.muscle_mass) : "-",
            boneMass: savedRecord.bone_mass !== "-" ? parseFloat(savedRecord.bone_mass) : "-",
            bodyWater: savedRecord.body_water_percentage !== "-" ? parseFloat(savedRecord.body_water_percentage) : "-",
            bmr: savedRecord.BMR
          } : record
        );

        // Sort records again to be sure (latest first)
        updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        setProgressRecords(updatedRecords);

        // If the edited record is the most recent (first), update user stats
        if (updatedRecords.length > 0 && updatedRecords[0].id === editingRecordId) {
          const latest = updatedRecords[0];
          setUser(prev => ({
            ...prev,
            currentWeight: latest.weight,
            bodyFat: latest.bodyFat,
            muscleMass: latest.muscleMass,
            boneMass: latest.boneMass,
            bodyWater: latest.bodyWater,
            bmr: latest.bmr
          }));
        }

        addNotification("achievement", "Record updated successfully! 📊");
        showToast("Record updated successfully!", { type: "success" });

      } else {
        // Create new record
        const response = await axiosInstance.post('/api/trainees/records/', payload);
        const savedRecord = response.data;

        const record = {
          id: savedRecord.id,
          date: savedRecord.record_date,
          weight: parseFloat(savedRecord.weight),
          height: savedRecord.height !== "-" ? parseFloat(savedRecord.height) : "-",
          bodyFat: savedRecord.body_fat_percentage !== "-" ? parseFloat(savedRecord.body_fat_percentage) : "-",
          muscleMass: savedRecord.muscle_mass !== "-" ? parseFloat(savedRecord.muscle_mass) : "-",
          boneMass: savedRecord.bone_mass !== "-" ? parseFloat(savedRecord.bone_mass) : "-",
          bodyWater: savedRecord.body_water_percentage !== "-" ? parseFloat(savedRecord.body_water_percentage) : "-",
          bmr: savedRecord.BMR
        };

        const newRecords = [record, ...progressRecords];
        // Sort to be safe
        newRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProgressRecords(newRecords);

        // If new record is latest, update user stats
        if (newRecords[0].id === record.id) {
          setUser(prev => ({
            ...prev,
            currentWeight: record.weight,
            bodyFat: record.bodyFat !== "-" ? record.bodyFat : prev.bodyFat,
            muscleMass: record.muscleMass !== "-" ? record.muscleMass : prev.muscleMass,
            boneMass: record.boneMass !== "-" ? record.boneMass : prev.boneMass,
            bodyWater: record.bodyWater !== "-" ? record.bodyWater : prev.bodyWater,
            bmr: record.bmr
          }));
        }

        addNotification("achievement", "New record added successfully! 📊");
        showToast("Record saved successfully!", { type: "success" });
      }

      // Reset form and close modal
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        weight: "",
        height: "",
        bodyFat: "",
        muscleMass: "",
        boneMass: "",
        bodyWater: "",
        bmr: ""
      });
      setEditingRecordId(null); // Clear editing state
      setShowAddRecordModal(false);

    } catch (error) {
      console.error("Error saving record:", error);
      showToast("Failed to save record.", { type: "error" });
    }
  };

  // Delete record
  const handleDeleteRecord = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/trainees/records/${id}/`);
      console.log(response.data);
    }
    catch (error) {
      console.log(error);
    }
    setProgressRecords(progressRecords.filter(record => record.id !== id));
    addNotification("reminder", "Record deleted");
  };

  // Add notification
  const addNotification = (type, message) => {
    const newNotif = {
      id: notifications.length + 1,
      type,
      message,
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // // Delete notification
  // const deleteNotification = (id) => {
  //   setNotifications(notifications.filter(notif => notif.id !== id));
  // };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const profileData = {
        name: editedUser.name,
        profile_picture: editedUser.avatar,
        gender: editedUser.gender,
        birthdate: editedUser.birthdate,
        country: editedUser.country || "Egypt", // Defaulting based on context if missing
        state: editedUser.state,
        zip_code: editedUser.zip,
        phone_number: editedUser.phone
      };

      const response = await axiosInstance.put(`/api/trainees/update`, profileData);
      const updatedData = response.data;

      setUser(prev => ({
        ...prev,
        name: updatedData.name,
        avatar: updatedData.profile_picture,
        gender: updatedData.gender,
        birthdate: updatedData.birthdate,
        location: updatedData.country && updatedData.state
          ? `${updatedData.state}, ${updatedData.country}`
          : (updatedData.country || updatedData.state || prev.location),
        phone: updatedData.phone_number,
        state: updatedData.state,
        zip: updatedData.zip_code,
        // Preserve unedited fields
        balance: updatedData.balance || prev.balance
      }));

      setShowEditProfileModal(false);
      showToast("Profile updated successfully!", { type: "success" });
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile.", { type: "error" });
    }
  };

  // Handle cancel edit profile
  const handleCancelEditProfile = () => {
    setEditedUser({
      ...user,
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills
    });
    setShowEditProfileModal(false);
  };

  // Handle edit record
  const handleEditRecord = (record) => {
    setEditingRecordId(record.id);
    setEditedRecord({ ...record });
  };

  // Handle save edited record
  const handleSaveEditedRecord = () => {
    // Update the progress records
    const updatedRecords = progressRecords.map(record =>
      record.id === editingRecordId ? { ...record, ...editedRecord } : record
    );
    setProgressRecords(updatedRecords);

    // If the edited record is the most recent one (first in array), update user stats
    const editedRecordData = updatedRecords.find(r => r.id === editingRecordId);
    const mostRecentRecord = updatedRecords[0]; // Assuming records are sorted by date, most recent first

    if (editedRecordData && editedRecordData.id === mostRecentRecord.id) {
      setUser(prev => ({
        ...prev,
        currentWeight: editedRecordData.weight,
        bodyFat: editedRecordData.bodyFat,
        muscleMass: editedRecordData.muscleMass
      }));
    }

    // Clear editing state
    setEditingRecordId(null);
    setEditedRecord({});

    // Show success notification
    addNotification("achievement", "Record updated successfully! 📊");
  };

  // Trigger Edit Modal for Latest Record
  const handleEditClick = () => {
    if (progressRecords.length > 0) {
      const latest = progressRecords[0];
      setEditingRecordId(latest.id);
      setNewRecord({
        date: latest.date,
        weight: latest.weight,
        height: latest.height,
        bodyFat: latest.bodyFat,
        muscleMass: latest.muscleMass,
        boneMass: latest.boneMass,
        bodyWater: latest.bodyWater,
        bmr: latest.bmr
      });
      setShowAddRecordModal(true);
    }
  };

  // Handle Cancel form 
  const closeRecordModal = () => {
    setShowAddRecordModal(false);
    setEditingRecordId(null);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      weight: "",
      height: "",
      bodyFat: "",
      muscleMass: "",
      boneMass: "",
      bodyWater: "",
      bmr: ""
    });
  };

  const filteredRecords = getFilteredRecords();

  return (
    <>
      <NavTraineeDash />
      <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Animated Dropdown Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden hover:shadow-md transition-shadow">
            {/* Collapsed Header - Always Visible */}
            <div
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff8211] to-[#ff9a42] flex items-center justify-center overflow-hidden ring-4 ring-orange-50">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-lg text-xs font-semibold shadow-sm">
                      <Award className="w-3 h-3" />
                      {user.membershipStatus}
                    </span> */}
                  </div>
                </div>
              </div>

              {/* Toggle Icon */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {isHeaderExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Expanded Content - Animated */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isHeaderExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                {/* Membership Info */}
                <div className="mt-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-[#ff8211]" />
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Membership Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Member Since</p>
                        <p className="text-sm text-gray-900 font-semibold">{user.memberSince}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-[#ff8211]" />
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="text-sm text-gray-900 font-semibold">{user.phone || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm text-gray-900 font-semibold">{user.location || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Gender</p>
                        <p className="text-sm text-gray-900 font-semibold capitalize">{user.gender || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-pink-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Birthdate</p>
                        <p className="text-sm text-gray-900 font-semibold">{user.birthdate || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Zip Code</p>
                        <p className="text-sm text-gray-900 font-semibold">{user.zip || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Overview Cards - Compact Design */}
          {progressRecords.length > 0 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Latest Record • {progressRecords[0].date}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditClick}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#ff8211] hover:bg-orange-50 transition-colors"
                  title="Edit Record"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRecord(progressRecords[0].id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
            {/* Weight */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-purple-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Weight</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.currentWeight}</h3>
                  <span className="text-xs text-gray-500 font-medium">kg</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            {/* Body Fat */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-orange-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Body Fat</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.bodyFat}</h3>
                  <span className="text-xs text-gray-500 font-medium">%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
            </div>

            {/* Muscle Mass */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-green-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Muscle Mass</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.muscleMass}</h3>
                  <span className="text-xs text-gray-500 font-medium">kg</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Body Water */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Body Water</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.bodyWater}</h3>
                  <span className="text-xs text-gray-500 font-medium">%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Bone Mass */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Bone Mass</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.boneMass}</h3>
                  <span className="text-xs text-gray-500 font-medium">kg</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            {/* BMR */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between hover:shadow-md hover:border-pink-200 transition-all duration-300 group">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">BMR</p>
                <div className="flex items-baseline gap-0.5">
                  <h3 className="text-xl font-bold text-gray-900">{user.bmr}</h3>
                  <span className="text-xs text-gray-500 font-medium">kcal</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Section - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Records</h2>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8211] focus:border-transparent hover:border-gray-300 transition-colors"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Weight (kg)</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Height (cm)</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Body Fat %</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Muscle (kg)</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Bone Mass (kg)</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Body Water (%)</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">BMR</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-600 font-medium">{record.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-900 font-bold">{record.weight}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.height}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.bodyFat}%</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.muscleMass}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.boneMass}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.bodyWater}%</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{record.bmr}</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleDeleteRecord(record.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                              aria-label="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions & Schedule - Takes 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddRecordModal(true)}
                    className="group w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span>Add Record</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditedUser({
                        ...user,
                        skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills
                      });
                      setShowEditProfileModal(true);
                    }}
                    className="group w-full flex items-center gap-3 px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-[#ff8211] hover:bg-orange-50 hover:scale-[1.02] transition-all font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Edit className="w-5 h-5 group-hover:text-[#ff8211]" />
                    </div>
                    <span>Edit Profile</span>
                  </button>
                  {/* <button className="group w-full flex items-center gap-3 px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-[#ff8211] hover:bg-orange-50 hover:scale-[1.02] transition-all font-medium">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <BarChart3 className="w-5 h-5 group-hover:text-[#ff8211]" />
                    </div>
                    <span>View Detailed Graphs</span>
                  </button> */}
                </div>
              </div>

              {/* Upcoming Sessions */}
              {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Sessions</h3>
                </div>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm mb-1">{session.activity}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {session.trainer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-2 pt-2 border-t border-gray-100">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Notifications */}
              {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border-2 relative transition-all ${notification.type === 'achievement'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
                        } ${notification.read ? 'opacity-60' : 'shadow-sm'}`}
                    >
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
                        aria-label="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-700 font-medium pr-8 leading-relaxed">{notification.message}</p>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-2 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Add Record Modal */}
        {showAddRecordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRecordId ? "Edit Record" : "Add New Record"}
                </h2>
                <button
                  onClick={closeRecordModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.weight}
                    onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={newRecord.height}
                    onChange={(e) => setNewRecord({ ...newRecord, height: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.bodyFat}
                    onChange={(e) => setNewRecord({ ...newRecord, bodyFat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Mass (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.muscleMass}
                    onChange={(e) => setNewRecord({ ...newRecord, muscleMass: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bone Mass (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.boneMass}
                    onChange={(e) => setNewRecord({ ...newRecord, boneMass: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Water (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.bodyWater}
                    onChange={(e) => setNewRecord({ ...newRecord, bodyWater: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BMR</label>
                  <input
                    type="number"
                    value={newRecord.bmr}
                    onChange={(e) => setNewRecord({ ...newRecord, bmr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeRecordModal}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
              <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={handleCancelEditProfile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Profile Picture Section */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#ff8211]" />
                    Profile Picture
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff8211] to-[#ff9a42] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {editedUser.avatar ? (
                          <img src={editedUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <UploadImage
                        onUpload={(url) => setEditedUser({ ...editedUser, avatar: url })}
                        acceptTypes="image/*"
                      />
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editedUser.name || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editedUser.phone || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={editedUser.gender || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                      <input
                        type="date"
                        value={editedUser.birthdate || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, birthdate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={editedUser.country || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/City</label>
                      <input
                        type="text"
                        value={editedUser.state || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter state or city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={editedUser.zip || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, zip: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3 bg-white sticky bottom-0 border-t border-gray-100 pt-4">
                <button
                  onClick={handleCancelEditProfile}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <FooterDash />
      </main>
    </>
  );
};


export default TraineeDash;
