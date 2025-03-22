const CreditScoreSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    totalLoans: { type: Number, required: true },
    activeLoans: { type: Number, required: true }, // Kitne loans abhi active hain  
    totalEMI: { type: Number, required: true },    // Har mahine kitna EMI bhar raha hai  
    missedEMIs: { type: Number, required: true },  // Kitni baar EMI miss hui  
    creditScore: { type: Number, required: true }, // Final credit score (0-1000)  
    generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CreditScore", CreditScoreSchema);