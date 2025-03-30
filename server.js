
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());
// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    redentials: true,
}));

// Routes
app.use('/', indexRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
