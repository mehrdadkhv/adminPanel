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
    passwordconfirm: req.body.passwordconfirm,
    role: req.body.role,
    passwordChangedAt : req.body.passwordChangedAt
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

exports.protect = catchAsync(async (req, res, next) => {

  let token;
  //1) Getting token and check of its there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split('Bearer ')[1];
  }
  if (!token) {
    return next(new AppError('لطفا برای دسترسی وارد شوید !', 401))
  }
  //2) Verification token 
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('THE user belonging to this token does no longer exist ', 401))
  }

  // 4) check if user chanded password after the jwt was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) { // اگر پسورد تغییر کرد
    return next(new AppError('کاربر به تازگی پسور را تغییر داده است لطفا دوباره وارد شوید',401))
  }


  //اجازه دسترسی به مسیر محافظت شده
  req.user = freshUser
  next()

})


exports.restrictTo = (...roles)=>{
  return (req, res,next)=>{
    // roles ['admin', 'lead-admin'] . role = 'user'
    //نقش هارو وارد میکنیم و چون یوزر در نقش وجود ندارد دسترسی به او داده نمیشود
    if(!roles.includes(req.user.role)){
      return next(new AppError('شما مجاز به انجام این عملیات نیستید'))
    }
    next()
  }
}

exports.forgotPassword = async (req, res, next)=>{
  //get user based on posted email
  //دریافت کاربر بر اساس ایمیل
  const user = await User.findOne({email:req.body.email})
  if(!user) {
    return next(new AppError('کاربر با این ایمیل پیدا نشد',404))
  }
  //ساخت توکن تصادفی
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave:false});

  //ارسال به ایمیل یوزر
  res.status(200).send({
    status: 'success',
    message: 'معتبر تا 10 دقیقه',
    resetToken,
  })
}
exports.resetPassword = (req, res, next)=>{}