import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
    CheckCircle2,
    XCircle,
    Home,
    BookOpen,
    Loader2,
    ArrowRight,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    // Get status and course ID from URL params
    const status = searchParams.get("status"); // 'success' or 'failed'
    const courseId = searchParams.get("course_id");

    const isSuccess = status === "success";

    // Countdown and auto-redirect for success
    useEffect(() => {
        if (isSuccess && courseId) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate(`/trainee/courses/${courseId}/learn`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isSuccess, courseId, navigate]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full">
                    {/* Main Status Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            {isSuccess ? (
                                <div className="w-24 h-24 bg-[#86ac55]/10 rounded-full flex items-center justify-center animate-bounce">
                                    <CheckCircle2 className="w-16 h-16 text-[#86ac55]" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bebas-regular mb-4">
                            {isSuccess ? "Payment Successful!" : "Payment Failed"}
                        </h1>

                        {/* Message */}
                        <p className="text-lg text-gray-600 poppins-regular mb-8 max-w-md mx-auto">
                            {isSuccess
                                ? "Congratulations! Your enrollment has been confirmed. You can now start learning."
                                : "We couldn't process your payment. Please try again or contact support if the problem persists."}
                        </p>

                        {/* Success: Auto-redirect message */}
                        {isSuccess && courseId && (
                            <div className="mb-8 p-4 bg-[#86ac55]/10 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-[#86ac55] poppins-medium">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>
                                        Redirecting to your course in {countdown} second{countdown !== 1 ? "s" : ""}...
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {isSuccess ? (
                                // Success: Manual redirect button
                                courseId && (
                                    <Link
                                        to={`/trainee/courses/${courseId}/learn`}
                                        className="w-full sm:w-auto px-8 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        Start Learning Now
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )
                            ) : (
                                // Failed: Two options
                                <>
                                    {courseId && (
                                        <Link
                                            to={`/trainee/courses/${courseId}`}
                                            className="w-full sm:w-auto px-8 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            Try Again
                                        </Link>
                                    )}
                                    <Link
                                        to="/"
                                        className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold bebas-regular text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Home className="w-5 h-5" />
                                        Go Home
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Additional Info for Failed Payment */}
                        {!isSuccess && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500 poppins-regular">
                                    Need help? Contact our support team at{" "}
                                    <a
                                        href="mailto:support@gymgem.com"
                                        className="text-[#FF8211] hover:underline font-medium"
                                    >
                                        support@gymgem.com
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Success: Additional Course Access Info */}
                    {isSuccess && (
                        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 bebas-regular mb-3">
                                What's Next?
                            </h3>
                            <ul className="space-y-2 text-gray-600 poppins-regular">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#86ac55] shrink-0 mt-0.5" />
                                    <span>Access all course materials and lessons</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#86ac55] shrink-0 mt-0.5" />
                                    <span>Track your progress and earn certificates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#86ac55] shrink-0 mt-0.5" />
                                    <span>Join the community and discuss with peers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#86ac55] shrink-0 mt-0.5" />
                                    <span>Get support from your instructor</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PaymentStatus;
