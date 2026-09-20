import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageLoader from "./components/PageLoader.jsx";

// Core Public Pages (fast load)
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Destination = lazy(() => import("./pages/Destination.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const SignUp = lazy(() => import("./pages/auth/SingUp.jsx"));
const SignIn = lazy(() => import("./pages/auth/SingIn.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const DetailsDestination = lazy(() => import("./pages/DetailsDestination.jsx"));
const UserProfileHub = lazy(() => import("./pages/UserProfileHub.jsx"));

// Admin Module (Code Split & Lazily Evaluated)
const AdminLayout = lazy(() => import("./admin/components/AdminLayout.jsx"));
const AdminProtectedRoute = lazy(() => import("./admin/components/AdminProtectedRoute.jsx"));
const AdminLogin = lazy(() => import("./admin/page/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./admin/page/Dashboard.jsx"));
const TripManagement = lazy(() => import("./admin/page/TripManagement.jsx"));
const UserManagement = lazy(() => import("./admin/page/UserManagement.jsx"));
const BookingManagement = lazy(() => import("./admin/page/BookingManagement.jsx"));
const Notification = lazy(() => import("./admin/page/Notification.jsx"));
const PaymentAndRevenue = lazy(() => import("./admin/page/PaymentAndRevenue.jsx"));
const Settings = lazy(() => import("./admin/page/Settings.jsx"));

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "about", element: withSuspense(About) },
      { path: "destination", element: withSuspense(Destination) },
      { path: "destination/:destinationId", element: withSuspense(DetailsDestination) },
      { path: "contact", element: withSuspense(Contact) },
      { path: "profile", element: withSuspense(UserProfileHub) },
      { path: "profile/*", element: withSuspense(UserProfileHub) },
      { path: "auth/signup", element: withSuspense(SignUp) },
      { path: "auth/signin", element: withSuspense(SignIn) },
      { path: "*", element: withSuspense(NotFound) },
    ],
  },
  {
    path: "/admin/login",
    element: withSuspense(AdminLogin),
  },
  {
    path: "/admin",
    element: withSuspense(AdminProtectedRoute),
    children: [
      {
        element: withSuspense(AdminLayout),
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: "dashboard", element: withSuspense(Dashboard) },
          { path: "trips", element: withSuspense(TripManagement) },
          { path: "users", element: withSuspense(UserManagement) },
          { path: "bookings", element: withSuspense(BookingManagement) },
          { path: "payments", element: withSuspense(PaymentAndRevenue) },
          { path: "notifications", element: withSuspense(Notification) },
          { path: "settings", element: withSuspense(Settings) },
          { path: "*", element: withSuspense(Dashboard) },
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
