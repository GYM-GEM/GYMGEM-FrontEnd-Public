import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calculator, Calendar as CalendarIcon, Clock, X, Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import axiosInstance from "../../../utils/axiosConfig";
import { useToast } from "../../../context/ToastContext";
import Navbar from "../../Navbar.jsx";
import FooterDash from "../FooterDash";

export default function WeekCalendar() {
    // Helper: start week on Monday
    const { showToast } = useToast();
    const startOfWeek = (date) => {
        const d = new Date(date);
        const day = (d.getDay() + 6) % 7; // Monday = 0
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const addDays = (date, days) => {
        const r = new Date(date);
        r.setDate(r.getDate() + days);
        return r;
    };

    const pad = (n) => String(n).padStart(2, "0");

    const timeRange = useMemo(() => {
        const startHour = 0;
        const endHour = 24;
        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            const displayHour = h > 12 ? h - 12 : h;
            const ampm = h >= 12 ? 'PM' : 'AM';

            slots.push(`${displayHour}:00 ${ampm}`);
            slots.push(`${displayHour}:30 ${ampm}`);
        }
        const endDisplayHour = endHour > 12 ? endHour - 12 : endHour;
        const endAmPm = endHour >= 12 ? 'PM' : 'AM';
        // slots.push(`${endDisplayHour}:00 ${endAmPm}`);
        return slots;
    }, []);

    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
    const [events, setEvents] = useState([]);

    // Fetch slots on mount
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axiosInstance.get('/api/trainers/calendar-slots/');
                const fetchedEvents = response.data.map(slot => ({
                    id: slot.pk || slot.id,
                    title: slot.is_available ? "Available Slot" : "Booked",
                    start: slot.slot_start_time,
                    end: slot.slot_end_time,
                    color: slot.is_available ? "#FF8211" : "#22c55e", // Orange for available, Green for booked
                    is_available: slot.is_available
                }));
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            }
        };

        fetchSlots();
    }, []);

    const days = useMemo(() => {
        const d = [];
        for (let i = 0; i < 7; i++) d.push(addDays(weekStart, i));
        return d;
    }, [weekStart]);

    const goToday = () => setWeekStart(startOfWeek(new Date()));
    const prevWeek = () => setWeekStart((s) => addDays(s, -7));
    const nextWeek = () => setWeekStart((s) => addDays(s, 7));

    const colorPalette = [
        { bg: "#FF8211", label: "Orange" },
        { bg: "#86ac55", label: "Green" },
        { bg: "#3B82F6", label: "Blue" },
        { bg: "#EF4444", label: "Red" },
        { bg: "#8B5CF6", label: "Purple" },
        { bg: "#EC4899", label: "Pink" }
    ];

    const parseDateTime = (dateOrDateObj, timeStr) => {
        // dateOrDateObj can be a Date or a string (yyyy-mm-dd)
        const date = dateOrDateObj instanceof Date ? new Date(dateOrDateObj) : new Date(dateOrDateObj + "T00:00:00");

        if (!timeStr) {
            date.setHours(0, 0, 0, 0);
            return date;
        }

        // Check if timeStr is 12-hour (e.g., "6:00 PM") or 24-hour (e.g., "18:00")
        if (timeStr.includes('M')) { // AM or PM
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }
            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            date.setHours(hours, minutes, 0, 0);
        } else {
            // Fallback for 24h format inputs
            const [hh, mm] = timeStr.split(":").map(Number);
            date.setHours(hh, mm, 0, 0);
        }

        return date;
    };

    const addEventDirectly = async (dayDate, timeStr) => {
        const start = parseDateTime(dayDate, timeStr);
        // Optimistic UI update or wait for verified response? User asked for "buffer until response return".
        // Use a temp loading state or just showing a spinner.

        // Let's prevent double clicking
        // if (loading) return;

        try {
            // Provide visual feedback (maybe a temporary loading event or global loading)
            // For row-level feedback, we might just block interaction.
            // Let's modify the UI to show a "Adding..." slot temporarily or just wait if it's fast.
            // Given the prompt "add a buffer untill the response return", I'll add a temporary "saving" event.

            const tempId = Date.now();
            const tempEvent = {
                id: tempId,
                title: "Adding...",
                start: start.toISOString(),
                end: new Date(start.getTime() + 30 * 60000).toISOString(),
                color: "#ccc", // Grey for pending
                isPending: true
            };

            setEvents(prev => [...prev, tempEvent]);

            const payload = {
                slot_start_time: start.toISOString()
            };

            const response = await axiosInstance.post('/api/trainers/calendar-slots/', payload, { skipGlobalLoader: true });

            // Replace temp event with real one
            const newSlot = response.data;
            const finalEvent = {
                id: newSlot.pk || newSlot.id || Math.random(),
                title: newSlot.is_available ? "Available Slot" : "Booked",
                start: newSlot.slot_start_time,
                end: newSlot.slot_end_time,
                color: "#FF8211"
            };

            setEvents(prev => prev.map(e => e.id === tempId ? finalEvent : e));

        } catch (error) {
            console.error("Error adding slot", error);
            // Remove temp event on failure
            setEvents(prev => prev.filter(e => !e.isPending));
            alert("Failed to add slot.");
        }
    };

    const handleDeleteSlot = async (id) => {
        // Optimistic update
        setEvents(prev => prev.map(e => e.id === id ? { ...e, isDeleting: true } : e));

        try {
            await axiosInstance.delete(`/api/trainers/calendar-slots/${id}/`, { skipGlobalLoader: true });
            setEvents(prev => prev.filter(e => e.id !== id));
            showToast("Slot removed", { type: "success" });
        } catch (error) {
            console.error("Error deleting slot", error);
            setEvents(prev => prev.map(e => e.id === id ? { ...e, isDeleting: false } : e));
            showToast("Failed to delete slot", { type: "error" });
        }
    };

    const eventsForDay = (day) => {
        const startDay = new Date(day);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(startDay);
        endDay.setDate(endDay.getDate() + 1);
        return events.filter((ev) => {
            const s = new Date(ev.start);
            return s >= startDay && s < endDay;
        });
    };

    return (
        <>
            <Navbar />
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 bebas-regular flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-[#FF8211]" />
                            My Schedule
                        </h1>
                        <p className="text-gray-500 poppins-regular text-sm mt-1">
                            Manage your weekly sessions and events
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button
                            onClick={prevWeek}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-[#FF8211]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goToday}
                            className="px-4 py-2 text-sm font-semibold poppins-medium text-gray-700 bg-white shadow-sm rounded-lg hover:text-[#FF8211] transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={nextWeek}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-[#FF8211]"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="hidden md:block text-right">
                        <div className="text-lg font-semibold poppins-semibold text-gray-800">
                            {weekStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-500 poppins-regular">
                            Week {pad(Math.ceil((weekStart.getDate() + 6 - weekStart.getDay()) / 7))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50/50">
                        <div className="h-14 border-r border-gray-200 flex items-center justify-center p-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        {days.map((d) => {
                            const isToday = d.toDateString() === new Date().toDateString();
                            return (
                                <div key={d.toDateString()} className={`h-14 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center p-2 transition-colors ${isToday ? 'bg-[#FF8211]/5' : ''}`}>
                                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isToday ? 'text-[#FF8211]' : 'text-gray-500'}`}>
                                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                                    </div>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${isToday ? 'bg-[#FF8211] text-white shadow-md' : 'text-gray-900 group-hover:bg-gray-100'}`}>
                                        {d.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Scrollable Grid Area */}
                    <div className="relative max-h-[800px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-8 min-w-[800px]">
                            {/* Time Column */}
                            <div className="col-start-1 col-end-2 border-r border-gray-200 bg-gray-50/30">
                                {timeRange.map((t, idx) => (
                                    <div key={t + idx} className={`h-12 border-b border-gray-100 flex items-start justify-end px-3 py-1 text-xs font-medium text-gray-400 ${idx % 2 !== 0 && 'bg-white'}`}>
                                        {t}
                                    </div>
                                ))}
                            </div>

                            {/* Days Columns */}
                            {days.map((day) => {
                                const isToday = day.toDateString() === new Date().toDateString();
                                return (
                                    <div key={day.toDateString()} className={`col-start-2 col-end-9 grid grid-cols-7 absolute inset-0 left-[12.5%] pointer-events-none`}>
                                        {/* Just for grid lines visual */}
                                    </div>
                                );
                            })}

                            {/* Actually rendered columns for interaction */}
                            {days.map((day, colIndex) => (
                                <div key={day.toDateString()} className={`col-span-1 border-r border-gray-100 relative ${colIndex === 6 ? 'border-r-0' : ''}`}>
                                    {timeRange.map((t, idx) => (
                                        <div
                                            key={t + idx}
                                            className="h-12 border-b border-gray-100 relative hover:bg-gray-50 transition-colors cursor-pointer group"
                                            onClick={() => addEventDirectly(day, t)}
                                        >
                                            <div className="hidden group-hover:flex items-center justify-center h-full w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Plus className="w-4 h-4 text-gray-400" />
                                            </div>

                                            {/* Render Events */}
                                            {eventsForDay(day)
                                                .filter((ev) => {
                                                    const s = new Date(ev.start);
                                                    const thisSlot = parseDateTime(day, t);
                                                    return s.getTime() === thisSlot.getTime();
                                                })
                                                .map((ev) => {
                                                    const s = new Date(ev.start);
                                                    const e = new Date(ev.end);
                                                    const durationMins = Math.max(30, (e - s) / 60000);
                                                    const heightSlots = durationMins / 30;
                                                    // 48px (h-12) per slot
                                                    const height = heightSlots * 48 - 4; // -4 for spacing

                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!ev.isPending && !ev.isDeleting) {
                                                                    handleDeleteSlot(ev.id);
                                                                }
                                                            }}
                                                            className={`absolute left-[2px] right-[2px] top-[2px] z-10 rounded-lg p-2 text-white shadow-sm transition-all group/event overflow-hidden 
                                                            ${(ev.isPending || ev.isDeleting) ? 'opacity-80 cursor-wait' : 'cursor-pointer hover:shadow-md hover:bg-red-500 hover:opacity-90'}`}
                                                            title={ev.isPending ? "Adding..." : ev.isDeleting ? "Deleting..." : "Click to delete"}
                                                            style={{ height: `${height}px`, backgroundColor: ev.isDeleting ? '#999' : ev.color }}
                                                        >
                                                            {(ev.isPending || ev.isDeleting) && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
                                                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col h-full">
                                                                <div className="font-semibold text-xs leading-tight line-clamp-2 poppins-medium">
                                                                    {ev.title}
                                                                </div>
                                                                <div className="text-[10px] opacity-90 mt-0.5 flex items-center gap-1 font-mono">
                                                                    <Clock className="w-3 h-3" />
                                                                    {s.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                </div>


                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Events List Footer */}
                {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 bebas-regular mb-4 flex items-center gap-2">
                    Weekly Agenda
                    <span className="text-sm font-normal text-gray-500 poppins-regular bg-gray-100 px-2 py-0.5 rounded-full">
                        {events.filter((e) => {
                            const s = new Date(e.start);
                            return s >= weekStart && s <= addDays(weekStart, 6);
                        }).length} Events
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events
                        .filter((e) => {
                            const s = new Date(e.start);
                            return s >= weekStart && s <= addDays(weekStart, 6);
                        })
                        .sort((a, b) => new Date(a.start) - new Date(b.start))
                        .map((e) => (
                            <div key={e.id} className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#FF8211]/30 rounded-xl p-4 transition-all hover:shadow-md flex items-start gap-4">
                                <div className="w-1.5 h-full self-stretch rounded-full" style={{ backgroundColor: e.color }}></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate poppins-medium">{e.title}</h4>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 poppins-regular">
                                        <CalendarIcon className="w-3 h-3" />
                                        {new Date(e.start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 poppins-regular">
                                        <Clock className="w-3 h-3" />
                                        {new Date(e.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(e.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </div>
                                </div>

                            </div>
                        ))}

                    {events.filter((e) => {
                        const s = new Date(e.start);
                        return s >= weekStart && s <= addDays(weekStart, 6);
                    }).length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="poppins-regular text-sm">No events scheduled for this week</p>
                            </div>
                        )}
                </div>
            </div> */}

                {/* Modal Overlay */}

            </div>
            <FooterDash />
        </>
    );
}
