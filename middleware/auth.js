const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your secret
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;