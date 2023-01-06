require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const app = require("./app")
mongoose.set('strictQuery', true)

const MONGO_URI = process.env.MONGO_URI ||  "mongodb://localhost/Users"
const PORT = process.env.PORT || 8000

mongoose.connect(MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to DATABASE");
    app.listen(PORT,()=>console.log(`server is up and running on ${PORT}`))
})
.catch((err)=>console.log(err))
