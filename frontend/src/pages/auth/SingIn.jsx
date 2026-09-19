import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiOutlineArrowPath } from "react-icons/hi2";
import travelIllustration from "../../assets/images/img2.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          withCredentials: true, // Enables HTTP-Only cookies (accessToken & refreshToken)
        }
      );

      if (response.data?.user) {
        // Persist client auth state
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("accessToken", response.data.accessToken || "");
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to profile or requested previous page
        const redirectPath = location.state?.from || "/profile/overview";
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error("Invalid response received from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password. Please check your credentials.";
      setErrorMessage(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f5f3ed] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(24,50,52,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Hero Image */}
        <div className="relative hidden min-h-170 overflow-hidden bg-[#cde7e3] lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-80"
            src={travelIllustration}
            alt="Illustration of famous travel destinations"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123c3e]/90 via-[#123c3e]/10 to-transparent" />
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

        {/* Right Form Section */}
        <section className="px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-20">
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold tracking-[0.28em] text-[#db8a3c] uppercase">
              Continue your journey
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#183b3d] sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#687878]">
              Sign in to your account with secure token authentication.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200/80 p-4 text-xs text-rose-800 flex items-start gap-3 animate-in fade-in duration-200">
              <HiOutlineExclamationCircle className="text-lg text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Notice: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoFocus
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-[#284b4c]">
              Password
              <span className="relative mt-2 flex items-center">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa3a0]" />
                <input
                  className="h-13 w-full rounded-xl border border-[#d8e2df] bg-[#fbfcfa] pl-12 pr-12 text-sm text-[#183b3d] outline-none transition placeholder:text-[#a7b5b3] focus:border-[#2f7773] focus:ring-4 focus:ring-[#2f7773]/10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-lg text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>

            <button
              disabled={loading}
              className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl cursor-pointer bg-[#e3a348] text-sm font-bold text-[#183b3d] shadow-[0_10px_24px_rgba(227,163,72,0.24)] transition hover:bg-[#efb45b] disabled:opacity-50"
              type="submit"
            >
              {loading ? (
                <>
                  <HiOutlineArrowPath className="animate-spin text-lg" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <IoIosArrowRoundForward className="text-2xl transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs font-medium text-[#91a09e]">
            <span className="h-px flex-1 bg-[#e5ebe8]" />
            <span>OR SIGN IN WITH</span>
            <span className="h-px flex-1 bg-[#e5ebe8]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d8e2df] text-sm font-semibold text-[#284b4c] transition hover:border-[#2f7773] hover:bg-[#f4f9f7] cursor-pointer"
              type="button"
              onClick={() => alert("Google OAuth login will be available with live cloud client ID.")}
            >
              <FcGoogle className="text-xl" /> Google
            </button>
            <button
              className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#d8e2df] text-sm font-semibold text-[#284b4c] transition hover:border-[#2f7773] hover:bg-[#f4f9f7] cursor-pointer"
              type="button"
              onClick={() => alert("Facebook OAuth login will be available with live client ID.")}
            >
              <FaFacebook className="text-xl text-[#1877f2]" /> Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#687878]">
            Don't have an account yet?{" "}
            <Link to="/auth/signup" className="font-bold text-[#2f7773] hover:underline cursor-pointer">
              Register now
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignIn;
