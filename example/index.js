var express = require('express')
var session = require('express-session')
var passport = require('passport')
var axios = require('axios')
var MendeleyStrategy = require('../lib').Strategy

// these are needed for storing the user in the session
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

// add the Mendeley authentication strategy
passport.use(new MendeleyStrategy({
  state: true, // remove this if not using sessions
  clientID: process.env.MENDELEY_CLIENT_ID,
  clientSecret: process.env.MENDELEY_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/api/auth/mendeley/callback'
}, async function (accessToken, refreshToken, params, profile, done) {
  // `profile` is empty as Mendeley has no generic profile URL,
  // so populate the profile object from the api instead
  const { data: profileData } = await axios.get('https://api.mendeley.com/profiles/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })

  // Example call to mendeley to get your papers.
  const { data: papers } = await axios.get('https://api.mendeley.com/documents', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })

  profile = { email: profileData.email, papers }
  return done(null, profile)
}))

var app = express()

app.use(session({ secret: 'foo', resave: false, saveUninitialized: false }))
app.use('/files', express.static('files'))

app.use(passport.initialize())
app.use(passport.session())

// show sign in or sign out link
app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.send('<a href="/auth/logout">Sign out</a>')
  } else {
    res.send('<a href="/auth/Mendeley/login">Sign in with Mendeley</a>')
  }
})

// start authenticating with Mendeley
app.get('/auth/mendeley/login', passport.authenticate('mendeley'))

// finish authenticating with Mendeley
app.get('/api/auth/mendeley/callback', passport.authenticate('mendeley', {
  successRedirect: '/profile',
  failureRedirect: '/'
}))

// sign out
app.get('/auth/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// show the authenticated user's profile data
app.get('/profile', checkAuth, function (req, res) {
  res.json(req.user)
})

function checkAuth (req, res, next) {
  if (!req.isAuthenticated()) res.redirect('/api/auth/mendeley/login')
  return next()
}

app.listen(3001, function (err) {
  if (err) return console.log(err)
  console.log('Listening at http://localhost:3001/')
})
