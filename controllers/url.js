const shortid = require("shortid");
const URL = require('../models/url')
async function handleGenerateNewShortURL(req, res) {
    try {
        const body = req.body;
        if(!body.url) return res.status(400).json({error: "URL is required"});
         const shortID = shortid();
         await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
         });
         return res.render('home',{
            id : shortID
         } )
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to generate new short URL' });
    }
}

async function handleRedirectURL (req, res)  {
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
}
module.exports = {
    handleGenerateNewShortURL,
    handleRedirectURL
}