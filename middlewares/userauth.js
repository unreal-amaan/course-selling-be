const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

function userauth(req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_SECRET);
    if (decode) {
        req.id = decode.id;
        console.log("User Authentication Successful !");
        next();
    } else {
        res.status(403).json({
            message: "User is not signed in !",
        });
    }
}

module.exports = {
    userauth: userauth,
};
