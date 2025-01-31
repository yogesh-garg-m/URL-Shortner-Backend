const express = require("express");
const { handleUserSignUp, handleUserLogin } = require("../controllers/user.js");

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signUp'); // Render the signup page
});

router.post('/', handleUserSignUp);
router.post('/login', handleUserLogin);

module.exports = router;
