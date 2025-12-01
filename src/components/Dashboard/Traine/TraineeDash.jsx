import { useState } from "react";
import NavTraineeDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
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
  Camera
} from "lucide-react";

const TraineeDash = () => {
  // State Management
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [progressRecords, setProgressRecords] = useState([
    { id: 1, date: "2024-12-01", weight: 75.5, height: 175, bodyFat: 18.2, muscleMass: 61.8, bmr: 1720 },
    { id: 2, date: "2024-11-24", weight: 76.2, height: 175, bodyFat: 18.8, muscleMass: 61.2, bmr: 1710 },
    { id: 3, date: "2024-11-17", weight: 76.8, height: 175, bodyFat: 19.2, muscleMass: 60.9, bmr: 1705 },
    { id: 4, date: "2024-11-10", weight: 77.3, height: 175, bodyFat: 19.6, muscleMass: 60.5, bmr: 1700 },
    { id: 5, date: "2024-11-03", weight: 77.9, height: 175, bodyFat: 20.1, muscleMass: 60.1, bmr: 1695 },
  ]);

  const [user, setUser] = useState({
    name: "Ahmed Hassan",
    membershipStatus: "Premium Member",
    profileImage: null,
    workoutsCompleted: 24,
    currentWeight: 75.5,
    bodyFat: 18.2,
    muscleMass: 61.8,
    memberSince: "January 2024",
    birthdate: "",
    phone: "",
    country: "",
    state: "",
    zip: ""
  });

  // Edit Profile State
  const [editedUser, setEditedUser] = useState({ ...user });
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});

  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    bodyFat: "",
    muscleMass: "",
    bmr: ""
  });

  const [upcomingSessions, setUpcomingSessions] = useState([
    { id: 1, date: "Dec 2", time: "10:00 AM", activity: "Strength Training", trainer: "Coach Sarah" },
    { id: 2, date: "Dec 4", time: "3:00 PM", activity: "HIIT Cardio", trainer: "Coach Mike" },
    { id: 3, date: "Dec 6", time: "9:00 AM", activity: "Yoga & Mobility", trainer: "Coach Lisa" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "reminder", message: "Your next session is tomorrow at 10:00 AM", read: false },
    { id: 2, type: "achievement", message: "You've completed 24 workouts this month! 🎉", read: false },
  ]);

  // Filter records based on time range
  const getFilteredRecords = () => {
    const now = new Date();
    const daysMap = { "7days": 7, "30days": 30, "90days": 90 };
    const days = daysMap[selectedTimeRange];

    return progressRecords.filter(record => {
      const recordDate = new Date(record.date);
      const diffTime = Math.abs(now - recordDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
  };

  // Add new record
  const handleAddRecord = (e) => {
    e.preventDefault();
    const record = {
      id: progressRecords.length + 1,
      ...newRecord,
      weight: parseFloat(newRecord.weight),
      height: parseFloat(newRecord.height),
      bodyFat: parseFloat(newRecord.bodyFat),
      muscleMass: parseFloat(newRecord.muscleMass),
      bmr: parseInt(newRecord.bmr)
    };

    setProgressRecords([record, ...progressRecords]);

    // Update user stats
    setUser(prev => ({
      ...prev,
      currentWeight: record.weight,
      bodyFat: record.bodyFat,
      muscleMass: record.muscleMass
    }));

    // Reset form and close modal
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      weight: "",
      height: "",
      bodyFat: "",
      muscleMass: "",
      bmr: ""
    });
    setShowAddRecordModal(false);

    // Add success notification
    addNotification("achievement", "New record added successfully! 📊");
  };

  // Delete record
  const handleDeleteRecord = (id) => {
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

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setUser(editedUser);
    setShowEditProfileModal(false);
    addNotification("achievement", "Profile updated successfully! ✅");
  };

  // Handle cancel edit profile
  const handleCancelEditProfile = () => {
    setEditedUser({ ...user });
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

  // Handle cancel edit record
  const handleCancelEditRecord = () => {
    setEditingRecordId(null);
    setEditedRecord({});
  };

  const filteredRecords = getFilteredRecords();

  return (
    <>
      <NavTraineeDash />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#ff8211] to-[#ff9a42] rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                    {user.membershipStatus}
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-white/80 text-sm">Member Since</p>
                  <p className="text-white font-semibold">{user.memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Workouts Completed */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Workouts</h3>
              <p className="text-3xl font-bold text-gray-900">{user.workoutsCompleted}</p>
              <p className="text-xs text-green-600 mt-2">+4 this week</p>
            </div>

            {/* Weight */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500 rotate-180" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Weight</h3>
              <p className="text-3xl font-bold text-gray-900">{user.currentWeight} <span className="text-lg">kg</span></p>
              <p className="text-xs text-green-600 mt-2">-2.4 kg this month</p>
            </div>

            {/* Body Fat */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500 rotate-180" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Body Fat</h3>
              <p className="text-3xl font-bold text-gray-900">{user.bodyFat} <span className="text-lg">%</span></p>
              <p className="text-xs text-green-600 mt-2">-1.9% this month</p>
            </div>

            {/* Muscle Mass */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Muscle Mass</h3>
              <p className="text-3xl font-bold text-gray-900">{user.muscleMass} <span className="text-lg">kg</span></p>
              <p className="text-xs text-green-600 mt-2">+1.7 kg this month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              {/* Progress Table */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Records</h2>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8211]"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Weight (kg)</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Height (cm)</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Body Fat %</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Muscle Mass (kg)</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">BMR</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">{record.weight}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{record.height}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{record.bodyFat}%</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{record.muscleMass}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{record.bmr}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Progress Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Weight Progress</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[...filteredRecords].reverse().map((record, index) => {
                      const maxWeight = 80;
                      const minWeight = 74;
                      const height = ((record.weight - minWeight) / (maxWeight - minWeight)) * 100;

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-xs text-gray-600 font-medium">{record.weight}</div>
                          <div
                            className="w-full bg-gradient-to-t from-[#ff8211] to-[#ff9a42] rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${height}%` }}
                            title={`${record.date}: ${record.weight}kg`}
                          ></div>
                          <div className="text-xs text-gray-500">{record.date.slice(5)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body Composition Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Body Composition</h3>
                  <div className="h-48 flex items-end justify-around gap-4">
                    {/* Muscle Mass Bar */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-gray-600 font-medium">{user.muscleMass} kg</div>
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ height: '80%' }}
                        title={`Muscle Mass: ${user.muscleMass}kg`}
                      ></div>
                      <div className="text-xs text-gray-500 font-medium">Muscle</div>
                    </div>

                    {/* Body Fat Bar */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-gray-600 font-medium">{user.bodyFat}%</div>
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ height: '35%' }}
                        title={`Body Fat: ${user.bodyFat}%`}
                      ></div>
                      <div className="text-xs text-gray-500 font-medium">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Schedule - Takes 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddRecordModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Record</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditedUser({ ...user });
                      setShowEditProfileModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-[#ff8211] hover:bg-orange-50 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span className="font-medium">Edit Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-[#ff8211] hover:bg-orange-50 transition-colors">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">View Detailed Graphs</span>
                  </button>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#ff8211]" />
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Sessions</h3>
                </div>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#ff8211] transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{session.activity}</p>
                          <p className="text-xs text-gray-600">{session.trainer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-[#ff8211]" />
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border relative ${notification.type === 'achievement'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                        } ${notification.read ? 'opacity-60' : ''}`}
                    >
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-700 pr-6">{notification.message}</p>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Record Modal */}
        {showAddRecordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Record</h2>
                <button
                  onClick={() => setShowAddRecordModal(false)}
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
                    onClick={() => setShowAddRecordModal(false)}
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
                        {editedUser.profileImage ? (
                          <img src={editedUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-[#ff8211]">
                        <Upload className="w-4 h-4 text-[#ff8211]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
                      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                      <input
                        type="date"
                        value={editedUser.birthdate || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, birthdate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                      <input
                        type="text"
                        value={editedUser.state || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={editedUser.zip || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, zip: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8211] focus:border-transparent"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress Records Section */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Progress Records
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-green-200">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Weight (kg)</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Height (cm)</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Body Fat %</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Muscle Mass</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">BMR</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressRecords.slice(0, 5).map((record) => (
                          <tr key={record.id} className="border-b border-green-100 hover:bg-green-100/50 transition-colors">
                            {editingRecordId === record.id ? (
                              <>
                                <td className="py-2 px-2">
                                  <input
                                    type="date"
                                    value={editedRecord.date || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, date: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editedRecord.weight || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, weight: parseFloat(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    value={editedRecord.height || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, height: parseFloat(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editedRecord.bodyFat || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, bodyFat: parseFloat(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={editedRecord.muscleMass || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, muscleMass: parseFloat(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <input
                                    type="number"
                                    value={editedRecord.bmr || ""}
                                    onChange={(e) => setEditedRecord({ ...editedRecord, bmr: parseInt(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#ff8211]"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <div className="flex gap-1">
                                    <button
                                      onClick={handleSaveEditedRecord}
                                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                                      title="Save"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelEditRecord}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-2 text-sm text-gray-900">{record.date}</td>
                                <td className="py-2 px-2 text-sm text-gray-900 font-medium">{record.weight}</td>
                                <td className="py-2 px-2 text-sm text-gray-900">{record.height}</td>
                                <td className="py-2 px-2 text-sm text-gray-900">{record.bodyFat}%</td>
                                <td className="py-2 px-2 text-sm text-gray-900">{record.muscleMass}</td>
                                <td className="py-2 px-2 text-sm text-gray-900">{record.bmr}</td>
                                <td className="py-2 px-2">
                                  <button
                                    onClick={() => handleEditRecord(record)}
                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Showing latest 5 records. Click edit icon to modify values.</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 rounded-b-2xl p-6">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelEditProfile}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-gradient-to-r from-[#ff8211] to-[#ff9a42] text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterDash />
    </>
  );
};

export default TraineeDash;
