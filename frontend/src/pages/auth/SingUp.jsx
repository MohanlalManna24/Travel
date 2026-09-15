import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { IoMdPerson, IoIosArrowRoundForward } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import travelIllustration from "../../assets/images/img1.jpg";
import { Link } from "react-router-dom";

const SingUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f5f3ed] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(24,50,52,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-170 overflow-hidden bg-[#cde7e3] lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-80"
            src={travelIllustration}
            alt="Illustration of famous travel destinations"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#123c3e]/90 via-[#123c3e]/10 to-transparent" />
          <div className="absolute left-10 right-10 top-10 flex items-center justify-between text-sm font-semibold tracking-[0.18em] text-white uppercase">
            <span>Travel.</span>
            <span className="rounded-full border border-white/50 px-4 py-2 text-xs tracking-[0.12em]">
              Est. 2026
            </span>
          </div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#f4c46a] uppercase">
              The world is waiting
            </p>
            <h2 className="max-w-sm text-4xl font-bold leading-tight">
              Make room for a little more wonder.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Join a community of curious travelers and keep every unforgettable
              place close.
            </p>
          </div>
        </div>
        <section className="px-6 py-5 sm:px-12 sm:py-14 lg:px-16 lg:py-10">
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold tracking-[0.28em] text-[#db8a3c] uppercase">
              Start your journey
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#183b3d] sm:text-5xl">
              Join the travel.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#687878]">
              Create your account and let the next adventure find you.
            </p>
          </div>
          <form action="" onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-[#284b4c]">
              Full name
              <span className="relative mt-2 block">
                <IoMdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#8aa3a0]" />
                <input
                  className="h-13 w-full rounded-xl border border-[#d8e2df] bg-[#fbfcfa] pl-12 pr-4 text-sm text-[#183b3d] outline-none transition placeholder:text-[#a7b5b3] focus:border-[#2f7773] focus:ring-4 focus:ring-[#2f7773]/10"
                  type="text"
                  placeholder="Enter your name here"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                  required
                  autoFocus
                  pattern="[A-Za-z\s]+"
                />
              </span>
            </label>
            <label className="block text-sm font-semibold text-[#284b4c]">
              Email address
              <span className="relative mt-2 block">
                <IoMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#8aa3a0]" />
                <input
                  className="h-13 w-full rounded-xl border border-[#d8e2df] bg-[#fbfcfa] pl-12 pr-4 text-sm text-[#183b3d] outline-none transition placeholder:text-[#a7b5b3] focus:border-[#2f7773] focus:ring-4 focus:ring-[#2f7773]/10"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                  required
                />
              </span>
            </label>
            <label className="block text-sm font-semibold text-[#284b4c]">
              Phone number
              <span className="relative mt-2 block">
                <MdOutlinePhoneAndroid className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#8aa3a0]" />
                <input
                  className="h-13 w-full rounded-xl border border-[#d8e2df] bg-[#fbfcfa] pl-12 pr-4 text-sm text-[#183b3d] outline-none transition placeholder:text-[#a7b5b3] focus:border-[#2f7773] focus:ring-4 focus:ring-[#2f7773]/10"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  name="phone"
                  onChange={handleInputChange}
                  required
                />
              </span>
            </label>
            <label className="block text-sm font-semibold text-[#284b4c]">
              Password
              <span className="relative mt-2 flex items-center">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa3a0]" />
                <input
                  className="h-13 w-full rounded-xl border border-[#d8e2df] bg-[#fbfcfa] pl-12 pr-4 text-sm text-[#183b3d] outline-none transition placeholder:text-[#a7b5b3] focus:border-[#2f7773] focus:ring-4 focus:ring-[#2f7773]/10"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                />
                {showPassword ? (
                  <FaEye
                    className="text-2xl -ml-10 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    className="text-2xl -ml-10 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </span>
            </label>
            <button
              className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl cursor-pointer bg-[#e3a348] text-sm font-bold text-[#183b3d] shadow-[0_10px_24px_rgba(227,163,72,0.24)] transition hover:bg-[#efb45b]"
              type="submit"
            >
              Create account
              <IoIosArrowRoundForward className="text-2xl transition-transform group-hover:translate-x-1" />
            </button>
          </form>
          <div className="my-8 flex items-center gap-4 text-xs font-medium text-[#91a09e]">
            <span className="h-px flex-1 bg-[#e5ebe8]" />
            <span>OR REGISTER WITH</span>
            <span className="h-px flex-1 bg-[#e5ebe8]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d8e2df] text-sm font-semibold text-[#284b4c] transition hover:border-[#2f7773] hover:bg-[#f4f9f7] cursor-pointer"
              type="button"
            >
              <FcGoogle className="text-xl" /> Google
            </button>
            <button
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d8e2df] text-sm font-semibold text-[#284b4c] transition hover:border-[#2f7773] hover:bg-[#f4f9f7] cursor-pointer"
              type="button"
            >
              <FaFacebook className="text-xl text-[#1877f2]" /> Facebook
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-[#687878]">
            Already have an account?
            <Link
              to="/auth/signin"
              className="font-bold text-[#2f7773] cursor-pointer"
            >
              <span className="font-bold text-[#2f7773] cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SingUp;
