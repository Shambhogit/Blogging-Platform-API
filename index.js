const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const connectToDB = require('./config/database');
connectToDB();

const userRouter = require('./routes/user.routes');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

// user route
app.use('/api/v1/user', userRouter);

app.listen(PORT, (err)=>{
    if(err){
        console.log(`Error in Listen function : ${err}`);
    }else{
        console.log(`Server is listening on ${PORT} port`);
    }
})