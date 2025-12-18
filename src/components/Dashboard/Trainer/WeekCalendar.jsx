import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calculator, Calendar as CalendarIcon, Clock, X, Trash2, Edit2, Plus } from "lucide-react";

export default function WeekCalendar() {
    // Helper: start week on Monday
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
        const startHour = 6;
        const endHour = 22;
        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            const displayHour = h > 12 ? h - 12 : h;
            const ampm = h >= 12 ? 'PM' : 'AM';
            slots.push(`${displayHour}:00 ${ampm}`);
            slots.push(`${displayHour}:30 ${ampm}`);
        }
        const endDisplayHour = endHour > 12 ? endHour - 12 : endHour;
        const endAmPm = endHour >= 12 ? 'PM' : 'AM';
        slots.push(`${endDisplayHour}:00 ${endAmPm}`);
        return slots;
    }, []);

    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    // Robust ID check
    const userId = user?.id || user?.pk || user?.user_id || user?._id;
    const storageKey = userId ? `wc_events_${userId}` : "wc_events_v1";

    useEffect(() => {
        console.log("WeekCalendar: Using storage key:", storageKey);
    }, [storageKey]);

    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
    const [events, setEvents] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [modal, setModal] = useState({ open: false, date: null, time: null });
    const [form, setForm] = useState({ title: "", duration: 60, color: "#FF8211" }); // Default to brand orange
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(events));
        }
    }, [events, storageKey]);

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

    const toInputDate = (d) => {
        return d.toISOString().slice(0, 10);
    };

    const openCreateModal = (dayDate, timeStr) => {
        // Convert display time back to 24h for input if needed, or keeping it as is for parsing logic
        // For standard HTML input type="time", we need HH:MM in 24h format
        // But our timeStr from grid is now "6:00 AM"

        let initialTime = "";
        if (timeStr.includes('M')) {
            const d = parseDateTime(dayDate, timeStr);
            initialTime = d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
        } else {
            initialTime = timeStr;
        }

        setModal({ open: true, date: new Date(dayDate), time: initialTime });
        setForm({ title: "", duration: 60, color: "#FF8211" });
        setEditingId(null);
    };

    const openEditModal = (ev, e) => {
        e.stopPropagation();
        const s = new Date(ev.start);
        setModal({ open: true, date: s, time: `${pad(s.getHours())}:${pad(s.getMinutes())}` });
        setForm({ title: ev.title, duration: Math.max(30, Math.round((new Date(ev.end) - s) / 60000)), color: ev.color });
        setEditingId(ev.id);
    };

    const saveEvent = () => {
        if (!modal.date || !modal.time) return;
        const start = parseDateTime(modal.date, modal.time); // modal.time is 24h from input
        const end = new Date(start.getTime() + form.duration * 60000);

        if (editingId) {
            setEvents((s) => s.map((ev) => (ev.id === editingId ? { ...ev, title: form.title || "Untitled", start: start.toISOString(), end: end.toISOString(), color: form.color } : ev)));
        } else {
            const newEvent = {
                id: Date.now() + Math.random(),
                title: form.title || "Untitled",
                start: start.toISOString(),
                end: end.toISOString(),
                color: form.color,
            };
            setEvents((s) => [...s, newEvent]);
        }

        setModal({ open: false, date: null, time: null });
        setEditingId(null);
    };

    const deleteEvent = (id) => {
        setEvents((s) => s.filter((e) => e.id !== id));
        if (editingId === id) {
            setModal({ open: false, date: null, time: null });
            setEditingId(null);
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
                                        onClick={() => openCreateModal(day, t)}
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
                                                        onClick={(e) => openEditModal(ev, e)}
                                                        className="absolute left-[2px] right-[2px] top-[2px] z-10 rounded-lg p-2 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group/event overflow-hidden"
                                                        style={{ height: `${height}px`, backgroundColor: ev.color }}
                                                    >
                                                        <div className="flex flex-col h-full">
                                                            <div className="font-semibold text-xs leading-tight line-clamp-2 poppins-medium">
                                                                {ev.title}
                                                            </div>
                                                            <div className="text-[10px] opacity-90 mt-0.5 flex items-center gap-1 font-mono">
                                                                <Clock className="w-3 h-3" />
                                                                {s.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                            </div>

                                                            {height > 60 && (
                                                                <button
                                                                    onClick={(evn) => {
                                                                        evn.stopPropagation();
                                                                        deleteEvent(ev.id);
                                                                    }}
                                                                    className="absolute bottom-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white opacity-0 group-hover/event:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(ev) => openEditModal(e, ev)} className="p-1.5 text-gray-400 hover:text-[#FF8211] hover:bg-orange-50 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteEvent(e.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
            </div>

            {/* Modal Overlay */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-900 bebas-regular flex items-center gap-2">
                                {editingId ? <Edit2 className="w-5 h-5 text-[#FF8211]" /> : <Plus className="w-5 h-5 text-[#FF8211]" />}
                                {editingId ? 'Edit Event' : 'New Event'}
                            </h3>
                            <button
                                onClick={() => { setModal({ open: false, date: null, time: null }); setEditingId(null); }}
                                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        value={modal.date ? toInputDate(modal.date) : ''}
                                        onChange={(e) => setModal((s) => ({ ...s, date: new Date(e.target.value) }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#FF8211] focus:ring-2 focus:ring-[#FF8211]/20 transition-all poppins-regular text-sm"
                                    />
                                    <input
                                        type="time"
                                        value={modal.time || ''}
                                        onChange={(e) => setModal((s) => ({ ...s, time: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#FF8211] focus:ring-2 focus:ring-[#FF8211]/20 transition-all poppins-regular text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Event Title</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                    placeholder="e.g. Gym Session with Alex"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#FF8211] focus:ring-2 focus:ring-[#FF8211]/20 transition-all poppins-medium placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (min)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={form.duration}
                                        onChange={(e) => setForm((s) => ({ ...s, duration: Number(e.target.value) }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#FF8211] focus:ring-2 focus:ring-[#FF8211]/20 transition-all poppins-medium pr-10"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">min</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Color Tag</label>
                                <div className="flex flex-wrap gap-2">
                                    {colorPalette.map((c) => (
                                        <button
                                            key={c.bg}
                                            type="button"
                                            onClick={() => setForm(s => ({ ...s, color: c.bg }))}
                                            className={`w-8 h-8 rounded-full transition-all ${form.color === c.bg ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: c.bg }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                            <div>
                                {editingId && (
                                    <button
                                        onClick={() => { deleteEvent(editingId); }}
                                        className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" /> {events.find(e => e.id === editingId)?.status === 'pending' ? 'Reject' : 'Delete'}
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setModal({ open: false, date: null, time: null }); setEditingId(null); }}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors poppins-medium"
                                >
                                    Cancel
                                </button>

                                {events.find(e => e.id === editingId)?.status === 'pending' ? (
                                    <button
                                        onClick={() => {
                                            const ev = events.find(e => e.id === editingId);
                                            setEvents(s => s.map(e => e.id === editingId ? {
                                                ...e,
                                                status: 'booked',
                                                color: '#22c55e',
                                                title: `Session: ${ev.traineeName || 'Trainee'}`
                                            } : e));
                                            setModal({ open: false, date: null, time: null });
                                            setEditingId(null);
                                        }}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg shadow-green-500/30 transition-all font-bold tracking-wide active:scale-95 bebas-regular tracking-wide"
                                    >
                                        Accept Request
                                    </button>
                                ) : (
                                    <button
                                        onClick={saveEvent}
                                        className="px-6 py-2 bg-[#FF8211] hover:bg-[#ff7906] text-white rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all font-bold tracking-wide active:scale-95 bebas-regular tracking-wide"
                                    >
                                        {editingId ? 'Save Changes' : 'Add Slot'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
