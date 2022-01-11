const mongoose = require('mongoose')
const validator = require('validator')


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

const User = mongoose.model('users',userSchema);

module.exports = User;

