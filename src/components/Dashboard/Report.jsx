import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import FooterDash from "./FooterDash";
import axiosInstance from "../../utils/axiosConfig";
import { AlertCircle, Search, Filter, RefreshCw, MessageSquare, Calendar, Clock, Flag } from "lucide-react";

const Report = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/api/utils/my-complaints/");
            // The API response is { complaints: [...] }
            if (response.data && response.data.complaints) {
                setComplaints(response.data.complaints);
            } else {
                setComplaints([]);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to load reports. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "resolved":
            case "closed":
                return "bg-green-100 text-green-700 border-green-200";
            case "open":
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesFilter = filter === "all" || complaint.status?.toLowerCase() === filter;
        const matchesSearch =
            (complaint.details && complaint.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (complaint.id && complaint.id.toString().includes(searchTerm)) ||
            (complaint.admin_response && complaint.admin_response.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    // Sort by Created At Descending
    const sortedComplaints = [...filteredComplaints].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-bebas tracking-wide">My Reports</h1>
                    <p className="text-gray-500 mt-2">Track the status of your submitted reports and complaints.</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search details or ID..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8211]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8211] appearance-none bg-white font-medium text-sm text-gray-700"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <button
                            onClick={fetchComplaints}
                            className="p-2 text-gray-500 hover:text-[#ff8211] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                ) : isLoading && complaints.length === 0 ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : sortedComplaints.length > 0 ? (
                    <div className="grid gap-6">
                        {sortedComplaints.map(complaint => (
                            <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono font-bold">#{complaint.id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(complaint.status)}`}>
                                                {complaint.status || 'Unknown'}
                                            </span>
                                            {complaint.created_at && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(complaint.created_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        {complaint.target_complaint && (
                                            <div className="text-xs text-gray-400">
                                                Linked Case: #{complaint.target_complaint}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Complaint Details</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                            {complaint.details}
                                        </div>
                                    </div>

                                    {complaint.admin_response && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h3 className="text-xs font-bold text-[#ff8211] uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" /> Admin Response
                                            </h3>
                                            <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100 text-gray-800 text-sm leading-relaxed">
                                                {complaint.admin_response}
                                                {complaint.response_at && (
                                                    <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Responded on {new Date(complaint.response_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Flag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reports found</h3>
                        <p className="text-gray-500 text-sm mt-1">You haven't submitted any reports yet.</p>
                    </div>
                )}

            </main>
            <FooterDash />
        </div>
    );
};

export default Report;
