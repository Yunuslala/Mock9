const express=require("express");
const {authentication}=require("../Middleware/authentication");
const UserRoute=express.Router();
const {UserModel}=require("../Models/User.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require('dotenv').config()

UserRoute.post("/api/register",async(req,res)=>{
    try {
        let {name,email,password,dob,bio,posts,friends,friendRequests}=req.body;
        console.log(dob);
        dob=dob.split("-");

        dob=new Date(dob[2],dob[1]-1,dob[0])
        console.log(dob);
        console.log(req.body);
        bcrypt.hash(password,5,async(err,hash)=>{
            console.log(hash);
            if(err){
                return res.status(500).send({"msg":"error in hashing"})
            }else{
                let savedData=new UserModel({name,email,password:hash,dob,bio,posts,friends,friendRequests});
                await savedData.save()
                res.status(201).send({"msg":"use has been registerd"})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})

UserRoute.post("/api/login",async(req,res)=>{
    try {
        let {email,password}=req.body;
        let userFind=await UserModel.find({email});
        if(userFind.length==0){
           return res.status(404).send({"msg":"Userr does not exist"})
        }

        bcrypt.compare(password,userFind[0].password,async(err,result)=>{
            if(err){
                res.send(500).send({"msg":"error in hashing"})
            }else{
                let token=jwt.sign({userId:userFind[0]._id},process.env.Secret)
               
                res.status(201).send({"msg":"use has been login",token})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})


UserRoute.get("/api/users",authentication,async(req,res)=>{
    try {
       let data=await UserModel.find();
       res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})

UserRoute.get("/api/users/:id/friends",authentication,async(req,res)=>{
    try {
        let id=req.params.id
       let data=await UserModel.find({_id:id});
       let friends=data[0].friends
       console.log(data);
       res.status(200).send(friends)
        
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})
UserRoute.post("/api/users/:id/friends",authentication,async(req,res)=>{
    try {
        let id=req.params.id
        let {userId}=req.body;
       let data=await UserModel.findById({_id:id});
       console.log(data);
       let friendReq=data.friendRequests;
       let updatereq=friendReq.push(userId);
        friendReq=updatereq;
       console.log(data);
      let saveData= await UserModel.findByIdAndUpdate({_id:id},data)
      console.log(saveData);
       res.status(201).send({"msg":"friend request has been made"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})
UserRoute.post("/api/users/:id/friends/:friendId",authentication,async(req,res)=>{
    try {
        let {id,friendId}=req.params
       let data=await UserModel.findById({_id:id});
       let FriendData=await UserModel.findById({_id:friendId});
       let friend1=data.friends;
       let addfriend=friend1.push(friendId)
       friend1=addfriend;
       let friend2=FriendData.friends;
       let addfriend2=friend2.push(id)
       friend2=addfriend2
       let friendreq=data.friendRequests;
       console.log(friendreq);
       let update=friendreq.filter((item)=>item==id)
      data.friendRequests=update
      console.log(data);
       await  UserModel.findByIdAndUpdate({_id:id},data)
       await  UserModel.findByIdAndUpdate({_id:friendId},FriendData)
       res.status(201).send({"msg":"friend request has been accepted"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"msg":"something wrong"})
    }
})

module.exports={
    UserRoute
}