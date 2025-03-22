const mongoose = require("mongoose");

const bankInterestedSchema = new mongoose.Schema({
    loanApplicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanApplication",
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",  // Assuming you have a "Bank" model
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Farmer",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BankInterested", bankInterestedSchema);
