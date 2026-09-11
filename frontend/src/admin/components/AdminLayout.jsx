import Sidebar from "../../admin/components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fbfa]">
      <Sidebar />
      <Header onNotificationClick={() => navigate("/admin/notifications")} />
      <main className="min-h-screen pb-24 lg:pl-72 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
