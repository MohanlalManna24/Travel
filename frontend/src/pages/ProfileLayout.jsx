import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7fbfa]">
      <Sidebar />
      <main className="min-h-screen pb-20 lg:pl-64 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout
