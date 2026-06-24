const passport = require('passport');

function renderLogin(req, res) {
  res.redirect('/admin');
}

const login = passport.authenticate('local', {
  failureRedirect: '/admin?error=login',
  successRedirect: '/admin',
});

function logout(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.redirect('/admin');
  });
}

module.exports = {
  renderLogin,
  login,
  logout,
};
