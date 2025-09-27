const express = require('express');
const cors = require('cors');
const connectDB = require('./models/db');
require('dotenv').config();

const authRouter = require('./routes/auth');
const imageRoute = require('./routes/imageUpload');
const visitorRoute = require('./routes/visitor');
const sessions = require('express-session');
const MongoStore = require('connect-mongo');

connectDB();

const app = express();

// CORS for React frontend
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.set('trust proxy', 1); // required if behind a proxy like localhost

// Session setup
app.use(sessions({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MoNGO_URL,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'lax' for localhost
  }
}));

// Routes
app.use('/user', authRouter);
app.use('/', imageRoute);
app.use('/', visitorRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
