const express = require("express");
const {handleGenerateNewShortURL,  handleRedirectURL} = require("../controllers/url.js")
const router = express.Router();


router
    .post("/", handleGenerateNewShortURL)
    .get("/:shortid", handleRedirectURL);
module.exports = router;