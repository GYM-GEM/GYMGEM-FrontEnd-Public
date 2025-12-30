import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { Clock, MapPin, Navigation, Flag, Building2, Map, Phone } from "lucide-react";
import axiosInstance from "../../../utils/axiosConfig";

/**
 * StoreBranchForm Component
 * Form for adding store branch location and hours
 * Matches StoreForm aesthetics
 */
const StoreBranchForm = ({ onSubmit }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange"
    });

    const { showToast } = useToast();






    const handleFormSubmit = async (data) => {
        try {
            // Format time to match request: "12:56:25.757Z"
            // Input type="time" returns "HH:MM", so we append seconds and ms
            const payload = {
                ...data,
                opening_time: data.opening_time ? `${data.opening_time}:00.000Z` : null,
                closing_time: data.closing_time ? `${data.closing_time}:00.000Z` : null,
            };

            console.log("Submitting Branch Data:", payload);

            if (onSubmit) {
                await onSubmit(payload);
            } else {
                const response = await axiosInstance.post("/api/stores/branches", payload);
                console.log("Branch Created:", response.data);
                showToast("Store branch added successfully!", { type: "success" });
                localStorage.removeItem("storeBranch"); // Clear temp data if any
                navigate("/store/dashboard");
            }
        } catch (error) {
            console.error("Error adding branch:", error);
            const errorMessage = error.response?.data?.message || "Failed to add branch. Please try again.";
            showToast(errorMessage, { type: "error" });
        }
    };

    return (
        <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
                <header className="text-center">
                    <h2 className="font-bebas text-4xl tracking-tight text-[#ff8211]">
                        Store Branch Details
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground sm:text-base text-[#555555]">
                        Add your store location and operating hours.
                    </p>
                </header>

                <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-6">

                        {/* Operating Hours Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Opening Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Opening Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        {...register("opening_time", { required: "Opening time is required" })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.opening_time && (
                                    <p className="text-xs text-destructive text-red-500">{errors.opening_time.message}</p>
                                )}
                            </div>

                            {/* Closing Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Closing Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        {...register("closing_time", { required: "Closing time is required" })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.closing_time && (
                                    <p className="text-xs text-destructive text-red-500">{errors.closing_time.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Country & State Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Country
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="e.g. United States"
                                        {...register("country", { required: "Country is required" })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                    />
                                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.country && (
                                    <p className="text-xs text-destructive text-red-500">{errors.country.message}</p>
                                )}
                            </div>

                            {/* State */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    State / Province
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="e.g. California"
                                        {...register("state", { required: "State is required" })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                    />
                                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.state && (
                                    <p className="text-xs text-destructive text-red-500">{errors.state.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Street Address - Full Width */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Street Address
                            </label>
                            <div className="relative">
                                <input
                                    placeholder="e.g. 123 Fitness Blvd"
                                    {...register("street", { required: "Street address is required" })}
                                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                />
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                            {errors.street && (
                                <p className="text-xs text-destructive text-red-500">{errors.street.message}</p>
                            )}
                        </div>

                        {/* Zip Code & Phone Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Zip Code */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Zip Code
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="e.g. 90210"
                                        {...register("zip_code", {
                                            required: "Zip code is required",
                                            pattern: {
                                                value: /^[0-9a-zA-Z\s-]{3,10}$/,
                                                message: "Invalid Zip Code"
                                            }
                                        })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                    />
                                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.zip_code && (
                                    <p className="text-xs text-destructive text-red-500">{errors.zip_code.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        placeholder="e.g. +1 555 000 0000"
                                        {...register("phone_number", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9+\-\s()]*$/,
                                                message: "Invalid phone number format"
                                            }
                                        })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                    />
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.phone_number && (
                                    <p className="text-xs text-destructive text-red-500">{errors.phone_number.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit & Skip Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                type="submit"
                                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-[#e67300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-lg shadow-orange-500/20"
                            >
                                Submit
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl border-2 border-slate-200 bg-transparent px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                Skip for now
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default StoreBranchForm;
