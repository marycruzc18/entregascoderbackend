import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    email:{type: String, required: true, unique: true},
    age:{type:Number, required: true},
    password:{type: String, required: true},
    role:{type: String, defaul: 'user'}

});

export const UserModel = mongoose.model('User', userSchema);