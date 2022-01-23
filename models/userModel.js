const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'لطفا نام را وارد کنید'],
    },
    lastname: {
        type: String,
        require: [true, 'لطفا نام خوانوادگی را وارد کنید'],
    },
    email: {
        type: String,
        required: [true, 'لطفا ایمیل را وارد کنید'],
        unique: [true, 'این ایمیل ثبت شده است'],
        lowercase: true,
        validate: [validator.isEmail, 'لطفا یک ایمیل معتبر وارد کنید'],
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'lead-admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'لطفا یک پسورد معتبر وارد کنید'],
        minlength: 8,
        select: true,
    },
    passwordconfirm: {
        type: String,
        required: [true, 'لطفا رمز عبور خود را تایید کنید'],
        select: true,
        validate: {
            // this only works on create and save !!
            validator: function (el) {
                return el === this.password;
            },
            message: 'رمزهای عبور یکسان نیستند!',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//اگر پسورد عوض شده باشد
userSchema.methods.changedPasswordAfter = function (JTWTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        // اگر زمان تغیر بیش از زمان ثبت بود توکن صادر میشود
        return JTWTimestamp < changedTimestamp; // 100 < 200 مثال
    }
    // اگر زمان تغیر کم تر  از زمان ثبت شده باشد (فالس) برگرداننده میشود
    // به معنی اینکه پسورد اپدیت یا تغییر داده نشده است
    return false;
};

userSchema.pre('save', async function (next) {
    //only run this function if password was actully modified

    if (!this.isModified('password')) {
        return next();
    }
    // hash  the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //delete passwordconfrim field
    this.passwordconfirm = undefined;
    next();
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');


    //ده دقیقه میتواند پسورد را ریست دهد
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;

};

const User = mongoose.model('User', userSchema);

module.exports = User;
