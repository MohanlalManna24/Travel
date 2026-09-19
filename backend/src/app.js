import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import userFullDetails from "./routes/userFullDetails.routes.js";
import destinations from "./routes/destinations.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/users", userRoutes);

app.use("/api/user-details", userFullDetails);

app.use("/api/destinations", destinations);

app.use("/api/bookings", bookingsRoutes);

app.use("/api/notifications", notificationsRoutes);

export default app;


