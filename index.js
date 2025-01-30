const express = require('express');
const { connectToMongoDB } = require('./connect.js');
const urlRoute = require("./routes/url.js");
const staticRouter = require("./routes/staticRouter.js");
const URL = require('./models/url.js');
const path = require('path');

connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
.then(()=> console.log('Connected to MongoDB'))
.catch(()=> console.log('Failed to connect to MongoDB'));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/url', urlRoute);
app.use('/', staticRouter); // Use staticRouter for home page rendering

app.set("view engine",'ejs');
app.set('views',path.resolve('./views'));

app.listen(PORT, () => console.log("Server Started at PORT : " + PORT));
