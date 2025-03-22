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
const adminRouter = require('./routes/admin.routes');
const orgRouter = require('./routes/org.routes');
const {createDefaultAdmin} = require('./controllers/admin.controller');

app.use('/api/farmer', farmerRoute);
app.use('/api/farmer', applyloanRoute)
app.use('/api/admin',adminRouter);
app.use('/api/org',orgRouter);

mongoose.connect(process.env.MONGODB_URI).
then(()=>{
    console.log("Mongo DB connected")
}).catch((error)=>{
    console.log(error)
})


app.listen(PORT,async ()=>{
    await createDefaultAdmin();
    console.log(`Successfully connected and app is running at port ${PORT}`)
})


