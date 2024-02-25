const express = require('express');
const connectDB = require('./db');
const authRoutes = require('../src/routes/auth');
const userRoutes = require('../src/routes/user');
const pictureRoute = require('../src/routes/picture');
//const travelGuideRoutes = require('../src/routes/travelGuide');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Define API endpoints
app.use('/API', pictureRoute);
//app.use('/travelGuide', travelGuideRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});