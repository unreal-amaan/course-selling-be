const express = require("express");
const userroutes = express.Router();

const { z } = require("zod");
const validator = require("validator");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { userauth } = require("../middlewares/userauth");
const { UserModel } = require("../db/schema");
const { CourseModel } = require("../db/schema");
const { PurchaseModel } = require("../db/schema");

require("dotenv").config();
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;

userroutes.post("/signup", async function (req, res) {
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
        await UserModel.create({
            email: email,
            password: hashed_password,
            firstname: firstname,
            lastname: lastname,
        });
    } catch (err) {
        // console.log(err);
        return res.json({
            message: "user alredy exists",
        });
    }
    res.json({
        message: "Signup successful !",
    });
});

userroutes.post("/signin", async function (req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
        email: email,
    });
    if (!user) {
        return res.json({
            message: "User not found",
        });
    }
    const password_check = await bcrypt.compare(password, user.password);
    if (!password_check) {
        return res.json({
            message: "Incorrect Password !",
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        JWT_USER_SECRET
    );
    res.json({
        token: token,
        message: "Signin Successfully !",
    });
});

userroutes.use(userauth);

userroutes.post("/purchased", async (req, res) => {
    const userId = req.userid;

    try {
        const purchases = await PurchaseModel.find({
            userId,
        })
            .select("title price description imageUrl -_id")
            .lean();

        if (purchases.length == 0) {
            res.json({
                message: "No purchased courses",
            });
        } else {
            res.json({
                message: "Purchased courses fetched successfully",
                PurchasedCourses: purchases,
            });
        }
    } catch {}
});

userroutes.get("/my-courses", async function (req, res) {
    const userId = req.userid;
    const purchases = await PurchaseModel.find({
        userId: userId,
    });
    const courseIds = purchases.map((purchase) => purchase.courseId);
    const my_courses = await CourseModel.find({
        _id: courseIds,
    });
    if (my_courses.length === 0) {
        return res.json({
            message: "You have not purchased any course",
        });
    }
    res.json({
        message: "successfully fetched your courses",
        my_courses: my_courses,
    });
});

module.exports = {
    userroutes: userroutes,
};
