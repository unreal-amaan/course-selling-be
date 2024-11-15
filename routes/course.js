const {Router} = require("express")
const courseroutes = Router()


courseroutes.post("/purchase" , function(req , res) {

})

courseroutes.get("/all-courses", function (req , res) {
})

module.exports = {
    courseroutes : courseroutes
}