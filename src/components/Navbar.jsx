import { useState } from "react";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import Layout from "./layout/Layout.jsx";
import { IoPerson } from "react-icons/io5";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";



const Navbar = () => {
  const [isLogin, setIsLogin] = useState(true); // Replace with actual login state from your authentication logic

  const menuItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Destination", to: "/destination" },
    { name: "Contact", to: "/contact" },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-300 ${
      isActive ? "text-cyan-300" : "text-white/75 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-30 bg-slate-950 px-4 py-3 pt-3 shadow-2xl shadow-slate-950/10 backdrop-blur-xl sm:px-6 lg:px-8">
      <Layout>
        <div className="rounded-2xl sm:px-6">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="group flex items-center gap-2.5">
              <img
                src={logo}
                alt="Travel home"
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:rotate-6"
              />
              <span className="text-xl font-black tracking-tight text-white">
                Travel<span className="text-cyan-300">.</span>
              </span>
            </NavLink>

            <nav
              className="hidden items-center gap-8 md:flex"
              aria-label="Main navigation"
            >
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `${getLinkClass({ isActive })} after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-cyan-300 after:transition-all after:duration-300 ${
                      isActive ? "after:w-full" : "after:w-0 hover:after:w-1/2"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {isLogin ? (
                <Link to="/profile/overview" className="flex items-center text-white border border-white/80 rounded-full px-4 py-2 text-sm font-semibold transition hover:border-cyan-300 hover:text-cyan-300">
                  <IoPerson className="inline-block mr-1 text-lg" />
                  Profile
                </Link>
              ) : (
                <Link
                  to="/auth/signin"
                  className="flex items-center text-white border border-white/80 rounded-full px-4 py-2 text-sm font-semibold transition hover:border-cyan-300 hover:text-cyan-300"
                >
                  Login
                  <FaArrowUpRightFromSquare className="inline-block my-1 mx-2.5 text-lg" />
                </Link>
              )}
              <NavLink
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                Book now
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
            </div>

            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-xl text-white transition hover:border-cyan-300 hover:text-cyan-300 md:hidden"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          <nav
            className={`${isMenuOpen ? "grid grid-rows-[1fr] pt-4" : "grid grid-rows-[0fr]"} transition-all duration-300 md:hidden`}
            aria-label="Mobile navigation"
          >
            <div className="overflow-hidden">
              <div className="grid gap-1 border-t border-white/10 pt-3">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-cyan-300 text-slate-950"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <NavLink
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-cyan-300 text-slate-950"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          </nav>
        </div>
      </Layout>
    </header>
  );
};

export default Navbar;
