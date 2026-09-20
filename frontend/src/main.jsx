import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Destination from "./pages/Destination.jsx";
import Contact from "./pages/Contact.jsx";
import SignUp from "./pages/auth/SingUp.jsx";
import SignIn from "./pages/auth/SingIn.jsx";
import NotFound from "./pages/NotFound.jsx";
import DetailsDestination from "./pages/DetailsDestination.jsx";
import UserProfileHub from "./pages/UserProfileHub.jsx";
import AdminLayout from "./admin/components/AdminLayout.jsx";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute.jsx";
import AdminLogin from "./admin/page/AdminLogin.jsx";
import Dashboard from "./admin/page/Dashboard.jsx";
import TripManagement from "./admin/page/TripManagement.jsx";
import UserManagement from "./admin/page/UserManagement.jsx";
import BookingManagement from "./admin/page/BookingManagement.jsx";
import Notification from "./admin/page/Notification.jsx";
import PaymentAndRevenue from "./admin/page/PaymentAndRevenue.jsx";
import Settings from "./admin/page/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "destination", element: <Destination /> },
      { path: "destination/:destinationId", element: <DetailsDestination /> },
      { path: "contact", element: <Contact /> },
      { path: "profile", element: <UserProfileHub /> },
      { path: "profile/*", element: <UserProfileHub /> },
      { path: "auth/signup", element: <SignUp /> },
      { path: "auth/signin", element: <SignIn /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "trips", element: <TripManagement /> },
          { path: "users", element: <UserManagement /> },
          { path: "bookings", element: <BookingManagement /> },
          { path: "payments", element: <PaymentAndRevenue /> },
          { path: "notifications", element: <Notification /> },
          { path: "settings", element: <Settings /> },
          { path: "*", element: <Dashboard /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
