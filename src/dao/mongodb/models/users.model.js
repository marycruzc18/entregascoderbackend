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
      },
    documents:[
      {
        name:{type:String, required: true},
        reference:{type:String, required:true }
      }
    ],
    last_connection:{type:Date},
    profileImage: { type: String }

});

export const UserModel = mongoose.model('User', userSchema);