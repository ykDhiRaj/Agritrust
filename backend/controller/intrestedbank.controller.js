const BankInterested = require("../models/bankInterested.model");
const LoanApplication = require("../models/loanapplication.model");
const Organization = require('../models/org.model')
const farmer_model = require('../models/farmer.model')

const expressInterest = async (req, res) => {
    try {

        const { loanApplicationId, farmerId } = req.params
        const { amount, interest, tenure } = req.body;
        const org = req.user // Assuming bank user is authenticated

        // Validate required fields
        if (!loanApplicationId || !amount || !interest || !tenure) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if loan application exists
        const loanApplication = await LoanApplication.findById(loanApplicationId);
        if (!loanApplication) {
            return res.status(404).json({ message: "Loan application not found." });
        }
        const Organiz = await Organization.find({ email: org.email })

        // Check if the bank has already expressed interest
        const existingInterest = await BankInterested.find({ loanApplicationId, email: org.email, farmerId });
        if (existingInterest) {
            return res.status(400).json({ message: "You have already shown interest in this loan." });
        }

        // Create a new interest entry
        const newInterest = await BankInterested.create({
            loanApplicationId,
            orgId: Organiz._id,
            amount,
            interest,
            tenure,
            status: "Pending"
        });

        return res.status(201).json({
            message: "Interest expressed successfully!",
            data: newInterest
        });

    } catch (error) {
        console.error("Error expressing interest:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


const getInterestedLoans = async (req, res) => {
    try {
        // Middleware should attach the authenticated farmer's ID to req.farmer
        const farmeremail = req.farmer.email;
        const farmer = farmer_model.find({ email: farmeremail })
        // Find all bank interests related to this farmer
        const interestedLoans = await BankInterested.find({ farmerId: farmer._id })
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

module.exports = { getInterestedLoans };



module.exports = { expressInterest };
