const express = require("express");
const adminroutes = express.Router();
const { AdminModel } = require("../db/schema");
const { CourseModel } = require("../db/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const validator = require("validator");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

adminroutes.use(express.json());

adminroutes.post("/signup", async function (req, res) {
    const { email, password, firstname, lastname } = req.body;
    const req_schema = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
        firstname: z.string(),
        lastname: z.string(),
    });

    const validEmail = validator.isEmail(email);
    if (!validEmail) {
        return res.json({
            message: "Invalid Email",
        });
    }
    const options = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    };
    const validPassword = validator.isStrongPassword(password, options);
    if (!validPassword) {
        return res.json({
            message: "Provide a Strong Password",
        });
    }
    const safe_parsed = req_schema.safeParse(req.body);
    if (!safe_parsed.success) {
        return res.json({
            message: "Invalid Request",
            error: safe_parsed.error,
        });
    }

    try {
        const hashed_password = await bcrypt.hash(password, 5);
        await AdminModel.create({
            email: email,
            password: hashed_password,
            firstname: firstname,
            lastname: lastname,
        });
    } catch (err) {
        // console.log(err);
        return res.json({
            message: "admin alredy exists",
        });
    }
    res.json({
        message: "Signup successful !",
    });
});

adminroutes.post("/signin", async function (req, res) {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({
        email: email,
    });
    if (!admin) {
        return res.json({
            message: "User not found (or) Incorrect email",
        });
    }

    const password_check = await bcrypt.compare(password, admin.password);
    if (!password_check) {
        return res.json({
            message: "Incorrect Password !",
        });
    }

    const token = jwt.sign(
        {
            id: admin._id.toString(),
        },
        JWT_SECRET
    );
    res.json({
        token: token,
        message: "Signin Successfully !",
    });
});

adminroutes.post("/create-course", function (req, res) {});

adminroutes.put("/delete-course", function (req, res) {});

adminroutes.get("/get-all-courses", function (req, res) {});

module.exports = {
    adminroutes: adminroutes,
};
