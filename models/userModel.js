const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt =require('bcryptjs');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'لطفا نام را وارد کنید']
    },
    lastname: {
        type: String,
        require: [true, 'لطفا نام خوانوادگی را وارد کنید']
    },
    email: {
        type: String,
        required: [true, 'لطفا ایمیل را وارد کنید'],
        lowercase: true,
        validate: [validator.isEmail, 'لطفا یک ایمیل معتبر وارد کنید']
    },
    password: {
        type: String,
        required: [true, 'لطفا یک پسورد معتبر وارد کنید'],
        minlength: 8,
        select: false
    },
    passwordconfrim: {
        type: String,
        required: [true, 'لطفا رمز عبور خود را تایید کنید'],
        select: false,
        validate: {
            // this only works on create and save !!
            validator: function (el) {
                return el === this.password;
            },
            message: 'رمزهای عبور یکسان نیستند!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
 
userSchema.pre('save',async function(next){
    //only run this function if password was actully modified

    if(!this.isModified('password')){
        return next()
    }

    // hash  the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);

    //delete passwordconfrim field
    this.passwordconfrim = undefined; 
    next();
  
    
})


const User = mongoose.model('User', userSchema);

module.exports = User;

