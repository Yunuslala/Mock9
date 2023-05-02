const express=require("express");
const PostRoute=express.Router();
const {PostModel}=require("../Models/Post.model");
const {authentication}=require("../Middleware/authentication");
PostRoute.use(authentication);

PostRoute.post("/api/posts",async(req,res)=>{
    try {
        let {text,image,createdAt,likes,comments,userID}=req.body;
        createdAt=createdAt.split("-");
        createdAt=new Date(createdAt[2],createdAt[1]-1,createdAt[0]);
        let savePost=new PostModel({text,image,createdAt,likes,comments,user:userID});
        await savePost.save();
        res.status(201).send({"msg":"post has been made"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})

PostRoute.put("/api/posts/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        let data=req.body;
        let savePost=await PostModel.findByIdAndUpdate({_id:id},data);
        res.status(204).send({"msg":"post has been made"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})
PostRoute.get("/api/posts",async(req,res)=>{
    try {
        let savePost=await PostModel.find();
        res.status(200).send(savePost)
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})
PostRoute.delete("/api/posts/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        let savePost=await PostModel.findByIdAndDelete({_id:id});
        res.status(204).send({"msg":"particular post has been deleted"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})

PostRoute.get("/api/posts/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        let savePost=await PostModel.findById({_id:id});
        res.status(200).send(savePost)
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})

PostRoute.put("/api/posts/:id/like",async(req,res)=>{
    try {
        let id=req.params.id;
        let {userId}=req.body;
        let savePost=await PostModel.findById({_id:id});
        let addLike=savePost.likes;
        let postlike=addLike.push(userId);
        addLike=postlike
        let LikedPost=await PostModel.findByIdAndUpdate({_id:id},savePost)
        res.status(204).send({"msg":"post has been liked"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})
PostRoute.put("/api/posts/:id/comment",async(req,res)=>{
    try {
        let id=req.params.id;
        let {userId,text,createdAt}=req.body;
        createdAt=createdAt.split("-");
        createdAt=new Date(createdAt[2],createdAt[1]-1,createdAt[0])
        let comments={
            user:userId,
            text,
            createdAt

        }
        let savePost=await PostModel.findById({_id:id});
        let commentsAdd=savePost.comments;
        let postcomment=commentsAdd.push(comments)
        commentsAdd=postcomment
        let LikedPost=await PostModel.findByIdAndUpdate({_id:id},savePost)
        res.status(204).send({"msg":"post has been commented"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something went wrong"})
    }
})
module.exports={
    PostRoute
}