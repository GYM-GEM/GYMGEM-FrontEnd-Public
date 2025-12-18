import React, { useEffect, useState, useMemo } from "react";
import NavTraineDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WeekCalendar = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    // Auth Logic
    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

    // Sync & Load Events
    useEffect(() => {
        if (!user.id) return;

        const traineeKey = `trainee_bookings_${user.id}`;
        let myEvents = (() => {
            try {
                return JSON.parse(localStorage.getItem(traineeKey) || "[]");
            } catch (e) { return []; }
        })();

        // SYNC STATUS FROM TRAINER CALENDAR AND REMOVE DELETED
        // If a trainer deletes an event, it should disappear from the trainee's view
        const trainerKey = `wc_events_16`;
        const trainerEventsStr = localStorage.getItem(trainerKey) || localStorage.getItem("wc_events_v1") || "[]";
        const trainerEvents = JSON.parse(trainerEventsStr);

        let changed = false;

        // 1. Filter out events that no longer exist in trainer's calendar
        const validEvents = myEvents.filter(ev => {
            // If the event doesn't have a trainerId (e.g. personal), keep it.
            // But usually trainee bookings have trainerId.
            if (!ev.trainerId) return true;

            const exists = trainerEvents.some(te => te.id === ev.id);
            if (!exists) {
                changed = true; // Mark as changed because we are dropping this event
            }
            return exists;
        });

        // 2. Update status/color for remaining valid events
        const syncedEvents = validEvents.map(ev => {
            if (!ev.trainerId) return ev;

            const original = trainerEvents.find(te => te.id === ev.id);
            if (original && (original.status !== ev.status || original.color !== ev.color)) {
                changed = true;
                return {
                    ...ev,
                    status: original.status,
                    color: original.color
                };
            }
            return ev;
        });

        if (changed) {
            localStorage.setItem(traineeKey, JSON.stringify(syncedEvents));
            setEvents(syncedEvents);
        } else {
            setEvents(myEvents);
        }

    }, [user.id]);

    // --- CALENDAR HELPERS (Matches WeekCalendar logic) ---
    const startOfWeek = (date) => {
        const d = new Date(date);
        const day = (d.getDay() + 6) % 7; // Monday = 0
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    };
    const addDays = (d, days) => {
        const r = new Date(d);
        r.setDate(r.getDate() + days);
        return r;
    };
    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

    // Generate 7 days for current view
    const days = useMemo(() => {
        const d = [];
        for (let i = 0; i < 7; i++) d.push(addDays(weekStart, i));
        return d;
    }, [weekStart]);

    // Generate Time Slots (6 AM - 10 PM)
    const timeRange = useMemo(() => {
        const startHour = 6;
        const endHour = 22;
        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            const displayHour = h > 12 ? h - 12 : h;
            const ampm = h >= 12 ? 'PM' : 'AM';
            slots.push(`${displayHour}:00 ${ampm}`);
            slots.push(`${displayHour}:30 ${ampm}`);
        }
        return slots;
    }, []);

    // Helper: Filter events for a specific day
    const getEventsForDay = (dayDate) => {
        return events.filter(e => {
            const s = new Date(e.start);
            return s.getDate() === dayDate.getDate() &&
                s.getMonth() === dayDate.getMonth() &&
                s.getFullYear() === dayDate.getFullYear();
        });
    };

    return (
        <>
            <NavTraineDash />
            <main className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-4 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 bebas-regular flex items-center gap-2">
                                <CalendarIcon className="w-8 h-8 text-[#FF8211]" />
                                Weekly Schedule
                            </h1>
                            <p className="text-gray-500 poppins-regular text-sm mt-1">
                                View your booked sessions and their live status
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-[#FF8211]">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => setWeekStart(startOfWeek(new Date()))} className="px-4 py-2 text-sm font-semibold poppins-medium text-gray-700 bg-white shadow-sm rounded-lg hover:text-[#FF8211] transition-colors">
                                Today
                            </button>
                            <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-[#FF8211]">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hidden md:block text-right">
                            <div className="text-lg font-semibold poppins-semibold text-gray-800">
                                {weekStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Pending Legend */}
                    <div className="flex gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span> Confirmed
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span> Pending Request
                        </div>
                    </div>

                    {/* CALENDAR GRID CONTAINER */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">

                                {/* Days Header */}
                                <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50/50">
                                    <div className="h-14 border-r border-gray-200 flex items-center justify-center p-2">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    {days.map(d => {
                                        const isToday = d.toDateString() === new Date().toDateString();
                                        return (
                                            <div key={d.toString()} className={`h-14 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center p-2 transition-colors ${isToday ? 'bg-[#FF8211]/5' : ''}`}>
                                                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isToday ? 'text-[#FF8211]' : 'text-gray-500'}`}>
                                                    {d.toLocaleDateString(undefined, { weekday: 'short' })}
                                                </div>
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${isToday ? 'bg-[#FF8211] text-white shadow-md' : 'text-gray-900 group-hover:bg-gray-100'}`}>
                                                    {d.getDate()}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Calendar Body */}
                                <div className="relative h-[800px] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-8 min-w-[800px]">
                                        {/* Time Column */}
                                        <div className="col-start-1 col-end-2 border-r border-gray-200 bg-gray-50/30">
                                            {timeRange.map((t, idx) => (
                                                <div key={idx} className={`h-12 border-b border-gray-100 flex items-start justify-end px-3 py-1 text-xs font-medium text-gray-400 ${idx % 2 !== 0 && 'bg-white'}`}>
                                                    {t}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Days Columns */}
                                        {days.map((day, colIndex) => (
                                            <div key={day.toString()} className={`col-span-1 border-r border-gray-100 relative ${colIndex === 6 ? 'border-r-0' : ''}`}>

                                                {/* Background Grid Lines */}
                                                {timeRange.map((_, idx) => (
                                                    <div key={idx} className="h-12 border-b border-gray-100"></div>
                                                ))}

                                                {/* Events Layer */}
                                                {getEventsForDay(day).map(ev => {
                                                    const start = new Date(ev.start);
                                                    const end = new Date(ev.end);

                                                    // Calculate position assumes 6:00 AM start
                                                    const startHour = 6;
                                                    const minsFromStart = (start.getHours() * 60 + start.getMinutes()) - (startHour * 60);
                                                    // 48px per 30 mins
                                                    const top = (minsFromStart / 30) * 48; // 1.6px per minute

                                                    const durationMins = (end - start) / 60000;
                                                    const height = (durationMins / 30) * 48 - 4; // -4 for spacing

                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/session/${ev.id}`); }}
                                                            className="absolute left-[2px] right-[2px] rounded-lg p-2 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer z-10 overflow-hidden"
                                                            style={{
                                                                top: `${top}px`,
                                                                height: `${Math.max(40, height)}px`,
                                                                backgroundColor: ev.color
                                                            }}
                                                        >
                                                            <div className="flex flex-col h-full">
                                                                <div className="font-semibold text-xs leading-tight line-clamp-2 poppins-medium">
                                                                    {ev.title}
                                                                </div>
                                                                <div className="text-[10px] opacity-90 mt-0.5 flex items-center gap-1 font-mono">
                                                                    <Clock className="w-3 h-3" />
                                                                    {start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                </div>
                                                                <div className="mt-auto self-start bg-black/20 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                                                    {ev.status === 'booked' ? 'Confirmed' : ev.status}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <FooterDash />
        </>
    );
};

export default WeekCalendar;
