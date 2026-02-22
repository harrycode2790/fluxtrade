import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

const PORT = ENV.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
