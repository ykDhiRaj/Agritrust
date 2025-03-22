const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Farmer",
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    tenure: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true

    },
    status: {
        type: String,
        enum: ["Pending", "Approved"],
        default: "Pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

const LoanApplication = mongoose.model("LoanApplication", loanApplicationSchema);
module.exports = LoanApplication;