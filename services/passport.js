const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(
  localOptions,
  function(email, password, done) {
    User
      .findOne({ email })
      .then((user) => {
        if (!user) return done(null, false)

        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err)

          return (isMatch) ? done(null, user) : done(null, false)
        })
      })
      .catch(() => done(null, false))
  }  
)

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(
  jwtOptions, 
  function(payload, done) {
    User
      .findById(payload.sub)
      .then((user) => {
        if (!user) return done(null, false)

        done(null, user)
      })
      .catch(() => done(null, false))
    }
)

passport.use(jwtLogin)
passport.use(localLogin)