const jwt = require('jsonwebtoken');
const SECRET_KEY = 'dein_super_geheimes_token';

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token fehlt' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: 'Token ungültig' });
    req.user = user;
    next();
  });
};
