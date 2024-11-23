const { Router } = require("express");
const courseroutes = Router();
const { CourseModel } = require("../db/schema");
const { PurchaseModel } = require("../db/schema");
const { userauth } = require("../middlewares/userauth");

courseroutes.get("/all-courses", async function (req, res) {
    try {
        const courses = await CourseModel.find()
            .select("title price description imageUrl -_id")
            .lean();
        if (courses.length == 0) {
            res.json({
                message: "No courses available",
            });
        } else {
            res.json({
                courses: courses,
            });
        }
    } catch {
        res,
            json({
                message: "Error fetching courses",
            });
    }
});

courseroutes.use(userauth);

courseroutes.post("/purchase", async (req, res) => {
    const userId = req.userid;
    const courseId = req.body.courseId;
    try {
        await PurchaseModel.create({
            courseId,
            userId,
        });
        res.json({
            message: "Course Purchased Successfully",
        });
    } catch {
        res.json({
            message: "Course purchase failed",
        });
    }
});

module.exports = {
    courseroutes: courseroutes,
};
