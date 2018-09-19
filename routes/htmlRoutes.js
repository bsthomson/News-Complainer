var db = require('../models')

module.exports = function (app) {
  const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard')
    } else {
      next()
    }
  }

  app.get('/', sessionChecker, (req, res) => {
    res.redirect('/signup')
  })

  app.route('/signup')
    .get(sessionChecker, (req, res) => {
      res.render('signup')
    })
    .then(user => {
      if (req.body.passwordsignup !== req.body.confirmpw) {
        alert('Passwords do not match!')
        res.redirect('/signup')
      } else {
        next()
      }
    })
    .post((req, res) => {
      db.User.create({
        userName: req.body.usernamesignup,
        password: req.body.passwordsignup
      })
        .then(user => {
          req.session.user = user.dataValues
          res.redirect('/dashboard')
        })
        .catch(error => {
          console.log(error)
          res.redirect('/signup')
        })
    })

  app.route('/login')
    .get(sessionChecker, (req, res) => {
      res.render('login')
    })
    .post((req, res) => {
      const username = req.body.username
      const password = req.body.password
      db.User.findOne({ username: username })
        .then(function (user) {
          if (!user) {
            res.redirect('/login')
          } else if (!user.comparePassword(password)) {
            res.redirect('/login')
          } else {
            req.session.user = user.dataValues
            res.redirect('/dashboard')
          }
        })
    })

  app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('dashboard')
    } else {
      res.redirect('/login')
    }
  })

  app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid')
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  })

  app.get('*', function (req, res) {
    res.render('404')
  })
  app.use(function (req, res) {
    res.status(404).send(`Sorry can't find that!`)
  })
}
