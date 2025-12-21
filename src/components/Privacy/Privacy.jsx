import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Shield, Lock, Eye, FileText, Bell, UserCheck, Mail, Clock } from "lucide-react";

const Privacy = () => {
  const lastUpdated = "December 21, 2025";

  const sections = [
    {
      title: "1. Introduction",
      icon: <FileText className="text-[#FF8211]" />,
      content: "We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services. By using this website, you agree to the practices described in this policy."
    },
    {
      title: "2. Information We Collect",
      icon: <Eye className="text-[#FF8211]" />,
      content: "We may collect the following types of information: Personal information such as name and email address when you contact us; Technical data such as IP address, browser type, and device information; Usage data related to how you interact with our website."
    },
    {
      title: "3. How We Use Your Information",
      icon: <UserCheck className="text-[#FF8211]" />,
      content: "We use your information to: Provide and improve our services; Respond to support requests and inquiries; Improve user experience and website performance; Ensure security and prevent misuse. We do not sell or rent your personal data to third parties."
    },
    {
      title: "4. Legal Basis for Processing (GDPR)",
      icon: <Shield className="text-[#FF8211]" />,
      content: "We process personal data based on: Your consent; Legitimate interests such as improving our services; Legal obligations when required."
    },
    {
      title: "5. Data Protection & Security",
      icon: <Lock className="text-[#FF8211]" />,
      content: "We take reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. However, no online system is 100% secure."
    },
    {
      title: "6. Cookies Policy",
      icon: <Bell className="text-[#FF8211]" />,
      content: "We may use cookies to: Improve functionality; Analyze website usage. You can control or disable cookies through your browser settings."
    },
    {
      title: "7. Your Rights (GDPR)",
      icon: <UserCheck className="text-[#FF8211]" />,
      content: "You have the right to: Access your personal data; Request correction or deletion of your data; Withdraw consent at any time; Request data portability; Object to data processing. To exercise your rights, contact us using the information below."
    },
    {
      title: "8. Data Retention",
      icon: <Clock className="text-[#FF8211]" />,
      content: "We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-900 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="font-bebas text-6xl md:text-7xl text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400 poppins-regular uppercase tracking-[0.2em] text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-orange max-w-none">
            

            <div className="grid gap-12">
              {sections.map((section, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                      {section.icon}
                    </div>
                    <h2 className="font-bebas text-3xl text-gray-900 m-0">{section.title}</h2>
                  </div>
                  <p className="text-gray-600 poppins-regular leading-relaxed text-lg whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Changes and Contact */}
            <hr className="my-16 border-gray-100" />
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-bebas text-2xl text-gray-900 mb-4">9. Changes to This Policy</h3>
                <p className="text-gray-600 poppins-regular">
                  We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated date.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="font-bebas text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="text-[#FF8211]" size={20} />
                  10. Contact Information
                </h3>
                <p className="text-gray-600 poppins-regular mb-4">
                  If you have any questions about this Privacy Policy or your data, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-[#FF8211] font-bold poppins-medium">Email: support@example.com</p>
                  <p className="text-gray-500 text-sm poppins-regular">
                    Working Hours: Sunday – Thursday, 9:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
