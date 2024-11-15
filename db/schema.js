const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId
const Schema = mongoose.Schema;

mongoose.connect("mongodb+srv://amaan1:Amaansyed2005@mycluster.gl31z.mongodb.net/")

const user = new Schema({
    email : {type : String , unique : true},
    password : String,
    firstname : String,
    lastname : String
})

const admin = new Schema({
    email : {type : String , unique : true},
    password : String,
    firstname : String,
    lastname : String
})


const course = new Schema({
    createrId : ObjectId,
    title : String,
    price : Number,
    description : String,
    imageUrl : String
})

const purchase = new Schema({
    courseId : ObjectId,
    userId   : ObjectId
})

const UserModel = mongoose.Model("user")
const AdminModel = mongoose.Model("admin")
const CourseModel = mongoose.Model("course")
const PurchaseModel = mongoose.Model("purchase")

module.exports = {
    UserModel : UserModel,
    AdminModel : AdminModel,
    CourseModel : CourseModel,
    PurchaseModel : PurchaseModel
}
