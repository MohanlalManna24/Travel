import {
  FaMapLocationDot,
  FaMoneyCheckDollar,
  FaLocationDot,
} from "react-icons/fa6";
import { MdAddchart } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdOutlineSupportAgent } from "react-icons/md";
import Layout from "./layout/Layout";

const WhyChoose = () => {
  const benefits = [
    {
      icon: FaMapLocationDot,
      title: "Unique Destinations",
      description:
        "Looking for a unique vacation destination? Then maybe a trip to one of the 10 most unique tourist destinations might.",
    },
    {
      icon: FaMoneyCheckDollar,
      title: "Value for Money",
      description:
        "There is not a better way to spend money, than spending money on travel. This is what we say, others and science.",
    },
    {
      icon: MdAddchart,
      title: "Quick Booking",
      description:
        "Booking is quick as clicking a few clicks. We take care of all transportation and accommodations during your journey.",
    },
    {
      icon: HiMiniUserGroup,
      title: "Best Tour Guide",
      description:
        "We have the best tour guides who will make your trip more enjoyable and memorable by providing you with the best services.",
    },
    {
      icon: MdOutlineSupportAgent,
      title: "24/7 Support",
      description:
        "We provide 24/7 support to our customers to make sure that they have a smooth and hassle free experience.",
    },
    {
      icon: FaLocationDot,
      title: "Wonderful Places",
      description:
        "We do our best to have you a wonderful experience by taking you to the wonderful and amazing places around the world.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
      <Layout>
        <div className="absolute -right-24 top-16 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl flex flex-col items-center justify-center text-center sm:mx-auto sm:mb-16">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Why Choose <span className="text-cyan-600">Travel.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              We offer most competitive rates and offers for wonderful and
              beautiful places.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-2 lg:py-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10"
              >
                <span className="absolute right-6 top-5 text-3xl lg:text-5xl font-black text-slate-100 transition-colors duration-300 group-hover:text-cyan-50">
                  0{index + 1}
                </span>
                <div className="relative mb-7 grid h-10 w-10 lg:h-14 lg:w-14 place-items-center rounded-2xl bg-cyan-50 text-2xl text-cyan-600 transition duration-300 group-hover:rotate-6 group-hover:bg-cyan-600 group-hover:text-white">
                  <Icon />
                </div>
                <h2 className="relative text-base font-extrabold text-slate-900 lg:text-2xl">
                  {title}
                </h2>
                <p className="mt-3 text-[10px] leading-6 text-slate-600 lg:text-sm">
                  {description}
                </p>
                <div className="mt-6 h-1 w-8 rounded-full bg-cyan-300 transition-all duration-300 group-hover:w-16 group-hover:bg-cyan-600" />
              </article>
            ))}
          </div>
        </div>
      </Layout>
    </section>
  );
};

export default WhyChoose;
