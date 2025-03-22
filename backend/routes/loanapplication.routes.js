

const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware')

const { applyForLoan } = require('../controller/loanapplication.controller')
const { getFarmerLoans } = require('../controller/loanapplication.controller')


const router = express.Router();


router.post('/applyloan', authMiddleware, applyForLoan)
router.get('/getloan', authMiddleware, getFarmerLoans)



module.exports = router;


