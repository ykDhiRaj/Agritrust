const mongoose = require("mongoose");

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
        type: String, required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    location: {
        village: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    loans: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }], default: null }, // Loans taken by the farmer
    creditScore: { type: mongoose.Schema.Types.ObjectId, ref: "CreditScore", default: null }, // Farmer's credit score
    registeredAt: { type: Date, default: Date.now } // Registration date
});


FarmerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


FarmerSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        console.log(err)
        // throw new Error('Error comparing passwords');

    }
};


FarmerSchema.methods.genrateaccessToken = function () {
    return jwt.sign({
        // _id: this._id,       
        email: this.email
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )
}

module.exports = mongoose.model("Farmer", FarmerSchema);
