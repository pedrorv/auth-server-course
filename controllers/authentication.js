const User = require('../models/user')

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
          res.json({ message: 'User was successfully saved.' })
        })
        .catch(() => next)
    })
    .catch((err) => next)
}