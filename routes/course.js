const {Router} = require("express")
const courseroutes = Router()
const { CourseModel } = require("../db/schema");

courseroutes.get("/", async function (req , res) {
    try {
        const courses = await CourseModel.find().select("title price description imageUrl -_id").lean();
        if(courses.length == 0) {
            res.json({
                message : "No courses available"
            })
        }else {
            res.json({
                courses : courses 
            })
        }
    }catch {
        res,json({
            message : "Error fetching courses"
        })
    }
})

module.exports = {
    courseroutes : courseroutes
}