import { FaGem } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FooterDash({
  company = "GYMGEM",
  links = [
    { label: "Docs", href: "/docs" },
    { label: "Support", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  className = "",
}) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative border-t border-gray-100 bg-white py-8 mt-auto ${className}`}
      role="contentinfo"
    >
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF8211] to-transparent opacity-40" />

      <div className="mx-auto w-[90%] max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Section */}
        <div className="flex items-center gap-2 group order-2 md:order-1">
          <div className="p-2 bg-[#FF8211]/10 rounded-lg group-hover:bg-[#FF8211]/20 transition-colors duration-300">
            <FaGem className="text-[#9ebd77] text-lg" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="text-sm font-medium poppins-medium text-gray-700">
              © {year} <span className="text-[#FF8211] font-bebas text-lg tracking-wider align-middle ml-1">{company}</span>. 
            </p>
            <span className="hidden sm:inline ml-2 text-xs text-gray-400 poppins-regular uppercase tracking-widest">Built for Excellence</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 order-1 md:order-2"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="text-sm text-gray-500 poppins-regular transition-all duration-300 hover:text-[#FF8211] relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FF8211] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
