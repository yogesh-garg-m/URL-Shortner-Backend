const express = require('express');
const { connectToMongoDB} = require('./connect.js');
const urlRoute = require("./routes/url.js");
const URL = require('./models/url.js');

connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
.then(()=> console.log('Connected to MongoDB'))
.catch(()=> console.log('Failed to connect to MongoDB'));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/url', urlRoute);
app.get('/:shortid', async (req, res) => {
    try {
        const shortid = req.params.shortid;
        console.log("Received shortID:", shortid);

        const entry = await URL.findOneAndUpdate(
            { shortID: shortid },
            { $push: { visitHistory: { timeStamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            console.log("Short URL not found in DB");
            return res.status(404).json({ error: "Short URL not found" });
        }

        let redirectURL = entry.redirectURL;

        // Ensure the URL starts with http:// or https://
        if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
            redirectURL = "https://" + redirectURL;
        }

        console.log("Redirecting to:", redirectURL);
        res.redirect(redirectURL);
    } catch (error) {
        console.error("Error in GET request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.listen(PORT, () => console.log("Server Started at PORT : " + PORT));