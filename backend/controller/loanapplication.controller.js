const LoanApplication = require("../models/loanapplication.model");
const farmer_model = require('../models/farmer.model')

// ✅ Create a Loan Application
const applyForLoan = async (req, res) => {
    try {
        const { loanAmount, loanTerm, interestRate, location, purpose } = req.body;
        const user = req.user; // Middleware assigns `req.user` (Farmer details)
        console.log(user);


        if (!user) {
            return res.status(401).json({ message: "Unauthorized! User not found" });
        }

        // ✅ Check required fields
        if (!loanAmount || !loanTerm || !interestRate || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const getuser = await farmer_model.findOne({ email: user.email }).select("-password")
        if (!getuser) {
            return res.status(404).json({ message: "User not Found" });
        }
        console.log(getuser, "getuser");



        // ✅ Create Loan Application
        const newLoanApplication = await LoanApplication.create({
            farmerId: getuser._id,
            name: getuser.name,
            email: getuser.email,
            place: location,
            amount: loanAmount,
            tenure: loanTerm,
            interestRate,
            purpose,
            status: "Pending",
        });

        return res.status(201).json({
            message: "Loan application submitted successfully!",
            loan: newLoanApplication,
        });

    } catch (error) {
        console.error("Loan Application Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Get All Loan Applications for the Logged-in Farmer
const getFarmerLoans = async (req, res) => {
    try {
        const user = req.user; // Middleware assigns `req.user`

        if (!user) {
            return res.status(401).json({ message: "Unauthorized! User not found" });
        }

        const loans = await LoanApplication.find({ email: user.email });

        return res.status(200).json(loans);
    } catch (error) {
        console.error("Error fetching loans:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Approve a Loan (Admin Use)
const approveLoan = async (req, res) => {
    try {
        const { loanId } = req.params;

        const loan = await LoanApplication.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan application not found" });
        }

        loan.status = "Approved";
        await loan.save();

        return res.status(200).json({ message: "Loan application approved", loan });
    } catch (error) {
        console.error("Error approving loan:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { applyForLoan, getFarmerLoans, approveLoan };
