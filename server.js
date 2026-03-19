const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// We removed /noiseDB from the string and added it explicitly as dbName
mongoose.connect("mongodb+srv://rohan:rohan123@cluster0.0s5yfgg.mongodb.net/", {
  dbName: "noiseDB"
})
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const NoiseSchema = new mongoose.Schema({
  location: String,
  noiseIndex: Number,
  timestamp: Date
});

const Noise = mongoose.model("Noise", NoiseSchema);

// Save data route
app.post("/save", async (req, res) => {
  console.log("📡 DATA RECEIVED FROM BROWSER:", req.body);  

  try {
    const data = new Noise(req.body);
    await data.save();
    console.log("💾 ✅ Data successfully saved to database!");
    res.status(200).send("Saved");
  } catch (error) {
    console.error("💾 ❌ Failed to save to database:", error);
    res.status(500).send("Database error");
  }
});

// Fetch data (for future dashboard)
app.get("/data", async (req, res) => {
  try {
    const data = await Noise.find();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));