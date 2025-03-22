const mongoose = require('mongoose');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
app.use(cors());
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URI).
then(()=>{
    console.log("Mongo DB connected")
}).catch((error)=>{
    console.log(error)
})


app.listen(PORT,()=>{
    console.log(`Successfully connected and app is running at port ${PORT}`)
})

