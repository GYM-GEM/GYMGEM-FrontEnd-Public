import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import cover_img from "../../assets/cover.svg";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link. No token found.");
                return;
            }

            try {
                await axios.post(`${VITE_API_URL}/api/accounts/verify`, {
                    token: token,
                });
                setStatus("success");
                setMessage("Email verified successfully! You can now log in.");

                // Optional: Auto redirect after few seconds
                setTimeout(() => {
                    navigate("/login");
                }, 5000);

            } catch (error) {
                setStatus("error");
                setMessage(
                    error.response?.data?.error ||
                    error.response?.data?.detail ||
                    "Verification failed. The link may have expired or is invalid."
                );
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <motion.div
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
                <div className="grid overflow-hidden rounded-[24px] border border-border bg-card shadow-sm lg:min-h-[600px] lg:grid-cols-2">
                    {/* ========== Illustration  ========== */}
                    <div className="relative hidden bg-muted lg:block">
                        <img
                            src={cover_img}
                            alt="GymGem verification"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-primary/10 to-transparent" />
                        <div className="relative flex h-full items-end justify-start p-10">
                            <div className="max-w-xs space-y-2 rounded-2xl bg-background/80 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur">
                                <p className="font-semibold text-foreground">
                                    <span className="text-[#f0e1da]">Secure your </span>
                                    GymGem account.
                                </p>
                                <p>
                                    Verifying your email ensures your account is safe and ready to go.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ========== Content  ========== */}
                    <div className="flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-12 text-center">
                        <div className="mx-auto w-full max-w-md space-y-8">

                            <div className="flex flex-col items-center justify-center space-y-4">
                                {status === "verifying" && (
                                    <FaSpinner className="text-6xl text-[#ff8211] animate-spin" />
                                )}
                                {status === "success" && (
                                    <FaCheckCircle className="text-6xl text-green-500" />
                                )}
                                {status === "error" && (
                                    <FaTimesCircle className="text-6xl text-red-500" />
                                )}

                                <h1 className="font-bebas text-3xl tracking-tight sm:text-4xl mt-4">
                                    {status === "verifying" && "Verifying..."}
                                    {status === "success" && "Verified!"}
                                    {status === "error" && "Verification Failed"}
                                </h1>

                                <p className="text-muted-foreground">
                                    {message}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                {status !== "verifying" && (
                                    <Link
                                        to="/login"
                                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#ff8211] px-4 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
                                    >
                                        Go to Login
                                    </Link>
                                )}

                                {status === "success" && (
                                    <p className="text-xs text-muted-foreground">
                                        Redirecting to login in 5 seconds...
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VerifyPage;
