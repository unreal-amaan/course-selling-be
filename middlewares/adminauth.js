const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

function adminauth(req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_ADMIN_SECRET);
    if (decode) {
        req.adminid = decode.id;
        console.log("Admin Authentication Successful !");
        next();
    } else {
        res.status(403).json({
            message: "Admin is not signed in !",
        });
    }
}

module.exports = {
    adminauth: adminauth,
};
