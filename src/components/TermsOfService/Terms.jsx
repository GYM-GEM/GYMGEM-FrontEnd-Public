import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Scale, FileText, UserCheck, ShieldAlert, Globe, HelpCircle, Mail, Ban, CreditCard, Link as LinkIcon, PowerOff } from "lucide-react";

const Terms = () => {
  const lastUpdated = "December 2025";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Scale className="text-[#FF8211]" />,
      content: "By accessing and using this website (GymGem), you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of our services immediately."
    },
    {
      title: "2. Use of the Website",
      icon: <Globe className="text-[#FF8211]" />,
      content: "You agree to use GymGem only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our platform."
    },
    {
      title: "3. User Accounts",
      icon: <UserCheck className="text-[#FF8211]" />,
      content: "To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
    },
    {
      title: "4. Intellectual Property",
      icon: <FileText className="text-[#FF8211]" />,
      content: "The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws and are owned by GymGem or its licensors. Unless expressly permitted, you may not copy, distribute, or create derivative works from any part of the website."
    },
    {
      title: "5. Payments & Subscriptions",
      icon: <CreditCard className="text-[#FF8211]" />,
      content: "Some services may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to change our subscription plans or adjust pricing for our service in any manner and at any time as we may determine in our sole and absolute discretion."
    },
    {
      title: "6. Limitation of Liability",
      icon: <ShieldAlert className="text-[#FF8211]" />,
      content: "GymGem shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or for the cost of procurement of substitute goods and services."
    },
    {
      title: "7. Termination",
      icon: <PowerOff className="text-[#FF8211]" />,
      content: "We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
    },
    {
      title: "8. Third-Party Links",
      icon: <LinkIcon className="text-[#FF8211]" />,
      content: "Our service may contain links to third-party web sites or services that are not owned or controlled by GymGem. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services."
    },
    {
      title: "9. Changes to These Terms",
      icon: <HelpCircle className="text-[#FF8211]" />,
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. What constitutes a material change will be determined at our sole discretion."
    },
    {
      title: "10. Governing Law",
      icon: <Scale className="text-[#FF8211]" />,
      content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which GymGem operates, without regard to its conflict of law provisions."
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
            Terms of Service
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
                <article key={index} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                      {section.icon}
                    </div>
                    <h2 className="font-bebas text-3xl text-gray-900 m-0">{section.title}</h2>
                  </div>
                  <p className="text-gray-600 poppins-regular leading-relaxed text-lg whitespace-pre-line">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>

            <hr className="my-16 border-gray-100" />
            
            <section className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-bebas text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="text-[#FF8211]" size={20} />
                  Legal Assistance
                </h3>
                <p className="text-gray-600 poppins-regular">
                  If you require further explanation regarding our terms and conditions, our legal department is available to provide clarification.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="font-bebas text-2xl text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="text-[#FF8211]" size={20} />
                  11. Contact Information
                </h3>
                <p className="text-gray-600 poppins-regular mb-4">
                  For any questions regarding these Terms, please contact us at:
                </p>
                <div className="space-y-2">
                  <p className="text-[#FF8211] font-bold poppins-medium">Email: support@gymgem.com</p>
                  <p className="text-gray-500 text-sm poppins-regular italic">
                    All inquiries are typically addressed within 2-3 business days.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
