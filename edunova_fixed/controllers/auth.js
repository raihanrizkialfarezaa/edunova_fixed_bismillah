const { User } = require('../models');
const { BlacklistedToken } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Register
exports.register = async (req, res) => {
    
  console.log('DB_PASS:', process.env.DB_PASS); //buat nyoba aja
  console.log('ENV FILE LOADED:', process.env.DB_USER, process.env.DB_HOST);

  const { name, email, password, role = 'STUDENT' } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (blacklist token)
exports.logout = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(400).json({ message: 'No token to logout' });

  const decoded = jwt.decode(token); // Hanya decode, tidak verify

  const expiresAt = new Date(decoded.exp * 1000); // Ubah dari UNIX ke Date

  try {
    await BlacklistedToken.create({ token, expiresAt });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Me
exports.getMe = (req, res) => {
  res.json(req.user); // req.user didapat dari middleware auth
};

// Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};