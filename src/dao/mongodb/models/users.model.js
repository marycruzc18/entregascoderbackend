import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    email:{type: String, required: true, unique: true},
    age:{type:Number},
    password:{type: String, required: true},
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart',default: null },
    role:{type: String,enum: ['user', 'admin', 'premium'], default: 'user'},
    isGithub: {
        type: Boolean,
        default: false
      }

});

export const UserModel = mongoose.model('User', userSchema);