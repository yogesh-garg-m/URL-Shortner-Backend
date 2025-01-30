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
        res.status(201).send({ message: 'New short URL generated successfully', id: shortID });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to generate new short URL' });
    }
}

module.exports = {
    handleGenerateNewShortURL
}