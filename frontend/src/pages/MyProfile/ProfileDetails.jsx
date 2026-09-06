import React, { useState } from "react";
import { FiUser, FiPhone, FiMail, FiMapPin, FiGlobe, FiSave, FiShield, FiCamera } from "react-icons/fi";

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    preferredAirport: "",
    preferredSeat: "Window",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    dietaryPreference: "",
    medicalNotes: "",
    profileImage:
      "https://mohanlalmanna.vercel.app/assets/profileImg-DNYu86pM.png",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("profileDetails", JSON.stringify(profileData));
    setStatusMessage("Profile details updated successfully.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageValue = typeof reader.result === "string" ? reader.result : "";
      setProfileData((prev) => ({ ...prev, profileImage: imageValue }));
    };
    reader.readAsDataURL(selectedFile);
  };

  const inputClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#118ab2] focus:ring-4 focus:ring-[#118ab2]/10";

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ef476f]">Profile settings</p>
          <h1 className="mt-2 text-3xl font-black text-[#073b4c] sm:text-4xl">Update Your Full Profile Details</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Keep your personal information, emergency contact, and travel preferences up to date for a faster booking experience.
          </p>

          {statusMessage && (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {statusMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={profileData.profileImage}
                alt="Profile preview"
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white shadow"
              />
              <div>
                <p className="text-sm font-bold text-[#073b4c]">Profile Photo</p>
                <p className="text-xs text-slate-500">JPG or PNG, max 5MB recommended</p>
              </div>
            </div>
            <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#073b4c]/20 bg-white px-4 text-sm font-semibold text-[#073b4c] transition hover:bg-[#073b4c]/5">
              <FiCamera /> Upload Photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[#073b4c]">
              <FiUser /> Personal Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                First Name
                <input name="firstName" value={profileData.firstName} onChange={handleChange} className={inputClassName} required />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Last Name
                <input name="lastName" value={profileData.lastName} onChange={handleChange} className={inputClassName} required />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                <span className="mb-1 inline-flex items-center gap-2"><FiMail /> Email</span>
                <input type="email" name="email" value={profileData.email} onChange={handleChange} className={inputClassName} required />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                <span className="mb-1 inline-flex items-center gap-2"><FiPhone /> Phone</span>
                <input name="phone" value={profileData.phone} onChange={handleChange} className={inputClassName} required />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Date of Birth
                <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Gender
                <select name="gender" value={profileData.gender} onChange={handleChange} className={inputClassName}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[#073b4c]">
              <FiMapPin /> Address Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Address Line 1
                <input name="addressLine1" value={profileData.addressLine1} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Address Line 2
                <input name="addressLine2" value={profileData.addressLine2} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                City
                <input name="city" value={profileData.city} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                State
                <input name="state" value={profileData.state} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                ZIP Code
                <input name="zipCode" value={profileData.zipCode} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Country
                <input name="country" value={profileData.country} onChange={handleChange} className={inputClassName} />
              </label>
            </div>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[#073b4c]">
              <FiGlobe /> Travel Preferences
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Nationality
                <input name="nationality" value={profileData.nationality} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Passport Number
                <input name="passportNumber" value={profileData.passportNumber} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Preferred Airport
                <input name="preferredAirport" value={profileData.preferredAirport} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Preferred Seat
                <select name="preferredSeat" value={profileData.preferredSeat} onChange={handleChange} className={inputClassName}>
                  <option value="Window">Window</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Middle">Middle</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Dietary Preference
                <input name="dietaryPreference" value={profileData.dietaryPreference} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Medical Notes
                <textarea
                  name="medicalNotes"
                  value={profileData.medicalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#118ab2] focus:ring-4 focus:ring-[#118ab2]/10"
                />
              </label>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[#073b4c]">
              <FiShield /> Emergency Contact
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Full Name
                <input name="emergencyName" value={profileData.emergencyName} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Phone Number
                <input name="emergencyPhone" value={profileData.emergencyPhone} onChange={handleChange} className={inputClassName} />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Relationship
                <input name="emergencyRelation" value={profileData.emergencyRelation} onChange={handleChange} className={inputClassName} />
              </label>
            </div>
          </article>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <button
            type="submit"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#073b4c] px-5 text-sm font-bold text-white transition hover:bg-[#0f627d]"
          >
            <FiSave /> Save Profile Details
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileDetails;
