const express = require("express");
const adminroutes = express.Router();
const { adminauth } = require("../middlewares/adminauth");

const { AdminModel } = require("../db/schema");
const { CourseModel } = require("../db/schema");

const bcrypt = require("bcrypt");
const { z } = require("zod");
const validator = require("validator");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

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
        JWT_ADMIN_SECRET
    );
    res.json({
        token: token,
        message: "Signin Successfully !",
    });
});

adminroutes.use(adminauth);

adminroutes.post("/create-course", async function (req, res) {
    const { title, price, description, imageurl, adminid } = req.body;

    try {
        const course = await CourseModel.create({
            title,
            price,
            description,
            imageUrl: imageurl,
            creatorId: adminid,
        });
        res.json({
            message: "Course Created Successfully ",
            courseId: course._id,
        });
    } catch (err) {
        res.json({
            message: "Course Creation Failed ",
        });
    }
});

adminroutes.put("/delete-course", async function (req, res) {
    const { courseId } = req.body;
    try {
        await CourseModel.deleteOne({
            _id: courseId,
        });
        res.json({
            message: "Course deletion successful",
        });
    } catch {
        res.json({
            message: "Error deleting the course",
        });
    }
});

adminroutes.put("/update-course", async function (req, res) {
    const { title, price, description, imageurl, courseId } = req.body;
    try {
        await CourseModel.updateOne(
            {
                _id: courseId,
            },
            {
                title,
                price,
                description,
                imageUrl: imageurl,
            }
        );
        res.json({
            message: "Course updation successful",
        });
    } catch(err) {
        console.log(err);
        res.json({
            message: "Error updating the course",
        });
    }
});
adminroutes.get("/get-all-courses", async function (req, res) {
    const {adminid} = req.body;
    try {
        const my_created_courses = await CourseModel.find({
            creatorId : adminid
        })
        res.json({
            message : "All the courses created by admin are fetched",
            courses : my_created_courses.map((course) => course.title)
            // courses : my_created_courses.map((course) => course.title)
        })
    }catch (err) {
        res.json({
            message : "error fetching courses"
        })
    }
});

module.exports = {
    adminroutes: adminroutes,
};
