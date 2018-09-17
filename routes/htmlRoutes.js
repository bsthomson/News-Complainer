module.exports = function (app) {
  app.get('/', (req, res) => {
    res.redirect('/dashboard');
  })
  app.get('/dashboard', (req, res) => {
    res.render('dashboard')
  });

  app.get('*', function (req, res) {
    res.render('404');
  });
  app.use(function (req, res) {
    res.status(404).send(`Sorry can't find that!`);
  });
};