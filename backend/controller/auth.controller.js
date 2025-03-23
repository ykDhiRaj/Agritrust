const jwt = require("jsonwebtoken");

const verifyUser = (req, res) => {
  try {
    res.json({ user: req.user }); // Send verified user details
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { verifyUser };