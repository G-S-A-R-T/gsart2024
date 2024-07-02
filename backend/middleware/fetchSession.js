const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const JWT_SECRET = process.env.JWT_SECRET;  




const fetchSession = (req, res, next) => {
    //Get the user from the jwt token and add id to req object
    const token = req.header('session-token');
    if (!token) {
        res.status(401).send({ error: "session not found" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.factor = data.factor;
        next();
    } catch (error) {
        res.status(401).send({ error: "session not found" })

    }
}
module.exports = fetchSession;