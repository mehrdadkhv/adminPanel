const User = require('../../models/userModel')
const catchAsync = require('../../utils/catchAsync')

exports.index = async  (req, res, next)=> {
    res.send('Admin Home')
}