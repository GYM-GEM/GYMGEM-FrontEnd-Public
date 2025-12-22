import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    CreditCard,
    Lock,
    ShieldCheck,
} from "lucide-react";

export default function PaymentPage({
    total = 0,
    iframeUrl: initialIframeUrl = null,
    paymentId = null,
    course = null,
    user = null
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [iframeUrl, setIframeUrl] = useState(initialIframeUrl);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
    });

    /* ----------------------------------
       1️⃣ Set iframe URL from props
    -----------------------------------*/
    useEffect(() => {
        if (initialIframeUrl) {
            setIframeUrl(initialIframeUrl);
        }
    }, [initialIframeUrl]);

    /* ----------------------------------
       2️⃣ Handle Paymob redirect result
    -----------------------------------*/
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const success = params.get("success");
        const pending = params.get("pending");

        if (success === "true") {
            navigate("/courses", { replace: true });
        }

        if (success === "false") {
            navigate("/payment/failed", { replace: true });
        }

        // pending = true → لا تعمل شيء
    }, [location.search, navigate]);

    /* ----------------------------------
       3️⃣ Form handlers
    -----------------------------------*/
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            // If we don't have an iframe URL, we need to start the payment
            if (!iframeUrl && course) {
                const token = localStorage.getItem("access");

                // Call the payment start endpoint with course ID
                const res = await fetch(`${VITE_API_URL}/api/payment/start/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        course_id: course.id,
                        payment_method: paymentMethod,
                    }),
                });

                if (!res.ok) throw new Error("Failed to initialize payment");

                const data = await res.json();

                // backend returns iframe_url
                if (data.iframe_url) {
                    setIframeUrl(data.iframe_url);
                }
            }
        } catch (err) {
            setError(err.message || "Unable to start payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    /* ----------------------------------
       4️⃣ UI
    -----------------------------------*/
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {iframeUrl ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                        Complete Your Payment
                    </h2>

                    <div
                        className="w-full overflow-hidden rounded-lg"
                        style={{ height: "750px" }}
                    >
                        <iframe
                            src={iframeUrl}
                            className="w-full h-full border-0"
                            title="Payment Gateway"
                            allow="payment"
                            scrolling="no"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 poppins-regular mt-4">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>Secure payment powered by Paymob</span>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                        Payment Information
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Payment Method */}
                        <div>
                            <label className="text-sm font-medium text-gray-900 poppins-medium mb-3 block">
                                Payment Method
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("credit_card")}
                                    className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${paymentMethod === "credit_card"
                                        ? "border-[#FF8211] bg-[#FF8211]/5"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <span className="text-sm poppins-medium">
                                        Credit Card
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("paypal")}
                                    className="p-4 border-2 rounded-lg flex flex-col items-center gap-2 border-gray-200"
                                >
                                    💳
                                    <span className="text-sm poppins-medium">PayPal</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("bank")}
                                    className="p-4 border-2 rounded-lg flex flex-col items-center gap-2 border-gray-200"
                                >
                                    🏦
                                    <span className="text-sm poppins-medium">Bank</span>
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 poppins-regular">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full px-6 py-4 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-colors shadow-md disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : `Complete Purchase - $${total}`}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 poppins-regular">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>Secure 256-bit SSL encryption</span>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
