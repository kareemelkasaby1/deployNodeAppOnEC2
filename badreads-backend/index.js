require('dotenv').config();

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const authorRouter = require("./routes/authorRoute");
const adminRouter = require('./routes/admin')
const bookRouter = require("./routes/bookRoute");
const categoryRouter = require("./routes/categoryRoute");
const rate = require("./routes/rate");
const userBook = require("./routes/userBook");
const review = require("./routes/reviewBook");
const homeRouter = require("./routes/homeRoute");
const utils = require('./helpers/util.js');



var app = express();
mongoose.connect('mongodb://mongo:27017/badReads',{auth: {"authSource": "admin"}, user: "admin", pass: "123456", useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////
mongoose.set('useFindAndModify', false);

////////////////
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue
   
    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      } else {
        req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
  });


  
app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/author',authorRouter);
app.use('/admin',adminRouter);
app.use('/book',bookRouter);
app.use('/category',categoryRouter);
app.use('/rate',rate);
app.use('/userBook',userBook);
app.use('/review',review);
app.use('/',homeRouter);


app.listen(4000, "0.0.0.0", function () {
    console.log('listening on port 4000! version1 with ip');
});
//build b2a y ebn el maraaaaaaaaaaaaaaaaaa -_- 