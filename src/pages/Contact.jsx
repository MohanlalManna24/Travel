import { useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import Layout from "../components/layout/Layout";

const contactOptions = [
  { icon: FiMail, label: "Email us", value: "hello@travel.com", detail: "We reply within one business day.", color: "bg-[#06d6a0]/15 text-[#069c78]" },
  { icon: FiPhone, label: "Call our team", value: "+91 XXXXX-XXXXX", detail: "Monday to Saturday, 9am to 7pm.", color: "bg-[#ef476f]/15 text-[#db315c]" },
  { icon: FiMapPin, label: "Visit our studio", value: "Kolkata, India", detail: "Come say hello over a cup of chai.", color: "bg-[#ffd166]/30 text-[#b77a00]" },
];

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="overflow-hidden bg-[#f7fbfa]">
      <section className="relative bg-[#073b4c] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(6,214,160,0.3),transparent_27%),radial-gradient(circle_at_10%_90%,rgba(239,71,111,0.28),transparent_30%)]" />
        <div className="absolute -right-24 top-12 h-64 w-64 rounded-full border-24 border-[#ffd166]/25" />
        <Layout>
          <div className="relative px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#ffd166]"><FiMessageCircle className="text-[#06d6a0]" /> Let&apos;s talk travel</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">Your next great trip starts with a <span className="text-[#06d6a0]">conversation.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-cyan-50/75 sm:text-lg">Have a destination in mind or just a feeling? Tell us what you are dreaming about and our travel team will help shape it into something real.</p>
          </div>
        </Layout>
      </section>

      <section className="relative z-10 -mt-8 px-6 pb-20 sm:px-10 lg:px-12 lg:pb-28">
        <Layout>
          <div className="grid gap-5 md:grid-cols-3">
            {contactOptions.map(({ icon: Icon, label, value, detail, color }) => (
              <article key={label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-[#073b4c]/10 transition duration-300 hover:-translate-y-2">
                <div className={`mb-5 grid h-12 w-12 place-items-center rounded-xl text-xl ${color}`}><Icon /></div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-black text-[#073b4c]">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="pt-3">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ef476f]">Start planning</p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-[#073b4c] sm:text-5xl">Let&apos;s make a plan that feels like yours.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">Share a few details and we will come back with ideas, honest advice, and a little inspiration.</p>
              <div className="mt-9 flex items-start gap-3 text-sm text-slate-600"><FiClock className="mt-0.5 shrink-0 text-[#ef476f]" /><span><strong className="text-[#073b4c]">Fast, friendly replies.</strong><br />Most messages receive a response within 24 hours.</span></div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-xl shadow-[#073b4c]/10 sm:p-8">
              {isSubmitted ? (
                <div className="flex min-h-90 flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#06d6a0]/15 text-3xl text-[#069c78]"><FiSend /></div>
                  <h3 className="mt-6 text-2xl font-black text-[#073b4c]">Message received.</h3>
                  <p className="mt-3 max-w-sm leading-7 text-slate-600">Thanks for reaching out. Our team will be in touch soon with the next step for your journey.</p>
                  <button type="button" onClick={() => setIsSubmitted(false)} className="mt-6 text-sm font-bold text-[#db315c] underline underline-offset-4">Send another message</button>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#073b4c]">Your name<input required type="text" placeholder="Alex Morgan" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7fbfa] px-4 py-3 font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#06d6a0] focus:ring-4 focus:ring-[#06d6a0]/10" /></label>
                    <label className="text-sm font-bold text-[#073b4c]">Email address<input required type="email" placeholder="alex@example.com" className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7fbfa] px-4 py-3 font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#06d6a0] focus:ring-4 focus:ring-[#06d6a0]/10" /></label>
                  </div>
                  <label className="mt-5 block text-sm font-bold text-[#073b4c]">What can we help with?<select className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7fbfa] px-4 py-3 font-normal text-slate-700 outline-none transition focus:border-[#06d6a0] focus:ring-4 focus:ring-[#06d6a0]/10"><option>Planning a new trip</option><option>Changing an existing booking</option><option>Destination recommendations</option><option>Something else</option></select></label>
                  <label className="mt-5 block text-sm font-bold text-[#073b4c]">Your message<textarea required rows="5" placeholder="Tell us about your dream trip..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-[#f7fbfa] px-4 py-3 font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#06d6a0] focus:ring-4 focus:ring-[#06d6a0]/10" /></label>
                  <button type="submit" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#ef476f] px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-1 hover:bg-[#073b4c]">Send my message <FiArrowRight className="transition-transform group-hover:translate-x-1" /></button>
                </>
              )}
            </form>
          </div>
        </Layout>
      </section>

      <section className="bg-[#ffd166] px-6 py-14 sm:px-10 lg:px-12">
        <Layout>
          <div className="grid gap-8 sm:grid-cols-3">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef476f]">Before you write</p><h2 className="mt-2 text-2xl font-black text-[#073b4c]">Quick answers</h2></div>
            {[["Can you plan custom trips?", "Absolutely. Every journey can be shaped around you."], ["Do you help with groups?", "Yes, we love making group travel feel simple."]].map(([question, answer]) => <div key={question}><p className="font-black text-[#073b4c]">{question}</p><p className="mt-2 text-sm leading-6 text-[#073b4c]/70">{answer}</p></div>)}
          </div>
        </Layout>
      </section>
    </main>
  );
};

export default Contact;
