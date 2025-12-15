import { useState, useEffect, useRef } from "react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosConfig";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Initial fetch (mocking data for now if API fails)
    useEffect(() => {
        const fetchNotifications = async () => {
            // In a real scenario, this would be an API call
            setLoading(true);
            try {
                // Warning: Endpoint might not exist yet
                // const res = await axiosInstance.get('/api/notifications/');
                // setNotifications(res.data);

                // Mock Data for Demo
                setNotifications([
                    { id: 1, title: "Welcome!", message: "Welcome to GymGem! complete your profile.", type: "info", read: false, date: new Date().toISOString() },
                    { id: 2, title: "New Course", message: "Check out the new 'Advanced Yoga' course.", type: "success", read: true, date: new Date(Date.now() - 86400000).toISOString() }
                ]);

            } catch (error) {
                console.log("Could not fetch notifications, using empty state.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Calculate unread count
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        // API Call to mark as read would go here
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-500 hover:text-[#ff8211] transition-colors p-2.5 rounded-full hover:bg-gray-100 block outline-none"
                aria-label="Notifications"
            >
                <MdOutlineNotificationsActive size={24} className={unreadCount > 0 ? "text-[#ff8211] animate-pulse" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-[#ff8211] hover:text-[#e67300] transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-400">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-gray-400 gap-2">
                                    <MdOutlineNotificationsActive size={32} className="opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notif) => (
                                        <li
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className={`
                                                relative px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors
                                                ${!notif.read ? "bg-orange-50/30" : "bg-white"}
                                            `}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.read ? "bg-[#ff8211]" : "bg-gray-300"}`} />
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-sm ${!notif.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {formatDistanceToNow(new Date(notif.date), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {/* <div className="p-2 border-t border-gray-100 text-center">
                            <Link to="/notifications" className="text-xs font-medium text-gray-500 hover:text-gray-800">
                                View History
                            </Link>
                        </div> */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
