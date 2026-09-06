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
import ProfileLayout from "./pages/ProfileLayout.jsx";
import Overview from "./pages/MyProfile/Overview.jsx";
import Trips from "./pages/MyProfile/Trips.jsx";
import ProfileDetails from "./pages/MyProfile/ProfileDetails.jsx";
import AdminLayout from "./admin/components/AdminLayout.jsx";
import Dashboard from "./admin/page/Dashboard.jsx";

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
      { path: "auth/signup", element: <SignUp /> },
      { path: "auth/signin", element: <SignIn /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/profile",
    element: <ProfileLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "overview", element: <Overview /> },
      { path: "trips", element: <Trips /> },
      { path: "trips/:destinationId", element: <DetailsDestination /> },
      { path: "details", element: <ProfileDetails /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout/>,
    children:[
      {path:"admin",element:<Dashboard/>}
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
