const mongoose = require('mongoose');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 5000;

const farmerRoute = require("./routes/farmer.routes")
const applyloanRoute = require('./routes/loanapplication.routes')

app.use('/api/farmer', farmerRoute);
app.use('/api/farmer', applyloanRoute)

mongoose.connect(process.env.MONGODB_URI).
  then(() => {
    console.log("Mongo DB connected")
  }).catch((error) => {
    console.log(error)
  })


app.listen(PORT, () => {
  console.log(`Successfully connected and app is running at port ${PORT}`)
})

// app.use('/api/farmer', farmerroutes)


=======
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


