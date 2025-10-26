import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import beds24Routes from "./routes/beds24Routes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));


app.use("/api/beds24", beds24Routes);


app.get("/", (req, res) => {
  res.send("Beds24 Integration Backend Running ");
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
