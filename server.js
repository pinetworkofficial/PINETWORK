const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nycer84:22Zs37OelVnqlJ3q@cluster0.g89nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,


})
.then(() => {
    console.log('Connected to MongoDB Atlas!');
})
.catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// MongoDB schema for storing the name and passphrase
const userSchema = new mongoose.Schema({
    name: String,
    passphrase: String
});

const User = mongoose.model('User', userSchema);

// Serve the index.html when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit-passphrase', (req, res) => {
    const { name, passphrase } = req.body;
    
    // Save the name and passphrase in the database
    const newUser = new User({ name, passphrase });
    newUser.save()
        .then(() => {
            res.send('Name and passphrase saved successfully!');
        })
        .catch((error) => {
            console.error(error);
            res.send('Failed to store name and passphrase.');
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
