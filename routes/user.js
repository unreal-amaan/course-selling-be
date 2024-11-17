const {Router} = require("express")
const userroutes = Router()

const jwt = require("jsonwebtoken")
const {UserModel} = require("../db/schema")
const {CourseModel} = require("../db/schema")

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET


userroutes.post("/signup" , async function(req , res){
    const email = req.body.email
    const password = req.body.password

})

userroutes.post("/login", function (req , res) {
    
})


userroutes.get("/my-courses", function (req , res) {

})



module.exports = {
    userroutes : userroutes
}


