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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "destination", element: <Destination /> },
      { path: "contact", element: <Contact /> },
      {path: "auth/signup", element: <SignUp />},
      {path: "auth/signIn", element: <SignIn />},
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
