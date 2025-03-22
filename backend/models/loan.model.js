const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    loanAmount: { type: Number, required: true }, // Loan kitna liya gaya
    emiAmount: { type: Number, required: true }, // Monthly EMI
    tenureMonths: { type: Number, required: true }, // Kitne mahine ka loan hai
    interestRate: { type: Number, required: true }, // Annual Interest Rate %
    issueDate: { type: Date, required: true }, // Loan kab diya gaya
    dueDate: { type: Date, required: true }, // EMI last date
    paidEMIs: [{ date: Date, amount: Number }], // EMI payments ka history
    status: { type: String, enum: ["Active", "Closed", "Defaulted"], required: true },
    creditScoreImpact: { type: Number, default: 0 } // Loan ka credit score pe impact
});

module.exports = mongoose.model("Loan", LoanSchema);