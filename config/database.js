const mongoose = require('mongoose');

const connectToDB = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/blogging_db')
    .then(()=>{
        console.log(`Connected To DB`);
    }).catch((err)=>{
        console.log(`Error is DB Connection ${err}`);
    });
}

module.exports = connectToDB;