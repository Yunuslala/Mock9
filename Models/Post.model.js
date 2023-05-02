const mongoose=require("mongoose");

const PostSchema=mongoose.Schema({
    user: { type: String, ref: 'User' },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type:String, ref: 'User' }],
    comments: [{
      user: { type: String, ref: 'User' },
      text: String,
      createdAt: Date
    }]
  
});

const PostModel=mongoose.model("Post",PostSchema);

module.exports={
    PostModel
}