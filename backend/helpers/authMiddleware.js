const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {

            return res.status(403).json({ error: 'Forbidden' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;