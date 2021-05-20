const path = require('path');
const express = require('express');
const passport = require('passport');
const AtlassianStrategy = require('passport-atlassian-oauth2');

passport.use(new AtlassianStrategy({
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackURL: `${process.env.AUTH_SERVICE_URL}/auth/atlassian/callback`,
  scope: 'offline_access read:jira-user',
}, (accessToken, refreshToken, profile, cb) => {
  profile.accessToken = accessToken;
  cb(null, profile);
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { baseUrl: process.env.AUTH_SERVICE_URL});
});

app.get('/auth/atlassian', passport.authenticate('atlassian'));

app.get('/auth/atlassian/callback', passport.authenticate('atlassian', { failureRedirect: '/error' }), (req, res) => {
  // TODO: Redirect to downloads page with access token
  // req.user.accessToken will have the accessToken
  res.send('Qualitia Download Page');
});

app.get('/error', (req, res) => {
  // TODO: Show a proper error messag page
  // res.send('Authorization error :(');
  res.send('error')
});

module.exports = app