const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId
const Schema = mongoose.Schema;

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
    title : {type : String , unique : true},
    price : Number,
    description : String,
    imageUrl : String,
    creatorId : ObjectId
})

const purchase = new Schema({
    courseId : {type : ObjectId , unique : true},
    userId   : ObjectId
})

const UserModel = mongoose.model("users" , user)
const AdminModel = mongoose.model("admins" , admin)
const CourseModel = mongoose.model("courses" , course)
const PurchaseModel = mongoose.model("purchases" , purchase)

module.exports = {
    UserModel : UserModel,
    AdminModel : AdminModel,
    CourseModel : CourseModel,
    PurchaseModel : PurchaseModel
}
