const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signup = function(req, res, next) {
  const { email, password } = req.body

  User
    .findOne({ email })
    .then((user) => {
      if (user) return res.status(422).send({ error: 'Email is in use' })

      const newUser = new User({ email, password })
      newUser
        .save()
        .then(() => {
          res.json({ token: tokenForUser(newUser) })
        })
        .catch(() => next())
    })
    .catch(() => next())
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) })
}