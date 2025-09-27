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
const allowedOrigins = [
  'https://navachethana2025tripbca.netlify.app',
  'https://68d8142bf81d73000862b662--navachethana2025tripbca.netlify.app'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
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
