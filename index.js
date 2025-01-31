const express = require('express');
const { connectToMongoDB } = require('./connect.js');
const path = require('path');
const cookieParser = require("cookie-parser");
const { restrictTologgedInnUsersOnly, checkAuth } = require('./middlewares/auth.js');

// Routes
const urlRoute = require("./routes/url.js");
const staticRouter = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.js");


connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
.then(() => console.log('Connected to MongoDB'))
.catch(() => console.log('Failed to connect to MongoDB'));

const app = express();
const PORT = 3000;

// Default middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Correctly invoke cookieParser

// Defined middlewares
app.use('/url', restrictTologgedInnUsersOnly, urlRoute);
app.use('/', checkAuth,staticRouter); // Use staticRouter for home page rendering
app.use('/user', userRoute);

app.set("view engine", 'ejs');
app.set('views', path.resolve('./views'));

app.listen(PORT, () => console.log("Server Started at PORT : " + PORT));
