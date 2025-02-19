const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Ensure JWT_SECRET is set in .env
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server error: JWT_SECRET is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Store decoded user info
    next(); // ✅ Continue to the next middleware or route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    } else {
      return res.status(500).json({ error: 'Server error: JWT verification failed' });
    }
  }
};

