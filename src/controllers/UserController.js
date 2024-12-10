const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');

const handleUserAuthPage = (req, res) => {
    if (req.session && req.session.loggedUser) {
        return res.redirect("/main")
    };
    res.render("userAuth")
}

const handleUserSignin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email & Password Required");
    }

    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send("Please Signup");
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }

        // Save user info in the session
        req.session.loggedUser = existingUser;

        // Redirect to main page
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

const handleUserSignup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email & Password Required");
    }

    try {
        // Check if the email already exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).send("User already exists");
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();

        // Save user info in session
        req.session.loggedUser = newUser;

        // Redirect to main page
        res.redirect("/main");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

const handleUserLogout = async (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out, please try again.");
        }

        // Redirect the user to the login page or home page after logout
        res.redirect("/");
    });
};

module.exports = {
    handleUserAuthPage, handleUserSignin, handleUserSignup, handleUserLogout
}