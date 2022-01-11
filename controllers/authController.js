const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordconfrim: req.body.passwordconfrim
    });

    const token = jwt.sign({
        id: newUser._id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })

})

exports.login = (req, res, next) => {
    // const email = req.body.email ;
    const { email, password } = req.body;

    // check email and password exists
    if (!email || !password) {
      return next(new AppError('please provide email and password', 400))
    }
    // check if user exissts and password is correct
    const user = User.findOne({ email: email, password: password})
    
    //if ok send token to client
    const token = '';
    res.status(200).json({
        status: 'success',
        token
    })

}





