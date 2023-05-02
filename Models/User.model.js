const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [{ type: String, ref: 'Post' }],
    friends: [{ type: String, ref: 'User' }],
    friendRequests: [{ type: String, ref: 'User' }]
  
});

const UserModel=mongoose.model("User",UserSchema);

module.exports={
    UserModel
}