const express = require("express"); 
const router = express.Router();
const {registerOrganization, getLoanApplications} = require("../controller/org.controller");
const {loginOrganization} = require("../controller/org.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register-organiation",authMiddleware, registerOrganization);

router.post("/login-organization", loginOrganization);  

router.get("/farmer-application",authMiddleware, getLoanApplications);

module.exports = router;