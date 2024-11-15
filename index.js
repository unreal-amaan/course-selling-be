const express =  require("express")
const app = express();
const {userroutes} = require("./routes/user")
const {adminroutes} = require("./routes/admin")
const {courseroutes} = require("./routes/course")
const {UserModel , AdminModel , CourseModel , PurchaseModel} = require("./db/schema")

app.use("/user" , userroutes)
app.use("/admin" , adminroutes)
app.use("/course" , courseroutes)



app.listen(3000 , ()=>{
    console.log("server running at port : 3000");
})

















