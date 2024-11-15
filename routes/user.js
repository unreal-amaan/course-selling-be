const {Router} = require("express")

const userroutes = Router()


userroutes.post("/signup" , async function(req , res){
    const username = req.body.username
    const password = req.body.password
})

userroutes.post("/login", function (req , res) {
    
})


userroutes.get("/my-courses", function (req , res) {

})



module.exports = {
    userroutes : userroutes
}


