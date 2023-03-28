const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var session = require('express-session')
const path = require('path')
var indexRouter = require('./routes/index');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(require("cors")({ credentials: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);


// port
const PORT = 8080;

// server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

