import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import logo from "../../src/assets/icons/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#07090d] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 flex flex-col items-left text-left">
            <a href="#" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-cyan-500/10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <img src={logo} alt="logo"/>
              </div>

              <span className="text-2xl font-bold tracking-tight">Travel.</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              We make travel simple, inspiring, and unforgettable. Find your
              next destination and start creating memories.
            </p>

            {/* Contact */}
            <div className="mt-8 flex flex-col items-start space-y-4 text-sm text-gray-400">
              <div className="flex items-center gap-3 transition-colors hover:text-white">
                <FiMail className="text-cyan-400" />
                hello@travel.com
              </div>

              <div className="flex items-center gap-3 transition-colors hover:text-white">
                <FiPhone className="text-cyan-400" />
                +91 XXXXX-XXXXX
              </div>

              <div className="flex items-center gap-3 transition-colors hover:text-white">
                <FiMapPin className="text-cyan-400" />
                Kolkata, India
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <ul className="flex flex-col items-start space-y-4 text-sm text-gray-400">
              {[
                "Destinations",
                "Tours",
                "Hotels",
                "Travel Guide",
                "Offers",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-1 hover:text-cyan-400"
                  >
                    {item}
                    <HiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="flex flex-col items-start space-y-4 text-sm text-gray-400">
              {["About Us", "Our Team", "Careers", "Contact", "Blog"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-1 hover:text-cyan-400"
                    >
                      {item}
                      <HiArrowUpRight
                        size={13}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>

            <ul className="flex flex-col items-start space-y-4 text-sm text-gray-400">
              {[
                "Help Center",
                "FAQs",
                "Privacy Policy",
                "Terms",
                "Refund Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-1 hover:text-cyan-400"
                  >
                    {item}
                    <HiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-sm text-gray-500 md:text-left">
            © {currentYear} Travel. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              {
                icon: <FaFacebookF />,
                label: "Facebook",
              },
              {
                icon: <FaInstagram />,
                label: "Instagram",
              },
              {
                icon: <FaTwitter />,
                label: "Twitter",
              },
              {
                icon: <FaYoutube />,
                label: "YouTube",
              },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
