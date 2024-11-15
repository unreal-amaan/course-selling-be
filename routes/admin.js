const {Router} = require("express")

const adminroutes = Router();


adminroutes.post("/signup" , async function(req , res){
    // const username = req.body.username
    // const password = req.body.password
})

adminroutes.post("/login", function (req , res) {
    
})

adminroutes.post("/create-course", function (req , res) {
    
})

adminroutes.put("/delete-course", function (req , res) {
    
})

adminroutes.get("/get-all-courses", function (req , res) {
    
})


module.exports = {
    adminroutes : adminroutes
}