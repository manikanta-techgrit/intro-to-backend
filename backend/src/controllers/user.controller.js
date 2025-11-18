import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const user = await User.create({ username, password, email: email.toLowerCase(),loggedIn:false });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Error registering user :', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    // check the user credentials from req.body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // find the user in the database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // compare the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Error logging in user :', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const logoutUser = async (req, res) => {
  try {
    // Expect the user's email in the request body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the user by email and update the `loggedIn` flag without triggering
    // the document `save` middleware or validation for other fields.
    // Using `findOneAndUpdate` with `runValidators: false` avoids re-validating
    // the existing hashed password length (useful if schema restricts password length).
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { loggedIn: false } },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Logout successful', user: { id: updatedUser._id, email: updatedUser.email } });
  } catch (error) {
    console.error('Error logging out user :', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { registerUser, loginUser, logoutUser };