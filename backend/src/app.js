import express from "express";
import userRoutes from "./routes/user.routes.js";
import userFullDetails from "./routes/userFullDetails.routes.js";
import destinations from "./routes/destinations.routes.js"

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/user-details", userFullDetails);

app.use("/api/destinations", destinations)

export default app;
