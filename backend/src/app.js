import express from "express";
import userRoutes from "./routes/user.routes.js";
import userFullDetails from "./routes/userFullDetails.routes.js";
import destinations from "./routes/destinations.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
}));

app.use("/api/users", userRoutes);

app.use("/api/user-details", userFullDetails);

app.use("/api/destinations", destinations);

app.use("/api/bookings", bookingsRoutes);

export default app;

