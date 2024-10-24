// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken')



//Register

router.post('/register', async (req, res) => {
  const { name, email, username, password } = req.body

  try {
    const existEmail = await (User.findOne({ email }))
    const existUsername = await (User.findOne({ username }))
    if (existEmail) {
      return res.status(400).json({ message: 'email already exist' })
    }
    if (existUsername) {
      return res.status(400).json({ message: 'Username already exist' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, username, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: 'Registered Successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }

})




//Login
// POST route for user login
router.post('/login', async (req, res) => {
 
  const { username, password } = req.body;
  
  try {
    // Find the user by username or email
    const user = await User.findOne({
       username: username 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Login success, return a success message or token
    const jwtToken = jwt.sign({ username: username }, 'my_secret_token', { expiresIn: '1h' });
    return res.status(200).json({ jwt_token: jwtToken, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);  // Log the error
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;

