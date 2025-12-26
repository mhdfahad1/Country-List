import express, { Application } from "express";
import cors from "cors";
import countryRoutes from "./routes/country.route";

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/countries", countryRoutes);

app.get("/", (_req, res) => {
  res.send("Country API is running");
});

export default app;
