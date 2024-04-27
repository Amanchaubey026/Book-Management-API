const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.schema');

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).send('Invalid token.');
  }
};

module.exports = {
    auth
};
