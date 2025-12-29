import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { Store, Image, AlignLeft, Layers } from "lucide-react";
import UploadImage from "../../UploadImage";
import axiosInstance from "../../../utils/axiosConfig";

/**
 * StoreForm Component
 * Form for creating/editing store profile
 * Redesigned to match TrainerForm aesthetics
 */
const StoreForm = ({ onSubmit }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            store_type: "Supplements"
        }
    });

    const { showToast } = useToast();

    const handleFormSubmit = async (data) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
          
            const payload = {
                ...data,
                profile_id: user?.id || 0,
            };

            console.log("Submitting payload:", payload);

            if (onSubmit) {
                await onSubmit(payload);
            } else {
                const response = await axiosInstance.post("/api/stores/", payload);
                console.log("Store Created:", response.data);
                showToast("Store profile created successfully!", { type: "success" });
                navigate("/storebranch");
            }

        } catch (error) {
            console.error("Error creating store:", error);
            showToast("Failed to create store. Please try again.", { type: "error" });
        }
    };

    return (
        <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
                <header className="text-center">
                    <h2 className="font-bebas text-4xl tracking-tight text-[#ff8211]">
                        Store Profile
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground sm:text-base text-[#555555]">
                        Create your unique store profile to start selling products on GymGem.
                    </p>
                </header>

                <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-6">


                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Profile Picture
                            </label>
                            <div className="flex flex-col items-center sm:items-start gap-4 p-4 border border-border rounded-xl bg-slate-50/50">
                                <UploadImage onUpload={(url) => setValue("profile_picture", url, { shouldValidate: true })} />
                                <input
                                    type="hidden"
                                    {...register("profile_picture", { required: "Profile picture is required" })}
                                />
                            </div>
                            {errors.profile_picture && (
                                <p className="text-xs text-destructive text-red-500">
                                    {errors.profile_picture.message}
                                </p>
                            )}
                        </div>

                        {/* Store Name & Store Type Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Store Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Store Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        placeholder="e.g. GymGem Supplements"
                                        {...register("name", {
                                            required: "Store name is required",
                                            minLength: {
                                                value: 3,
                                                message: "Name must be at least 3 characters",
                                            },
                                        })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                                    />
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-destructive text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Store Type */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="store_type"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Store Type
                                </label>
                                <div className="relative">
                                    <select
                                        id="store_type"
                                        {...register("store_type", {
                                            required: "Please select a store type",
                                        })}
                                        className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background appearance-none cursor-pointer"
                                    >
                                        <option value="Supplements">Supplements</option>
                                        <option value="Clothes">Clothes</option>
                                        <option value="Both">Both</option>
                                    </select>
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                                {errors.store_type && (
                                    <p className="text-xs text-destructive text-red-500">
                                        {errors.store_type.message}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium text-foreground"
                            >
                                Description
                            </label>
                            <div className="relative">
                                <textarea
                                    id="description"
                                    rows="4"
                                    placeholder="Tell us about your store..."
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: {
                                            value: 10,
                                            message: "Description must be at least 10 characters",
                                        },
                                    })}
                                    className="w-full rounded-xl border border-border bg-background/80 p-3 pl-10 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground resize-none"
                                />
                                <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                            </div>
                            {errors.description && (
                                <p className="text-xs text-destructive text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleFormSubmit}
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-[#e67300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background mt-4 shadow-lg shadow-orange-500/20"
                        >
                            Submit & Next
                        </button>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default StoreForm;
