// const farmer_model = require('../models/farmer.model')
// const axios = require('axios')
const farmer_model = require('../models/farmer.model')
const jwt = require('jsonwebtoken')


async function signup(req, res) {
    console.log(req.body, "body");
    const { name, phone, email, password, location, } = req.body

    const { village, state, latitude, longitude, district } = location




    try {

        // check all the feild are present are not
        if (!password || !name || !phone || !email || !location || !village || !state) {
            return res.status(400).json({ "message": "All feilds are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ "message": "password must be more than 6 length" })
        }
        const farmer = await farmer_model.findOne({ email: email })

        if (farmer) {
            return res.status(400).json({ "message": "user alreasy found" })
        }

        const new_farmer = await farmer_model.create({
            name,
            phone,
            email,
            password,
            location: {
                village,
                district,
                state,
                latitude,
                longitude,
            },
            loans: [],
            creditScore: null

        })

        //select user  without password and refresh token
        const createdfarmer = await farmer_model.findById(new_farmer._id).select("-password")
        if (!createdfarmer) {
            return res.status(400).json("Opps something went wrong")
        }
        console.log(new_farmer._id)

        const accessToken = await genrateaccesstokenandrefreshtoken(createdfarmer._id)



        // send cookie and response as json data
        return res.status(201).json({
            message: "Account created successfully",
            farmer: createdfarmer,
            token: accessToken
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }

}


// login farmer
async function login(req, res) {
    const { email, password } = req.body

    try {

        const logdInfarmer = await farmer_model.findOne({ email: email }).select("-refreshtoken")

        if (!logdInfarmer) {
            return res.status(404).json({ message: "user not found" })
        }

        const checkpass = await logdInfarmer.isPasswordCorrect(password)
        if (!checkpass) {
            return res.status(401).json({ message: "Passsword is incorrect" })
        }
        const accessToken = await genrateaccesstokenandrefreshtoken(logdInfarmer._id)
        console.log(accessToken);


        return res.status(200).json({ loginfarmer: logdInfarmer, message: "farmer login sussfully", token: accessToken })






    } catch (error) {
        console.log(error)

    }

}


// method for genrating access token


const genrateaccesstokenandrefreshtoken = async function (id) {
    try {
        const user = await farmer_model.findById(id)
        const accessToken = await user.genrateaccessToken()
        return accessToken
    }
    catch (err) {
        console.log(err);


    }
}



module.exports = {
    signup, login
}