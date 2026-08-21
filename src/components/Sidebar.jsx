import React from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import { BsBoxes } from "react-icons/bs";

const Sidebar = () => {
  const sidebarItems = [
    { id: 1, name: "Overview", path: "/profile/overview", icon: <BsBoxes /> },
    {
      id: 2,
      name: "Trips",
      path: "/profile/trips",
      icon: <PiAirplaneTakeoffLight />,
    },
    { id: 3, name: "History", path: "/profile/history", icon: <FaHistory /> },
    {
      id: 4,
      name: "Notification",
      path: "/profile/notifications",
      icon: <IoNotificationsOutline />,
    },
    { id: 5, name: "Profile", path: "/profile/details", icon: <CgProfile /> },
    {
      id: 6,
      name: "Settings",
      path: "/profile/settings",
      icon: <IoSettingsOutline />,
    },
    {
      id: 7,
      name: "Help & Support",
      path: "/profile/help",
      icon: <IoIosHelpCircleOutline />,
    },
  ];
  return (
    <>
      <aside className="fixed inset-x-0 bottom-0 top-auto z-50 h-16 w-full border-t border-[#073b4c]/10 bg-[#f5f3ed] shadow-lg lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:border-t-0 lg:p-6">
        <section className="mt-5 hidden items-center gap-3 lg:flex">
          <div className="profileImg w-15 h-15 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold">Name Title</h1>
            <p className="text-[12px]">Premium Traveler</p>
          </div>
        </section>
        {/* <div className="w-full h-0.5 mt-5 bg-gray-300"></div> */}
        <button className="mt-5 hidden w-full items-center justify-center gap-2 rounded-lg bg-[#073b4c] px-4 py-2 text-white hover:bg-[#021f17] hover:text-[#b3e8f9] cursor-pointer lg:flex">
          <IoMdAdd /> Book New Trip
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
        <section className="absolute bottom-5 left-0 hidden w-full px-6 lg:block">
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
