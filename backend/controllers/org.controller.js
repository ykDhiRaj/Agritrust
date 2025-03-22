const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organization = require("../models/org.model");


async function registerOrganization(req, res) {
    try {
        const { name, email, password, phone } = req.body;

        // Check if the organization already exists
        const existingOrg = await Organization.findOne({ email });
        if (existingOrg) {
            return res.status(400).json({ message: "Organization already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new organization
        const newOrganization = await Organization.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        const token = jwt.sign(
            {email: email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "Organization registered successfully", organization: newOrganization, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// 🔹 Login an organization
async function loginOrganization(req, res) {
    try {
        const { email, password } = req.body;

        // Check if the organization exists
        const organization = await Organization.findOne({ email });
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, organization.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {email: organization.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { registerOrganization, loginOrganization };
