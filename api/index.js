import app from "../backend/src/app.js";
import connectDB from "../backend/src/config/db.js";

let dbConnected = false;

export default async function handler(req, res) {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  return app(req, res);
}
