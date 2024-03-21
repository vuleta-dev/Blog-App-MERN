const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');


// Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check name
        if (!name) {
            return res.json({ error: 'Name is required' })
        }

        // Check password
        if (!password || password.length < 6) {
            return res.json({ error: 'Password is required and should be at least 6 characters long' })
        }

        // Check email
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({ error: 'Email is taken already' })
        }

        const hashedPassword = await hashPassword(password)

        // Create user in db
        const user = await User.create({
            name, email, password: hashedPassword
        })

        return res.json(user)

    } catch (error) {
        console.log(error)
    }
}

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ error: 'No user found' })
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password)

        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json(user)
            })
        } else {
            return res.json({ error: "Passwords do not match" })
        }

    } catch (error) {
        console.log(error)
    }
}

// Authentication
const getProfile = (req, res) => {
    const { token } = req.cookies

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}


// Logout
const logoutUser = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');

        // Send a response indicating successful logout
        res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout failed:', error);
        // Handle logout failure if needed
        res.status(500).json({ error: 'Logout failed' });
    }
}


// Edit profile
const editProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if (err) throw err;
            const { name, email, password } = req.body;

            // Check if user entered password
            if (password) {
                try {
                    // Hash new password
                    const hashedPassword = await hashPassword(password);

                    await User.updateOne({ _id: user.id }, { name, email, password: hashedPassword });

                    // New JWT
                    jwt.sign({ email, id: user.id, name }, process.env.JWT_SECRET, {}, (err, newToken) => {
                        if (err) throw err;
                        // Set cookie
                        res.cookie('token', newToken).json({ success: true, message: 'Profile updated successfully.', user: { name, email } });
                    });
                } catch (error) {
                    console.error('Error updating user profile with password:', error);
                    return res.status(500).json({ success: false, message: 'Error updating profile with password.' });
                }

            } else {
                try {
                    await User.updateOne({ _id: user.id }, { name, email });

                    // New JWT
                    jwt.sign({ email, id: user.id, name }, process.env.JWT_SECRET, {}, (err, newToken) => {
                        if (err) throw err;
                        // Set cookie
                        res.cookie('token', newToken).json({ success: true, message: 'Profile updated successfully.', user: { name, email } });
                    });
                } catch (error) {
                    console.error('Error updating user profile without password:', error);
                    return res.status(500).json({ success: false, message: 'Error updating profile without password.' });
                }
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
};


// Blost posts authors
const profileList = async (req, res) => {

    try {
        const users = await User.find({}, 'id name')
        const userList = users.map(user => ({ id: user._id, name: user.name }))
        return res.status(200).json(userList)

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { registerUser, loginUser, getProfile, logoutUser, editProfile, profileList }