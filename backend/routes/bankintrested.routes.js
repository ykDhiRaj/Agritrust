const express = require('express')


const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const { expressInterest } = require('../controller/intrestedbank.controller')


router.post('/intrested/:loanApplicationId/:farmerId', authMiddleware, expressInterest)