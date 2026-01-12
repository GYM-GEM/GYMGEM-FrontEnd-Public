import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Cover_img from "../../assets/fitCartoon3.png";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            showToast("Invalid or missing reset token.", { type: "error" });
            navigate("/login");
        }
    }, [token, navigate, showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", { type: "error" });
            return;
        }

        if (password.length < 8) {
            showToast("Password must be at least 8 characters long.", { type: "error" });
            return;
        }

        setIsLoading(true);

        try {
            // User requested API: /api/accounts/reset-password
            // Assuming 'reset-password' is intentional as per user instruction. 
            // Payload typically requires token and new password.
            await axios.post(`${VITE_API_URL}/api/accounts/reset-password`, {
                token: token,
                newPassword: password,
                confirmPassword: confirmPassword,
            });

            showToast("Password has been reset successfully!", { type: "success" });
            navigate("/login");
        } catch (error) {
            console.error("Reset password error:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to reset password. Token may be invalid or expired.";
            showToast(errorMessage, { type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <motion.div
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
                <div className="grid overflow-hidden rounded-[24px] border border-border bg-card shadow-sm lg:min-h-[640px] lg:grid-cols-2">

                    {/* ========== Form ========== */}
                    <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:px-12">
                        <div className="mx-auto w-full max-w-sm space-y-8">
                            <header className="space-y-3 text-center lg:text-left">
                                <h1 className="font-bebas text-3xl tracking-tight sm:text-4xl">
                                    Reset Password
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter a new password for your account.
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* New Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-11 w-full rounded-xl border border-border bg-background/90 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#ff8211] outline-none transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="h-11 w-full rounded-xl border border-border bg-background/90 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#ff8211] outline-none transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full h-11 items-center justify-center rounded-xl bg-[#ff8211] text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e67300] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Reseting...
                                            </>
                                        ) : (
                                            "Set New Password"
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center">
                                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-[#ff8211] transition">
                                    Back to Login
                                </Link>
                            </div>

                        </div>
                    </div>

                    {/* ========== Visual Panel ========== */}
                    <div className="relative hidden bg-muted lg:block order-1 lg:order-2">
                        <img
                            src={Cover_img}
                            alt="Reset Password"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-background/20 to-transparent" />
                        <div className="relative flex h-full items-end justify-start p-10">
                            <div className="max-w-xs space-y-2 rounded-2xl bg-background/80 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur">
                                <p className="font-semibold text-foreground">
                                    Secure your account.
                                </p>
                                <p>
                                    Choose a strong password to keep your progress and data safe.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default ResetPasswordPage;
