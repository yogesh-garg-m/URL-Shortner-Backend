const {v4: uuidv4} = require("uuid");
const User = require('../models/user.js')
const {setUser, getUser} = require('../service/auth.js')

async function handleUserSignUp(req,res){
    const {name, email, password} = req.body;
    try {
        await User.create({name,email,password});
        return res.redirect('/');
    } catch (error) {
        console.error("Error during sign up:", error);
        return res.render('signup', {
            error: 'Failed to create user. Please try again.'
        });
    }
}

async function handleUserLogin(req,res){
    const {email, password} = req.body;
    const user = await User.findOne({email,password});

    if(!user){
        return res.render('login',{
            error: 'Invalid email or password'
        })
    }

    const sessionID = uuidv4();
    setUser(sessionID, user);
    res.cookie("uid", sessionID);
    return res.redirect('/')
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
}
