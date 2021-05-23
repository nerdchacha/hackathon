const path = require('path')
const express = require('express')
const passport = require('passport')
const AtlassianStrategy = require('passport-atlassian-oauth2')
const cors = require('cors')

const routes = require('./routes');
const { checkUserAccess } = require('./middleware');

passport.use(new AtlassianStrategy({
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackURL: `${process.env.AUTH_SERVICE_URL}/auth/atlassian/callback`,
  scope: 'offline_access read:jira-user',
}, (accessToken, refreshToken, profile, cb) => {
  profile.accessToken = accessToken
  cb(null, profile)
}))

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

const app = express()

app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/atlassian', passport.authenticate('atlassian'))

app.get('/auth/atlassian/callback', passport.authenticate('atlassian', { failureRedirect: '/error' }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}?accessToken=${req.user.accessToken}`)
})

app.get('/error', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/no-access`)
})

app.use(checkUserAccess);
app.use('/api', routes)

module.exports = app