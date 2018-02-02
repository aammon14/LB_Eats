const dotenv = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

const auth = require('./services/auth.js');
app.use(auth.passportInstance);
app.use(auth.passportSession);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('users/login');
});

const userRouter = require('./controllers/users.js')
app.use('/users', userRouter);

const restaurantsRouter = require('./controllers/restaurants');
app.use('/restaurants', restaurantsRouter);

var moment = require('moment');
//console.log(moment('7').format('dddd'));

app.get('/day', (req, res) => {
  const dayNum = req.query.dayNum;
  res.json(moment().day(dayNum).format('dddd'));
});

app.use((err, req, res, next) => {
  console.log('Error encountered:', err);
  res.status(500);
  res.send(err);
});

app.listen(PORT, () => { console.log("Server started on " + PORT); });