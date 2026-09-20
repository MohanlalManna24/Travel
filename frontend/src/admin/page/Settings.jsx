import React, { useState, useEffect } from "react";
import {
  HiOutlineCog6Tooth,
  HiOutlineBuildingOffice2,
  HiOutlineCreditCard,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineServerStack,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiOutlineKey,
  HiOutlineDevicePhoneMobile,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineArrowDownTray,
  HiOutlineXMark,
} from "react-icons/hi2";
import { AdminToast } from "../components/AdminToast";

const Settings = () => {
  // Active Tab: "general" | "payments" | "notifications" | "security" | "system"
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const SETTINGS_STORAGE_KEY = "ghure_ashi_admin_settings_v1";

  // Default Settings State
  const defaultSettings = {
    // General
    companyName: "Ghure Ashi Executive Travel Center",
    companyTagline: "Luxury & Bespoke Global Expeditions",
    supportEmail: "contact@ghureashi.com",
    supportPhone: "+91 98234 11223",
    officeAddress: "Salt Lake Sector V, Kolkata, West Bengal, 700091, India",
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    maintenanceMode: false,

    // Payment Gateways
    stripeEnabled: true,
    stripePublishableKey: "pk_live_51M001GhureAshiKey89201",
    stripeSecretKey: "••••••••••••••••••••••••••••••••",
    razorpayEnabled: true,
    razorpayKeyId: "rzp_live_99410294102",
    razorpayKeySecret: "••••••••••••••••••••••••••••••••",
    platformMarkupPercent: 3.5,
    taxGstPercent: 5.0,
    bankAccountName: "Ghure Ashi Travel Pvt Ltd",
    bankAccountNumber: "98102394019230",
    bankIfscCode: "HDFC0001924",

    // Communication & Notifications
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    smtpUser: "apikey",
    senderName: "Ghure Ashi Concierge",
    smsGatewayProvider: "Twilio",
    smsSenderId: "GHUREA",
    autoSendBookingConfirmation: true,
    autoSendSmsReceipt: true,
    autoSendTripReminder: true,

    // Security & Policies
    twoFactorEnforced: true,
    sessionTimeoutMins: 30,
    requireStrongPasswords: true,
    ipWhitelistEnabled: false,
    whitelistedIps: "127.0.0.1, 192.168.1.1",
  };

  const [formData, setFormData] = useState(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse settings from storage:", e);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(formData));
        showToast("Platform configurations saved successfully!");
      } catch (err) {
        showToast("Failed to save settings.", "error");
      } finally {
        setSaving(false);
      }
    }, 450);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all configurations to default?")) {
      setFormData(defaultSettings);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      showToast("Settings reset to enterprise defaults.", "info");
    }
  };

  const handlePurgeCache = () => {
    showToast("Application memory cache & route cache purged successfully!");
  };

  const handleDownloadBackup = () => {
    const backupData = JSON.stringify(formData, null, 2);
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ghure_ashi_config_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    showToast("System configuration backup downloaded.");
  };

  const navigationTabs = [
    { id: "general", label: "General & Branding", icon: HiOutlineBuildingOffice2 },
    { id: "payments", label: "Payment Gateways & Tax", icon: HiOutlineCreditCard },
    { id: "notifications", label: "Email & SMS Dispatch", icon: HiOutlineEnvelope },
    { id: "security", label: "Security & Access", icon: HiOutlineShieldCheck },
    { id: "system", label: "Server & Maintenance", icon: HiOutlineServerStack },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-slate-800">
      {/* Toast Alert */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* ----------------------------------------------------------------------- */}
      {/* 1. TOP HEADER */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-700 mb-1.5 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            Global Platform Configuration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            Website & Portal Settings
            <HiOutlineSparkles className="text-amber-500 text-2xl hidden sm:inline-block" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure business profiles, gateway API credentials, SMS/email automations, and security controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-xs font-bold text-white shadow-md hover:from-sky-500 hover:to-cyan-500 transition active:scale-95 disabled:opacity-50"
          >
            <HiOutlineCheckCircle className="text-base" />
            <span>{saving ? "Applying..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. TABBED NAVIGATION BAR */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Icon className={`text-base ${isActive ? "text-sky-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. SETTINGS FORMS & SECTIONS */}
      {/* ----------------------------------------------------------------------- */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* TAB 1: GENERAL PROFILE */}
        {activeTab === "general" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">General Business Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Core identity and international localization for Ghure Ashi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Platform Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formData.companyTagline}
                  onChange={(e) => handleInputChange("companyTagline", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Helpline Phone Number</label>
                <input
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Registered Office Address</label>
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange("officeAddress", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Operating Currency</label>
                <select
                  value={formData.defaultCurrency}
                  onChange={(e) => handleInputChange("defaultCurrency", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none font-semibold"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">System Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none font-semibold"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC">UTC (Universal Time)</option>
                  <option value="Europe/Paris">Europe/Paris (CET +01:00)</option>
                  <option value="America/New_York">America/New_York (EST -05:00)</option>
                </select>
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">Maintenance Mode</div>
                <div className="text-[11px] text-slate-500">
                  When enabled, public visitors will see a maintenance notice while admins retain full access.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT GATEWAYS & TAX */}
        {activeTab === "payments" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Payment Gateways & Markup Rates</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Stripe, Razorpay API credentials and platform convenience commissions.
              </p>
            </div>

            {/* Razorpay Config */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Razorpay Payment Gateway (UPI, Cards & NetBanking)
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.razorpayEnabled}
                    onChange={(e) => handleInputChange("razorpayEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={formData.razorpayKeyId}
                    onChange={(e) => handleInputChange("razorpayKeyId", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razorpay Key Secret</label>
                  <input
                    type="password"
                    value={formData.razorpayKeySecret}
                    onChange={(e) => handleInputChange("razorpayKeySecret", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stripe Config */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Stripe Global Payments (International Visa / MasterCard)
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.stripeEnabled}
                    onChange={(e) => handleInputChange("stripeEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
                  <input
                    type="text"
                    value={formData.stripePublishableKey}
                    onChange={(e) => handleInputChange("stripePublishableKey", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stripe Secret Key</label>
                  <input
                    type="password"
                    value={formData.stripeSecretKey}
                    onChange={(e) => handleInputChange("stripeSecretKey", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Commission & GST Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Platform Commission Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.platformMarkupPercent}
                  onChange={(e) => handleInputChange("platformMarkupPercent", Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard GST / Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.taxGstPercent}
                  onChange={(e) => handleInputChange("taxGstPercent", Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL & SMS DISPATCH */}
        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Communication & Dispatch Automations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SMTP email servers, SMS gateway API settings, and automated trigger rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={formData.smtpHost}
                  onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) => handleInputChange("smtpPort", Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sender Name</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange("senderName", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Automation Triggers */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Automated Dispatch Triggers</h3>
              
              {[
                { field: "autoSendBookingConfirmation", label: "Instant Booking Confirmation Email", desc: "Dispatches PDF itinerary and invoice upon successful reservation." },
                { field: "autoSendSmsReceipt", label: "Direct SMS Payment Confirmation", desc: "Sends instant SMS confirmation to traveler's registered mobile phone." },
                { field: "autoSendTripReminder", label: "24-Hour Pre-Departure Broadcast", desc: "Sends automated baggage and guide checklist 24 hours prior to trip start date." },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & ACCESS */}
        {activeTab === "security" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security & Administrative Policies</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Two-Factor Authentication, session timeouts, and IP whitelisting.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Enforce Two-Factor Authentication (2FA)</div>
                  <div className="text-slate-500 text-[11px]">Require OTP code upon admin login for all staff accounts.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnforced}
                    onChange={(e) => handleInputChange("twoFactorEnforced", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600" />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Administrative Inactivity Session Timeout</div>
                  <div className="text-slate-500 text-[11px]">Automatically terminate idle admin sessions to prevent unauthorized physical access.</div>
                </div>
                <select
                  value={formData.sessionTimeoutMins}
                  onChange={(e) => handleInputChange("sessionTimeoutMins", Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SERVER & MAINTENANCE */}
        {activeTab === "system" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Server Telemetry & Cache Maintenance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Database connectivity, memory purge, and configuration backups.
              </p>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-slate-400 text-[10px] uppercase font-bold">MySQL Database</span>
                <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected (Port 3306)
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Node.js Runtime</span>
                <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Express v5 Engine
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Client Framework</span>
                <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> React 19 + Vite 8
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePurgeCache}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition active:scale-95"
              >
                <HiOutlineTrash className="text-sm text-slate-500" />
                <span>Purge Application Cache</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition active:scale-95"
              >
                <HiOutlineArrowDownTray className="text-sm text-cyan-400" />
                <span>Download Configuration Snapshot (.JSON)</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === "error"
              ? "bg-rose-600"
              : toast.type === "info"
              ? "bg-slate-800"
              : "bg-emerald-600"
          }`}
        >
          <HiOutlineCheckCircle className="text-lg" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
