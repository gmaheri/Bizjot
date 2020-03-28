const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const passport = require('passport')


//load environment var
dotenv.config({path: './config/config.env'});

//Passport Config
require('./config/passport')(passport);

//connect to DB
connectDB();

const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method Override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variable
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title : title
  })
});

//About Route
app.get('/about', (req, res) => {
  res.render('about')
});

//Ideas routes
app.use('/ideas', require('./routers/ideas'));

//Users routes
app.use('/users', require('./routers/users'))

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
});
