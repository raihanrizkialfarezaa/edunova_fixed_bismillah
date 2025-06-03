const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { BlacklistedToken } = require('../models');
const { JWT_SECRET } = process.env;

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Cek apakah token ada di blacklist
    const blacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (blacklisted) return res.status(401).json({ message: 'Token revoked' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};