import {
  Facebook,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Youtube,
  Home,
  Mail,
  Phone,
  PhoneCall,
  Briefcase,
} from "lucide-react";
import { FaGem } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#FFF8F0] text-center w-[100%] ">
      <div className="w-[80%] m-auto">
        <div className="flex items-center justify-center border-b-2 border-neutral-200 p-6 dark:border-white/10 lg:justify-between">
          <div className="me-12 hidden lg:block">
            <span className="text-black">
              Get connected with us on social networks:
            </span>
          </div>

          <div className="flex justify-center gap-6">
            <a href="#!" className="hover:text-blue-600">
              <Facebook size={25} />
            </a>
            <a href="#!" className="hover:text-sky-500">
              <Twitter size={25} />
            </a>
            <a href="#!" className="hover:text-pink-500">
              <Instagram size={25} />
            </a>
            <a href="#!" className="hover:text-red-600">
              <Youtube size={25} />
            </a>
            <a href="#!" className="hover:text-gray-900 dark:hover:text-white">
              <Github size={25} />
            </a>
            <a href="#!" className="hover:text-blue-700">
              <Linkedin size={25} />
            </a>
          </div>
        </div>

        <div className="mx-6 py-10 text-center md:text-left">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h6 className="text-[#FF7A00] mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                <FaGem className="text-2xls mr-2 text-[#81a346]" />
                GYMGEM
              </h6>
              <p>
                Here you can use rows and columns to organize your footer
                content. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit.
              </p>
            </div>

            <div>
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Products
              </h6>
              <p className="mb-4">
                <a href="#!">Angular</a>
              </p>
              <p className="mb-4">
                <a href="#!">React</a>
              </p>
              <p className="mb-4">
                <a href="#!">Vue</a>
              </p>
              <p>
                <a href="#!">Laravel</a>
              </p>
            </div>

            <div>
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Useful links
              </h6>
              <p className="mb-4">
                <a href="#!">Pricing</a>
              </p>
              <p className="mb-4">
                <a href="#!">Settings</a>
              </p>
              <p className="mb-4">
                <a href="#!">Orders</a>
              </p>
              <p>
                <a href="#!">Help</a>
              </p>
            </div>

            <div>
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Contact
              </h6>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <Home className="me-3 h-5 w-5" />
                New York, NY 10012, US
              </p>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <Mail className="me-3 h-5 w-5" />
                info@example.com
              </p>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <Phone className="me-3 h-5 w-5" />+ 01 234 567 88
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <PhoneCall className="me-3 h-5 w-5" />+ 01 234 567 89
              </p>
            </div>
          </div>
        </div>

        <div className=" p-6 text-center">
          <span>© 2025 Copyright:</span>
          <a className="font-semibold ml-1" href="https://pin.it/5rGLlXZeA/">
            GYMGEM
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
