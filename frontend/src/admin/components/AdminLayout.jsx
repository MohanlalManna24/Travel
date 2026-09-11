import Sidebar from "../../admin/components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7fbfa]">
      <Sidebar />
      <Header />
      <main className="min-h-screen pb-24 lg:pl-72 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
