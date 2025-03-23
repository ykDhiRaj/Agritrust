// const farmer_model = require('../models/farmer.model')
// const axios = require('axios')
const farmer_model = require('../models/farmer.model')
const jwt = require('jsonwebtoken')
const BankInterested = require("../models/intrestedbank.model");



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




// get all intretd banks

const getInterestedLoans = async (req, res) => {
    try {
        // Middleware should attach the authenticated farmer's ID to req.farmer'

        const farmeremail = req.user.email;
        const farmer = farmer_model.find({ email: farmeremail })
        // Find all bank interests related to this farmer
        const interestedLoans = await BankInterested.find({
            _id: interbankId,
            farmerId: farmer._id,
            status: "Pending"
        })
            .populate("loanApplicationId") // Populate Loan Application Details
            .populate("orgId", "name email") // Populate Bank/Organization Details (Only Name & Email)

        if (!interestedLoans.length) {
            return res.status(404).json({ message: "No interested loans found for this farmer" });
        }

        return res.status(200).json(interestedLoans);
    } catch (error) {
        console.error("Error fetching interested loans:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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



const acceptsloan = async (req, res) => {
    try {
        const farmeremail = req.user.email;
        const farmer = farmer_model.find({ email: farmeremail })
        const { interbankId } = req.params; // Extract interested bank ID

        // Check if the required data is provided
        if (!interbankId) {
            return res.status(400).json({ message: "Bank Interest ID is required" });
        }

        // Find the interested bank entry
        const interestedBankEntry = await BankInterested.findOne({
            _id: interbankId,
            farmerId: farmer._id,
            status: "Pending" // Ensure only pending requests are updated
        }).populate("loanApplicationId"); // Populate loan details

        if (!interestedBankEntry) {
            return res.status(404).json({ message: "No pending loan interest found" });
        }

        const { loanApplicationId, amount, interest, tenure } = interestedBankEntry;

        // Calculate EMI using the formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n – 1]
        const principal = amount;
        const monthlyInterestRate = interest / (12 * 100); // Convert annual interest to monthly decimal
        const tenureMonths = tenure;
        const emiAmount = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
            (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

        // Determine due date (assuming EMI starts next month)
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + tenureMonths);

        let creditScoreImpact = 0;
        if (amount < 50000) {
            creditScoreImpact = 5 + Math.floor(amount / 10000); // 5-10 points
        } else if (amount >= 50000 && amount <= 200000) {
            creditScoreImpact = 10 + Math.floor(amount / 50000) * 5;
        } else {
            creditScoreImpact = 20 + Math.floor(amount / 100000) * 10;
        }


        // Create a new loan entry
        const newLoan = await Loan.create({
            farmerId: farmer._id,
            orgId,
            loanAmount: amount,
            emiAmount: emiAmount.toFixed(2), // Store EMI rounded to 2 decimal places
            tenureMonths,
            interestRate: interest,
            issueDate,
            dueDate,
            paidEMIs: [], // Initially empty
            status: "Active",
            creditScoreImpact
        });


        // Update status in BankInterested
        interestedBankEntry.status = "Accepted";
        await interestedBankEntry.save();

        return res.status(200).json({
            message: "Loan offer accepted successfully",
            loanDetails: newLoan
        });

    } catch (error) {
        console.error("Error in accepting loan offer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const rejectLoan = async (req, res) => {
    try {
        const farmeremail = req.user.email;
        const farmer = farmer_model.find({ email: farmeremail })
        const { interbankId } = req.params; // Extract interested bank ID

        // Validate input
        if (!interbankId) {
            return res.status(400).json({ message: "Bank Interest ID is required" });
        }

        // Find the interested bank entry
        const interestedBankEntry = await BankInterested.findOne({
            _id: interbankId,
            farmerId: farmer._id,
            status: "Pending" // Only process pending requests
        });

        if (!interestedBankEntry) {
            return res.status(404).json({ message: "No pending loan interest found" });
        }

        // Update status in BankInterested table to "Rejected"
        interestedBankEntry.status = "Rejected";
        await interestedBankEntry.save();

        return res.status(200).json({
            message: "Loan offer rejected successfully",
            rejectedLoan: interestedBankEntry
        });

    } catch (error) {
        console.error("Error in rejecting loan offer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {
    signup, login, getInterestedLoans, acceptsloan, rejectLoan
}