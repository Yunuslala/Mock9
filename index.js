const express=require("express");
const app=express();
const {connection}=require("./Config/db");
const {UserRoute}=require("./Router/User");
const {PostRoute}=require("./Router/Post");
require('dotenv').config()
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("mock has been deployed")
})

app.use(UserRoute);
app.use(PostRoute)




app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("db is connected");

    } catch (error) {
        console.log("db is not connected");
    }
    console.log(`http://localhost:${process.env.port}`);
})