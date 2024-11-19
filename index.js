const express =  require("express")
const mongoose = require('mongoose');
const app = express();
const {userroutes} = require("./routes/user")
const {adminroutes} = require("./routes/admin")
const {courseroutes} = require("./routes/course")
require('dotenv').config();
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING

app.use(express.json())
app.use("/user" , userroutes)
app.use("/admin" , adminroutes)
app.use("/" , courseroutes)


async function main() {
    try{
        await mongoose.connect(DB_CONNECTION_STRING)
        console.log("Successfully connected to DB");    
        app.listen(3000 , ()=>{
            console.log("server running at port : 3000");
        })
    }catch {
        console.log("Failed to connect to DB");
        process.exit();
    }
}

main()
















