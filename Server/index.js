const express = require('express');
const mongoose = require('mongoose');
// const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

// require('dotenv').config()

// const sslRedirect = require('heroku-ssl-redirect');

const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require("passport-local");

require('./classModels/User'); 
require('./classModels/NonOrgs');
require('./classModels/TodoTasks');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to Mongo');
})
// Check for db error
db.on('error', (err) => {
    console.log(err);
})

const app = express();
app.use(bodyParser.json());

var cookieParser = require('cookie-parser');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
    secret: 'It\'s formothernature, super secret key',
    resave: false,      // forces the session to be saved back to the store
    saveUninitialized: false, // dont save unmodified
    // cookie: { secure: true }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
    // done(No error, mongoDB generate unique ID)
    done(null, user.id);
});
// Function we write to turn into user.id to user
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10
  });
// app.use("/api/", apiLimiter);


// require('./routes/authRoutes')(app);
// require('./routes/signUpRoutes')(app);

require('./routes/userSignupRoutes')(app, db);
require('./routes/loginRoutes')(app, db);
require('./routes/orgImagesRoutes')(app, db);
require('./routes/adminImagesRoutes')(app, db);
require('./routes/artistsImagesRoutes')(app, db);
require('./routes/usersListRoutes')(app, db);
require('./routes/faqsRoutes')(app, db);
require('./routes/todosRoutes')(app, db);
// require('./services/scheduler')(app, db);

if (process.env.NODE_ENV === 'production') {
    // Express will server up production assets like main.css or main.js
    app.use(express.static('client/build'));
    // app.use(express.static(__dirname + '/uploads'));
    
    const path = require('path');
    // Express serves up index.html if it doesn't recognize the route
    app.get('*', (req, res) => { // Catch the rest
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

        // res.sendFile(__dirname + '/public/file-upload.html');
    });
}

const PORT = process.env.PORT || 5005;
app.listen( PORT );
