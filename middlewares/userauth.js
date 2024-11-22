const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
function userauth(req, res, next) {

    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_USER_SECRET);
    if (decode) {
        req.userid = decode.id;
        console.log(req.userid);
        console.log("user Authentication Successful !");
        next();
    } else {
        res.status(403).json({
            message: "user is not signed in !",
        });
    }
}

module.exports = {
    userauth: userauth,
};
