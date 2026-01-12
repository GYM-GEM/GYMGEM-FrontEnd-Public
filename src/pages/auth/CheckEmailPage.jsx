import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Cover_img from "../../assets/fitCartoon3.png";

const CheckEmailPage = () => {
    return (
        <motion.div
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
                <div className="grid overflow-hidden rounded-[24px] border border-border bg-card shadow-sm lg:min-h-[640px] lg:grid-cols-2">

                    {/* ========== Visual Panel ========== */}
                    <div className="relative hidden bg-muted lg:block">
                        <img
                            src={Cover_img}
                            alt="Check Email"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/20 to-transparent" />
                        <div className="relative flex h-full items-end justify-start p-10">
                            <div className="max-w-xs space-y-2 rounded-2xl bg-background/80 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur">
                                <p className="font-semibold text-foreground">
                                    You're almost there!
                                </p>
                                <p>
                                    We've sent you a verification email. Click the link inside to activate your GymGem account.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ========== Content ========== */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 order-1 lg:order-2">
                        <div className="mx-auto w-full max-w-md space-y-8 text-center">

                            {/* Mail Icon */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#ff8211]/20 blur-2xl rounded-full"></div>
                                    <div className="relative bg-gradient-to-br from-[#ff8211] to-[#e67300] p-6 rounded-3xl shadow-lg">
                                        <Mail className="w-16 h-16 text-white" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>

                            {/* Header */}
                            <header className="space-y-3">
                                <h1 className="font-bebas text-4xl sm:text-5xl tracking-tight text-foreground">
                                    Check Your Email
                                </h1>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                                </p>
                            </header>

                            {/* Instructions */}
                            <div className="bg-muted/50 rounded-2xl p-6 space-y-4 text-left border border-border">
                                <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                                    Next Steps:
                                </h2>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff8211] text-white flex items-center justify-center text-xs font-bold">1</span>
                                        <span>Open your email inbox</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff8211] text-white flex items-center justify-center text-xs font-bold">2</span>
                                        <span>Find the email from GymGem (check spam if needed)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff8211] text-white flex items-center justify-center text-xs font-bold">3</span>
                                        <span>Click the verification link to activate your account</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Back to Login */}
                            <div className="pt-6 border-t border-border">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default CheckEmailPage;
