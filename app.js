var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')

const exphbs = require('express-handlebars');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const hbs=require('express-handlebars')


const app = express();
var fileUpload=require('express-fileupload')
var db=require('./config/connection')
var session=require('express-session')

//nhh

const Handlebars = require('handlebars');
// Sample data
const yourData = {
  status: 'active'
};
// Template
const yourTemplate = '{{status}}';
// Compile template with options
const template = Handlebars.compile(yourTemplate, {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true
});
// Render template with data
const result = template(yourData);
console.log(result);  // Output: 'active'




// Create an instance of the handlebars engine with the necessary runtime options
//const hbs = exphbs.create({
 // defaultLayout: 'main',
 // extname: '.hbs',
 // runtimeOptions: {
    //  allowProtoPropertiesByDefault: true,
    //  allowProtoMethodsByDefault: true,
 // }
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname: 'hbs',defaultLayout: 'layout',layoutsDir: path.join(__dirname, 'views', 'layout'),partialsDir: path.join(__dirname, 'views', 'partials')}));
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"Key",cookie:{maxAge:600000}}))

db.connect((err)=>{
  if (err)
    console.log("Error not connected"+err)
  else
  console.log("Data base connected")
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
