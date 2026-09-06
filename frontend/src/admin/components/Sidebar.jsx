import React from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { FaHistory, FaRegUser, FaRegAddressCard } from "react-icons/fa";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { BsBoxes, BsCashCoin } from "react-icons/bs";

const Sidebar = () => {
  const sidebarItems = [
    {
      id: 1,
      name: " Dashboard Overview",
      path: "/admin/dashboard",
      icon: <BsBoxes />,
    },
    {
      id: 2,
      name: "Trip Management",
      path: "/admin/trips",
      icon: <PiAirplaneTakeoffLight />,
    },
    {
      id: 3,
      name: "Booking Management",
      path: "/admin/bookings",
      icon: <FaRegAddressCard />,
    },
    {
      id: 4,
      name: "User Management",
      path: "/admin/users",
      icon: <FaRegUser />,
    },
    {
      id: 5,
      name: "Payment & Revenue",
      path: "/admin/payments",
      icon: <BsCashCoin />,
    },
    {
      id: 6,
      name: "Notification",
      path: "/admin/notifications",
      icon: <IoNotificationsOutline />,
    },
    {
      id: 7,
      name: "Website settings",
      path: "/admin/settings",
      icon: <IoSettingsOutline />,
    },
  ];
  return (
    <>
      <aside className="fixed inset-x-0 bottom-0 top-auto z-50 h-16 w-full border-t border-[#073b4c]/10 bg-[#f5f3ed] shadow-lg lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:border-t-0 lg:p-6">
        <section className="mt-5 hidden items-center gap-3 lg:flex">
          <div className="profileImg w-15 h-15 rounded-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQxZjvZuCyMCf_mS8zJbA8snsYQ90twlnVsAu3zsX-jg&s=10"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-center">Mohanlal</h1>
            <p className="text-[12px]">Administrator</p>
          </div>
        </section>
        {/* <div className="w-full h-0.5 mt-5 bg-gray-300"></div> */}
        <button className="mt-5 hidden w-full items-center justify-center gap-2 rounded-lg bg-[#073b4c] px-4 py-2 text-white hover:bg-[#021f17] hover:text-[#b3e8f9] cursor-pointer lg:flex">
          <IoMdAdd /> Add New Trip
        </button>
        <div className="action h-full lg:h-auto">
          <ul className="flex h-full items-center justify-around gap-1 px-2 lg:block lg:h-auto lg:px-0">
            <li className="flex-1 lg:hidden">
              <Link
                to="/"
                className="flex items-center justify-center rounded-xl px-3 py-2 text-amber-600 transition hover:bg-amber-600/10 hover:text-amber-700"
                aria-label="Log out"
              >
                <span className="text-xl">
                  <RiLogoutCircleLine />
                </span>
              </Link>
            </li>
            {sidebarItems.map((item) => (
              <li key={item.id} className="flex-1 lg:mt-3 lg:flex-none">
                <NavLink
                  to={item.path}
                  end={item.path === "/profile"}
                  className={({ isActive }) =>
                    `flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition lg:justify-start lg:gap-3 lg:rounded-none lg:px-4 lg:py-3 ${
                      isActive
                        ? "bg-[#073b4c] text-white lg:border-l-4 lg:border-[#073b4c] lg:bg-transparent lg:scale-110 lg:text-blue-500"
                        : "text-[#073b4c] hover:bg-[#073b4c]/10 hover:text-[#073b4c]"
                    }`
                  }
                >
                  <span className="text-xl lg:text-lg">{item.icon}</span>
                  <span className="hidden lg:block">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <section className="absolute bottom-10 left-0 hidden w-full px-6 lg:block">
          <Link to="/">
            <button className="flex items-center justify-center gap-2 border-2 border-amber-500 p-2 px-15 rounded-xl hover:bg-amber-600 cursor-pointer">
              <RiLogoutCircleLine />
              Log-Out
            </button>
          </Link>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
