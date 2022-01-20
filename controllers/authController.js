const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const access_token = signToken(user._id)

  const expires_in = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') expires_in.secure = true;

  res.cookie('jwt', access_token, expires_in);

  //remove pass out
  user.password = undefined;
  

  res.status(statusCode).json({
    status: 'success',
    access_token,
    data: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm
  });

  const access_token = jwt.sign({
    id: newUser._id
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )

  res.status(201).json({
    status: 'success',
    access_token,
    data: {
      user: newUser
    }
  })

})

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);


}



