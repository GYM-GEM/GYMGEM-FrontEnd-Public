import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";
import { useToast } from "../../context/ToastContext";

const Support = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    // Only validate message since other fields are commented out
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // API expects 'details' and 'target_complaint'
      // We combine form data into the 'details' field since the API only accepts that text field.
      // We send target_complaint as null since this is a general support message.
      const detailsContent = {
        message: formData.message
      };

      await axiosInstance.post("/api/utils/complaints/", {
        target_complaint: null,
        details: detailsContent
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      showToast("Message sent successfully!", { type: "success" });
    } catch (error) {
      console.error("Error sending complaint:", error);
      setIsSubmitting(false);
      showToast("Failed to send message. Please try again.", { type: "error" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600 w-10 h-10" />
            </div>
            <h2 className="font-bebas text-4xl text-gray-900 mb-4">Message Sent!</h2>
            <p className="text-gray-600 mb-8 poppins-regular">
              Thank you for reaching out. Our support team will get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-[#FF8211] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              Send Another Message
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-900 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="font-bebas text-6xl text-white mb-4 tracking-tight">
            Support
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-lg poppins-regular">
            Need help? Contact our support team and we’ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="font-bebas text-3xl text-gray-900 mb-6">Contact Info</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8211]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 poppins-regular uppercase tracking-wider">Email Us</p>
                    <p className="text-gray-900 font-semibold poppins-medium">support@gymgem.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8211]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 poppins-regular uppercase tracking-wider">Call Us</p>
                    <p className="text-gray-900 font-semibold poppins-medium">+1 (555) 000-0000</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8211]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 poppins-regular uppercase tracking-wider">Working Hours</p>
                    <p className="text-gray-900 font-semibold poppins-medium">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <h3 className="font-bebas text-2xl text-gray-900 mb-4">FAQ</h3>
              <p className="text-gray-600 poppins-regular text-sm mb-4">
                Have a quick question? Check our documentation or common questions.
              </p>
              <a href="/docs" className="text-[#FF8211] font-semibold flex items-center gap-2 hover:underline">
                View Help Center →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-5 py-4 bg-gray-50 border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] transition-all poppins-regular`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs ml-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-5 py-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] transition-all poppins-regular`}
                    />
                    {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
                  </div>*/}
                </div>

                {/* <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] transition-all poppins-regular"
                  />
                </div> */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    rows="5"
                    className={`w-full px-5 py-4 bg-gray-50 border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] transition-all poppins-regular resize-none`}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-10 py-4 bg-[#FF8211] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
