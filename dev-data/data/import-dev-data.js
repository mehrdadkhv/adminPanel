const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/userModel');


dotenv.config({ path: '../../config.env' })


// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL


mongoose
    .connect(DB, {
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

// read json file

const users = JSON.parse(fs.readFileSync(`${__dirname}/users-simple.json`, 'utf-8'));

// import data into db

const importData = async () => {
    try {
        await User.create(users)
        console.log('Data successfully loaded');
    } catch (err) {
        console.log(err);
    }
process.exit();
}


//delete all data from collection

const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData();
}


console.log(process.argv);