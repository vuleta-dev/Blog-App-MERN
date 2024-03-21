const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();


// db con
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Database not connected!', err))


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));



app.use('/users', require('./routes/authRoutes'))
app.use('/blogs', require('./routes/blogRoutes'))

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`))

