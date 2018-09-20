const axios = require('axios')
const cheerio = require('cheerio')
//  const request = require('request')

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
    .post((req, res) => {
      db.User.create({
        userName: req.body.usernamesignup,
        password: req.body.passwordsignup
      })
        .then(user => {
          req.session.user = user.userName
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
      db.User.findOne({ userName: username })
        .populate('article')
        .then(function (user) {
          if (!user) {
            res.redirect('/login')
          } else if (!user.comparePassword(password)) {
            console.log('!password')
            res.redirect('/login')
          } else {
            req.session.user = user.userName
            res.redirect('/dashboard')
          }
        })
        .catch(error => console.log(error))
    })

  app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('dashboard')
    } else {
      res.redirect('/login')
    }
  })

  app.get('/scrape', function (req, res) {
    axios.get('http://www.politico.com/')
      .then(function (response) {
        console.log(response)
        const $ = cheerio.load(response.data)

        $('headline h1').each(function (i, element) {
          let result = {}

          result.title = $(this)
            .children('a')
            .text()
          result.link = $(this)
            .children('a')
            .attr('href')

          db.Article.create(result)
            .populate
            .then(function (dbArticle) {
              console.log(dbArticle)
            })
            .catch(function (err) {
              return res.json(err)
            })
        })

        res.send('Scrape Complete')
      })
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
