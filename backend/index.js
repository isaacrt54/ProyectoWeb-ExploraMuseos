const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const museumRoutes = require('./routes/museums');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutes
app.get('/', (req, res) => res.send('API Exploradores de Museos is running...'));

// Import routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/museums', museumRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));